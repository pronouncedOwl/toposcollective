import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';

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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    description,
    short_description,
    long_description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    price,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    short_description,
    long_description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS = `
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
  featured,
  sort_order,
  units (
    id,
    name,
    unit_code,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    description,
    short_description,
    long_description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  units (
    id,
    name,
    unit_code,
    price,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    short_description,
    long_description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
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
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS = `
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
  featured,
  sort_order,
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
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
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
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS = `
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
  featured,
  sort_order,
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
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      role,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_MIN = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
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
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_MIN_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  project_photos (
    id,
    storage_path,
    role,
    alt_text,
    caption,
    metadata,
    sort_order
  ),
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS = `
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
  featured,
  sort_order,
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
      metadata,
      sort_order
    )
  )
`;

const PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS_WITH_UNIT_SALES = `
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
  featured,
  sort_order,
  units (
    id,
    name,
    unit_code,
    sold_price,
    bedrooms,
    bathrooms,
    square_feet,
    time_on_market_days,
    description,
    floorplan_url,
    availability_status,
    sort_order,
    unit_photos (
      id,
      storage_path,
      alt_text,
      caption,
      metadata,
      sort_order
    )
  )
`;

export type PublicUnitPhoto = {
  id: string;
  storage_path: string;
  role?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  metadata?: Record<string, unknown> | null;
  sort_order?: number | null;
};

export type PublicProjectPhoto = {
  id: string;
  storage_path: string;
  role?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  metadata?: Record<string, unknown> | null;
  sort_order?: number | null;
};

export type PublicUnit = {
  id: string;
  name: string;
  unit_code: string | null;
  price?: number | null;
  sold_price?: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  time_on_market_days?: number | null;
  description: string | null;
  short_description?: string | null;
  long_description?: string | null;
  floorplan_url: string | null;
  availability_status: string | null;
  sort_order: number | null;
  unit_photos?: PublicUnitPhoto[];
};

export type PublicProject = {
  id: string;
  slug: string;
  name: string;
  status: 'coming_soon' | 'completed';
  is_public: boolean;
  address_line1: string;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  total_units: number | null;
  short_description: string | null;
  long_description: string | null;
  featured: boolean;
  sort_order: number | null;
  project_photos?: PublicProjectPhoto[];
  units?: PublicUnit[];
};

type PublicProjectsOptions = {
  includePrivate?: boolean;
};

export async function getPublicProjectsByStatus(
  status: 'coming_soon' | 'completed',
  options: PublicProjectsOptions = {}
): Promise<PublicProject[]> {
  const client = supabaseAdmin ?? supabase;
  const baseQuery = (select: string) => {
    let query = client
      .from('projects')
      .select(select)
      .eq('status', status)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!options.includePrivate) {
      query = query.eq('is_public', true);
    }

    return query;
  };

  const { data, error } = await baseQuery(PUBLIC_PROJECT_SELECT_WITH_UNIT_SALES);

  if (error) {
    const message = error.message?.toLowerCase() || '';
    const missingProjectPhotos = message.includes('project_photos');
    const missingUnitRole = message.includes('unit_photos') && message.includes('role');
    const missingUnitPrice = message.includes('units') && message.includes('price');
    const missingUnitSales =
      message.includes('sold_price') || message.includes('time_on_market_days');

    const orderedFallbacks = [
      missingUnitSales && missingProjectPhotos && missingUnitRole && missingUnitPrice && PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS,
      missingUnitSales && missingProjectPhotos && missingUnitRole && PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS,
      missingUnitSales && missingProjectPhotos && missingUnitPrice && PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS,
      missingUnitSales && missingProjectPhotos && PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS,
      missingUnitSales && missingUnitRole && missingUnitPrice && PUBLIC_PROJECT_SELECT_LEGACY_MIN,
      missingUnitSales && missingUnitRole && PUBLIC_PROJECT_SELECT_LEGACY,
      missingUnitSales && missingUnitPrice && PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE,
      missingUnitSales && PUBLIC_PROJECT_SELECT,
      missingProjectPhotos && missingUnitRole && missingUnitPrice && PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS,
      missingProjectPhotos && missingUnitRole && PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS,
      missingProjectPhotos && missingUnitPrice && PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS,
      missingProjectPhotos && PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS,
      missingUnitRole && missingUnitPrice && PUBLIC_PROJECT_SELECT_LEGACY_MIN,
      missingUnitRole && PUBLIC_PROJECT_SELECT_LEGACY,
      missingUnitPrice && PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE,
      PUBLIC_PROJECT_SELECT,
      PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS,
      PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS,
      PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS,
      PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS,
      PUBLIC_PROJECT_SELECT_LEGACY,
      PUBLIC_PROJECT_SELECT_LEGACY_MIN,
      PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE,
      PUBLIC_PROJECT_SELECT_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_NO_PROJECT_PHOTOS_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_NO_UNIT_PRICE_NO_PROJECT_PHOTOS_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_LEGACY_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_LEGACY_NO_PROJECT_PHOTOS_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_LEGACY_MIN_WITH_UNIT_SALES,
      PUBLIC_PROJECT_SELECT_LEGACY_MIN_NO_PROJECT_PHOTOS_WITH_UNIT_SALES,
    ].filter(Boolean) as string[];

    for (const select of orderedFallbacks) {
      const legacy = await baseQuery(select);
      if (!legacy.error) {
        return (legacy.data as unknown as PublicProject[]) || [];
      }
    }

    console.error('[projects-public] Failed to load projects:', error);
    return [];
  }

  return (data as unknown as PublicProject[]) || [];
}

