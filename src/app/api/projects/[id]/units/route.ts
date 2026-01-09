import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../lib/admin-auth';
import { badRequestResponse, createdResponse, errorResponse } from '../../../../../lib/api-response';
import { insertUnits } from '../../../../../lib/projects-service';
import { projectInputSchema } from '../../../../../lib/projects-validation';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const parsed = projectInputSchema.pick({ units: true }).safeParse(body);

    if (!parsed.success) {
      return badRequestResponse('Invalid units payload', parsed.error.flatten());
    }

    const units = parsed.data.units || [];

    if (!units.length) {
      return badRequestResponse('No units provided');
    }

    const { data, error } = await insertUnits(params.id, units);

    if (error) {
      console.error('[projects/:id/units][POST] Failed to insert units:', error);
      return errorResponse('Failed to insert units', error.message);
    }

    return createdResponse({ units: data });
  } catch (error) {
    console.error('[projects/:id/units][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
