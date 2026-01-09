import { supabaseAdmin } from './supabase';
import { mapUnitInputToRow, UnitInput } from './projects-validation';

const PROJECTS_TABLE = 'projects';
const UNITS_TABLE = 'units';
const PROJECT_PHOTOS_TABLE = 'project_photos';
const UNIT_PHOTOS_TABLE = 'unit_photos';

type IncludeOptions = {
  units?: boolean;
  photos?: boolean;
};

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const buildSelect = (options: IncludeOptions) => {
  const selections = ['*'];
  if (options.units) {
    selections.push('units(*)');
  }
  if (options.photos) {
    selections.push('project_photos(*)');
  }
  return selections.join(',');
};

export async function fetchProjects(options: IncludeOptions & { status?: string | null; featured?: boolean | null; isPublic?: boolean | null; limit?: number | null }) {
  const selectColumns = buildSelect(options);
  let query = supabaseAdmin
    .from(PROJECTS_TABLE)
    .select(selectColumns)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.featured) {
    query = query.eq('featured', true);
  }

  if (typeof options.isPublic === 'boolean') {
    query = query.eq('is_public', options.isPublic);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export async function fetchProjectByIdentifier(identifier: string, options: IncludeOptions) {
  const selectColumns = buildSelect(options);
  const query = supabaseAdmin.from(PROJECTS_TABLE).select(selectColumns).limit(1);

  const isId = isUuid(identifier);
  const baseQuery = isId ? query.eq('id', identifier) : query.eq('slug', identifier);

  return baseQuery.single();
}

export async function insertUnits(projectId: string, units: UnitInput[]) {
  if (!units.length) {
    return { data: null, error: null };
  }

  const rows = units.map((unit) => {
    const row = mapUnitInputToRow(unit, projectId);
    delete (row as { id?: string }).id;
    return row;
  });

  return supabaseAdmin.from(UNITS_TABLE).insert(rows).select();
}

export async function updateUnit(projectId: string, unitId: string, updates: UnitInput) {
  const row = mapUnitInputToRow(updates, projectId);
  delete (row as { id?: string }).id;

  return supabaseAdmin
    .from(UNITS_TABLE)
    .update(row)
    .eq('id', unitId)
    .eq('project_id', projectId)
    .select()
    .single();
}

export async function deleteUnit(projectId: string, unitId: string) {
  return supabaseAdmin.from(UNITS_TABLE).delete().eq('id', unitId).eq('project_id', projectId);
}

export async function insertProjectPhoto(projectId: string, payload: { storage_path: string; role?: string | null; alt_text?: string | null; caption?: string | null; sort_order?: number | null; metadata?: Record<string, unknown> }) {
  return supabaseAdmin.from(PROJECT_PHOTOS_TABLE).insert([{ project_id: projectId, ...payload }]).select().single();
}

export async function insertUnitPhoto(unitId: string, payload: { storage_path: string; alt_text?: string | null; caption?: string | null; sort_order?: number | null; metadata?: Record<string, unknown> }) {
  return supabaseAdmin.from(UNIT_PHOTOS_TABLE).insert([{ unit_id: unitId, ...payload }]).select().single();
}

export async function deleteProjectPhoto(photoId: string) {
  return supabaseAdmin.from(PROJECT_PHOTOS_TABLE).delete().eq('id', photoId);
}

export async function deleteUnitPhoto(photoId: string) {
  return supabaseAdmin.from(UNIT_PHOTOS_TABLE).delete().eq('id', photoId);
}

