import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../../../../lib/api-response';
import { ensureAdminRequest } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';
import {
  mapProjectInputToRow,
  projectInputSchema,
} from '../../../../lib/projects-validation';
import { fetchProjectByIdentifier, insertUnits, updateUnit } from '../../../../lib/projects-service';
import { UnitInput } from '../../../../lib/projects-validation';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const syncUnits = async (projectId: string, units: UnitInput[]) => {
  const { data: existingUnits } = await supabaseAdmin
    .from('units')
    .select('id')
    .eq('project_id', projectId);

  const incomingIds = new Set(units.filter((unit) => unit.id).map((unit) => unit.id as string));

  const toDelete = (existingUnits || [])
    .filter((unit) => !incomingIds.has(unit.id))
    .map((unit) => unit.id);

  if (toDelete.length) {
    await supabaseAdmin.from('units').delete().in('id', toDelete);
  }

  const creations = units.filter((unit) => !unit.id);
  if (creations.length) {
    await insertUnits(projectId, creations);
  }

  const updates = units.filter((unit) => unit.id);
  await Promise.all(updates.map((unit) => updateUnit(projectId, unit.id as string, unit)));
};

const parseIncludes = (includeParam: string | null) => {
  const set = new Set((includeParam || '').split(',').map((entry) => entry.trim().toLowerCase()).filter(Boolean));
  return {
    units: set.has('units'),
    photos: set.has('photos'),
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const include = parseIncludes(new URL(request.url).searchParams.get('include'));
    const { data, error } = await fetchProjectByIdentifier(params.id, include);

    if (error || !data) {
      console.error('[projects/:id][GET] Error fetching project:', error);
      return notFoundResponse('Project not found');
    }

    return successResponse({ project: data });
  } catch (error) {
    console.error('[projects/:id][GET] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const params = await context.params;
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
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(projectRow)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      console.error('[projects/:id][PUT] Failed to update project:', error);
      return notFoundResponse('Project not found');
    }

    if (parsed.data.units) {
      await syncUnits(params.id, parsed.data.units);
    }

    const { data: hydrated, error: fetchError } = await fetchProjectByIdentifier(params.id, {
      units: true,
      photos: true,
    });

    if (fetchError) {
      console.error('[projects/:id][PUT] Failed to hydrate project:', fetchError);
    }

    return successResponse({ project: hydrated ?? data });
  } catch (error) {
    console.error('[projects/:id][PUT] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', params.id);

    if (error) {
      console.error('[projects/:id][DELETE] Failed to delete project:', error);
      return errorResponse('Failed to delete project', error.message);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('[projects/:id][DELETE] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
