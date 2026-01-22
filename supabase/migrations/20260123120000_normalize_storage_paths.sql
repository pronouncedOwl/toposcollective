-- Normalize storage_path values that were saved as full Supabase URLs.
-- This keeps storage_path consistent with expected bucket object paths.

do $$
begin
  update public.project_photos
  set storage_path = regexp_replace(
    regexp_replace(
      storage_path,
      '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/',
      ''
    ),
    '\\?.*$',
    ''
  )
  where storage_path ~* '^https?://'
    and storage_path ~* '/storage/v1/object/(public|sign)/';

  update public.unit_photos
  set storage_path = regexp_replace(
    regexp_replace(
      storage_path,
      '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/',
      ''
    ),
    '\\?.*$',
    ''
  )
  where storage_path ~* '^https?://'
    and storage_path ~* '/storage/v1/object/(public|sign)/';

  update public.gallery_photos
  set storage_path = regexp_replace(
    regexp_replace(
      storage_path,
      '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/',
      ''
    ),
    '\\?.*$',
    ''
  )
  where storage_path ~* '^https?://'
    and storage_path ~* '/storage/v1/object/(public|sign)/';

  update public.units
  set floorplan_url = regexp_replace(
    regexp_replace(
      floorplan_url,
      '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/',
      ''
    ),
    '\\?.*$',
    ''
  )
  where floorplan_url is not null
    and floorplan_url ~* '^https?://'
    and floorplan_url ~* '/storage/v1/object/(public|sign)/';
end $$;
