import { supabase } from './supabase';

const PUBLIC_PROJECT_SELECT = `
  id,
  slug,
  name,
  status,
  is_public,
  address_line1,
  address_line2,
  city,
  state,
  postal_code,
  country,
  estimated_completion,
  actual_completion,
  total_units,
  short_description,
  long_description,
  hero_image_url,
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    bedrooms,
    bathrooms,
    square_feet,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      alt_text,
      caption,
      sort_order
    )
  )
`;

export type PublicProject = Awaited<ReturnType<typeof getPublicProjectsByStatus>>[number];

export async function getPublicProjectsByStatus(status: 'coming_soon' | 'completed') {
  const { data, error } = await supabase
    .from('projects')
    .select(PUBLIC_PROJECT_SELECT)
    .eq('status', status)
    .eq('is_public', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[projects-public] Failed to load projects:', error);
    return [];
  }

  return data || [];
}

