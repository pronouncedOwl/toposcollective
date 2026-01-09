import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  createdResponse,
  errorResponse,
  successResponse,
} from '../../../lib/api-response';
import { ensureAdminRequest } from '../../../lib/admin-auth';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  mapProjectInputToRow,
  projectInputSchema,
} from '../../../lib/projects-validation';
import {
  fetchProjects,
  fetchProjectByIdentifier,
  insertUnits,
} from '../../../lib/projects-service';

const parseIncludes = (includeParam: string | null) => {
  const set = new Set((includeParam || '').split(',').map((entry) => entry.trim().toLowerCase()).filter(Boolean));
  return {
    units: set.has('units'),
    photos: set.has('photos'),
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured') === 'true';
    const isPublic = searchParams.get('public');
    const limitParam = searchParams.get('limit');
    const include = parseIncludes(searchParams.get('include'));

    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : null;
    const allowedStatuses = new Set(['coming_soon', 'completed']);

    if (status && !allowedStatuses.has(status)) {
      return badRequestResponse('Invalid status filter');
    }

    const query = await fetchProjects({
      status,
      featured: featured || null,
      isPublic: isPublic === null ? null : isPublic === 'true',
      limit,
      ...include,
    });

    const { data, error } = await query;

    if (error) {
      console.error('[projects][GET] Supabase error:', error);
      return errorResponse('Failed to fetch projects', error.message);
    }

    return successResponse({ projects: data ?? [] });
  } catch (error) {
    console.error('[projects][GET] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function POST(request: NextRequest) {
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const parsed = projectInputSchema.safeParse(body);

    if (!parsed.success) {
      return badRequestResponse('Invalid project payload', parsed.error.flatten());
    }

    const projectRow = mapProjectInputToRow(parsed.data);

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([projectRow])
      .select()
      .single();

    if (error || !project) {
      console.error('[projects][POST] Failed to insert project:', error);
      return errorResponse('Failed to create project', error?.message);
    }

    if (parsed.data.units?.length) {
      const { error: unitsError } = await insertUnits(project.id, parsed.data.units);
      if (unitsError) {
        console.error('[projects][POST] Failed to insert units:', unitsError);
        return errorResponse('Project created but adding units failed', unitsError.message, 207);
      }
    }

    const { data: hydrated, error: fetchError } = await fetchProjectByIdentifier(project.id, {
      units: true,
      photos: true,
    });

    if (fetchError) {
      console.error('[projects][POST] Failed to hydrate project:', fetchError);
    }

    return createdResponse({ project: hydrated ?? project });
  } catch (error) {
    console.error('[projects][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

