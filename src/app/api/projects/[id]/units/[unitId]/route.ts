import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, notFoundResponse, successResponse } from '../../../../../../lib/api-response';
import { deleteUnit, updateUnit } from '../../../../../../lib/projects-service';
import { UnitInput, unitInputSchema } from '../../../../../../lib/projects-validation';

export type RouteContext = {
  params: Promise<{
    id: string;
    unitId: string;
  }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const parsed = unitInputSchema.safeParse(body);

    if (!parsed.success) {
      return badRequestResponse('Invalid unit payload', parsed.error.flatten());
    }

    const unit = parsed.data as UnitInput;

    const { data, error } = await updateUnit(params.id, params.unitId, unit);

    if (error || !data) {
      console.error('[projects/:id/units/:unitId][PUT] Failed to update unit:', error);
      return notFoundResponse('Unit not found');
    }

    return successResponse({ unit: data });
  } catch (error) {
    console.error('[projects/:id/units/:unitId][PUT] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { error } = await deleteUnit(params.id, params.unitId);

    if (error) {
      console.error('[projects/:id/units/:unitId][DELETE] Failed to delete unit:', error);
      return errorResponse('Failed to delete unit', error.message);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('[projects/:id/units/:unitId][DELETE] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
