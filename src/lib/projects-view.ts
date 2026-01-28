import { getPublicProjectsByStatus, PublicProject } from '@/lib/projects-public';
import { getPublicUrl } from '@/lib/storage';

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type PublicUnit = NonNullable<PublicProject['units']>[number];

export type ProjectShowcaseItem = {
  id: string;
  slug: string;
  name: string;
  details: string;
  completionLabel: string;
  heroStripCandidates: {
    url: string;
    alt: string;
  }[];
  description?: string | null;
  longDescription?: string | null;
  units: {
    id: string;
    name: string;
    unitCode: string;
    price: number | null;
    squareFeet: number | null;
    shortDescription?: string | null;
    longDescription?: string | null;
    details: string;
    heroImage?: string | null;
    gallery: {
      id: string;
      url: string;
      alt: string;
    }[];
  }[];
};

export type ProjectUnitPageData = {
  project: PublicProject;
  unit: PublicUnit;
  heroImage: string | null;
  gallery: { id: string; url: string; alt: string }[];
  floorplanUrl: string | null;
  formattedPrice: string | null;
  stats: { label: string; value: string | number }[];
  availability: string;
  address: string;
  mapUrl: string | null;
  isStaticMap: boolean;
};

export type ProjectPageData = {
  project: PublicProject;
  heroImages: { url: string; alt: string }[];
  gallery: { id: string; url: string; alt: string }[];
  completionLabel: string;
  address: string;
  mapUrl: string | null;
  isStaticMap: boolean;
  units: {
    id: string;
    name: string;
    unitCode: string;
    price: number | null;
    formattedPrice: string | null;
    squareFeet: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    shortDescription: string | null;
    details: string;
    heroImage: string | null;
    availability: string;
  }[];
};

const normalizeSlug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

const formatCompletionLabel = (project: PublicProject) => {
  const date = project.actual_completion || project.estimated_completion;
  if (!date) return 'Completion date forthcoming';
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
  return project.status === 'completed' ? `Completed ${formatted}` : `Estimated completion ${formatted}`;
};

const formatPrice = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatAddress = (project: PublicProject) => {
  const segments = [
    project.address_line1,
    project.address_line2,
    project.city,
    project.state,
    project.postal_code,
  ].filter(Boolean);
  return segments.join(', ');
};

const getStaticMapUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const size = '600x400';
  const zoom = '16';

  if (mapsApiKey) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${size}&markers=color:0x3b7d98|${encodedAddress}&key=${mapsApiKey}`;
  }

  return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
};

const resolveImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return getPublicUrl(path);
};

const buildDetails = (project: PublicProject) => {
  if (project.units?.length) {
    return project.units
      .map((unit) => {
        const parts = [
          unit.bedrooms ? `${unit.bedrooms} bd` : null,
          unit.bathrooms ? `${unit.bathrooms} ba` : null,
          unit.square_feet ? `${unit.square_feet} sqft` : null,
        ].filter(Boolean);
        return parts.length ? `${unit.name}: ${parts.join(' • ')}` : unit.name;
      })
      .slice(0, 3)
      .join(' • ');
  }
  return project.short_description || 'Residential completion';
};

const buildUnitDetails = (unit: PublicUnit) => {
  const parts = [
    unit.bedrooms ? `${unit.bedrooms} bd` : null,
    unit.bathrooms ? `${unit.bathrooms} ba` : null,
    unit.square_feet ? `${unit.square_feet} sqft` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' • ') : unit.description || 'Residence';
};

const sortPhotos = <T extends { sort_order?: number | null }>(photos: T[]) =>
  photos
    .map((photo) => ({ ...photo, order: photo.sort_order ?? 0 }))
    .sort((a, b) => a.order - b.order);

const mapProjectToShowcase = async (project: PublicProject): Promise<ProjectShowcaseItem> => {
  const projectPhotos = sortPhotos(project.project_photos || []);
  const projectHeroCandidates = (
    await Promise.all(
      projectPhotos
        .filter((photo) => photo.role === 'hero')
        .map(async (photo) => {
          const url = resolveImageUrl(photo.storage_path);
          if (!url) return null;
          return {
            url,
            alt: photo.alt_text || `${project.name} photo`,
          };
        }),
    )
  ).filter(Boolean) as ProjectShowcaseItem['heroStripCandidates'];

  const unitMainCandidates = (
    await Promise.all(
      (project.units || []).map(async (unit) => {
        const sorted = sortPhotos(unit.unit_photos || []);
        const unitMain = sorted.find((photo) => photo.role === 'main') || sorted[0];
        const url = resolveImageUrl(unitMain?.storage_path || '');
        if (!url) return null;
        return {
          url,
          alt: unitMain?.alt_text || `${project.name} ${unit.name} photo`,
        };
      }),
    )
  ).filter(Boolean) as ProjectShowcaseItem['heroStripCandidates'];

  const units = await Promise.all(
    (project.units || []).map(async (unit) => {
      const sorted = sortPhotos(unit.unit_photos || []);
      const resolved = (
        await Promise.all(
          sorted.map(async (photo) => {
            const url = resolveImageUrl(photo.storage_path);
            if (!url) return null;
            return {
              id: photo.id,
              url,
              alt: photo.alt_text || `${project.name} ${unit.name} photo`,
            };
          })
        )
      ).filter(Boolean) as ProjectShowcaseItem['units'][number]['gallery'];

      const unitMain = sorted.find((photo) => photo.role === 'main')?.storage_path || sorted[0]?.storage_path;
      const unitMainUrl = resolveImageUrl(unitMain || '');

      return {
        id: unit.id,
        name: unit.name,
        unitCode: unit.unit_code || '',
        price: unit.price ?? null,
        squareFeet: unit.square_feet ?? null,
        shortDescription: unit.short_description ?? null,
        longDescription: unit.long_description ?? null,
        details: buildUnitDetails(unit),
        heroImage: unitMainUrl,
        gallery: resolved,
      };
    })
  );

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    details: buildDetails(project),
    description: project.short_description ?? null,
    longDescription: project.long_description ?? null,
    completionLabel: formatCompletionLabel(project),
    heroStripCandidates:
      projectHeroCandidates.length >= 4
        ? projectHeroCandidates
        : Array.from(new Map([...projectHeroCandidates, ...unitMainCandidates].map((image) => [image.url, image])).values()).slice(0, 4),
    units,
  };
};

export const getShowcaseProjects = async (status: 'coming_soon' | 'completed') => {
  const projects = await getPublicProjectsByStatus(status);
  return Promise.all(projects.map(mapProjectToShowcase));
};

export const getProjectUnitPageData = async (
  status: 'coming_soon' | 'completed',
  slug: string,
): Promise<ProjectUnitPageData | null> => {
  const candidates = await getPublicProjectsByStatus(status);

  const normalizedSlug = slug.toLowerCase();
  const match = candidates
    .map((project) => ({
      project,
      unit: (project.units || []).find((unit) => {
        const unitCode = unit.unit_code || '';
        return unit.id === slug || unitCode.toLowerCase() === normalizedSlug || normalizeSlug(unitCode) === normalizedSlug;
      }),
    }))
    .find((entry) => entry.unit);

  if (!match || !match.unit) {
    return null;
  }

  const { project, unit } = match;
  const address = formatAddress(project);
  const sortedPhotos = sortPhotos(unit.unit_photos || []);
  const heroPhotoPath =
    sortedPhotos.find((photo) => photo.role === 'main')?.storage_path || sortedPhotos[0]?.storage_path || '';
  const heroImage = resolveImageUrl(heroPhotoPath);
  const gallery = (
    await Promise.all(
      sortedPhotos.map(async (photo) => {
        const url = resolveImageUrl(photo.storage_path);
        if (!url) return null;
        return {
          id: photo.id,
          url,
          alt: photo.alt_text || `${project.name} ${unit.name} photo`,
        };
      })
    )
  ).filter(Boolean) as { id: string; url: string; alt: string }[];

  const floorplanUrl = resolveImageUrl(unit.floorplan_url || '');
  const formattedPrice = formatPrice(unit.price ?? null);
  const stats = [
    { label: 'Bedrooms', value: unit.bedrooms ?? '—' },
    { label: 'Bathrooms', value: unit.bathrooms ?? '—' },
    { label: 'Square Feet', value: unit.square_feet ?? '—' },
  ];
  const availability = unit.availability_status || 'Available';
  const mapUrl = address ? getStaticMapUrl(address) : null;

  return {
    project,
    unit,
    heroImage,
    gallery,
    floorplanUrl,
    formattedPrice,
    stats,
    availability,
    address,
    mapUrl,
    isStaticMap: Boolean(mapsApiKey),
  };
};

export const getUnitPageDataBySlug = async (
  projectSlug: string,
  unitSlug: string,
): Promise<ProjectUnitPageData | null> => {
  // Fetch both statuses to find the project
  const [completedProjects, comingSoonProjects] = await Promise.all([
    getPublicProjectsByStatus('completed'),
    getPublicProjectsByStatus('coming_soon'),
  ]);
  const allProjects = [...completedProjects, ...comingSoonProjects];

  const normalizedProjectSlug = normalizeSlug(projectSlug);
  const normalizedUnitSlug = unitSlug.toLowerCase();

  const project = allProjects.find(
    (p) => p.slug === projectSlug || p.slug === normalizedProjectSlug || (p.slug && normalizeSlug(p.slug) === normalizedProjectSlug)
  );

  if (!project) {
    return null;
  }

  const unit = (project.units || []).find((u) => {
    const unitCode = u.unit_code || '';
    return u.id === unitSlug || unitCode.toLowerCase() === normalizedUnitSlug || normalizeSlug(unitCode) === normalizedUnitSlug;
  });

  if (!unit) {
    return null;
  }

  const address = formatAddress(project);
  const sortedPhotos = sortPhotos(unit.unit_photos || []);
  const heroPhotoPath =
    sortedPhotos.find((photo) => photo.role === 'main')?.storage_path || sortedPhotos[0]?.storage_path || '';
  const heroImage = resolveImageUrl(heroPhotoPath);
  const gallery = (
    await Promise.all(
      sortedPhotos.map(async (photo) => {
        const url = resolveImageUrl(photo.storage_path);
        if (!url) return null;
        return {
          id: photo.id,
          url,
          alt: photo.alt_text || `${project.name} ${unit.name} photo`,
        };
      })
    )
  ).filter(Boolean) as { id: string; url: string; alt: string }[];

  const floorplanUrl = resolveImageUrl(unit.floorplan_url || '');
  const formattedPrice = formatPrice(unit.price ?? null);
  const stats = [
    { label: 'Bedrooms', value: unit.bedrooms ?? '—' },
    { label: 'Bathrooms', value: unit.bathrooms ?? '—' },
    { label: 'Square Feet', value: unit.square_feet ?? '—' },
  ];
  const availability = unit.availability_status || 'Available';
  const mapUrl = address ? getStaticMapUrl(address) : null;

  return {
    project,
    unit,
    heroImage,
    gallery,
    floorplanUrl,
    formattedPrice,
    stats,
    availability,
    address,
    mapUrl,
    isStaticMap: Boolean(mapsApiKey),
  };
};

export const getProjectPageData = async (slug: string): Promise<ProjectPageData | null> => {
  // Fetch both statuses to find the project
  const [completedProjects, comingSoonProjects] = await Promise.all([
    getPublicProjectsByStatus('completed'),
    getPublicProjectsByStatus('coming_soon'),
  ]);
  const allProjects = [...completedProjects, ...comingSoonProjects];

  const normalizedSlug = normalizeSlug(slug);
  const project = allProjects.find(
    (p) => p.slug === slug || p.slug === normalizedSlug || (p.slug && normalizeSlug(p.slug) === normalizedSlug)
  );

  if (!project) {
    return null;
  }

  const address = formatAddress(project);
  const mapUrl = address ? getStaticMapUrl(address) : null;
  const completionLabel = formatCompletionLabel(project);

  // Resolve project photos
  const sortedProjectPhotos = sortPhotos(project.project_photos || []);
  const heroImages = (
    await Promise.all(
      sortedProjectPhotos
        .filter((photo) => photo.role === 'hero' || photo.role === 'main')
        .slice(0, 4)
        .map(async (photo) => {
          const url = resolveImageUrl(photo.storage_path);
          if (!url) return null;
          return {
            url,
            alt: photo.alt_text || `${project.name} photo`,
          };
        })
    )
  ).filter(Boolean) as { url: string; alt: string }[];

  const gallery = (
    await Promise.all(
      sortedProjectPhotos.map(async (photo) => {
        const url = resolveImageUrl(photo.storage_path);
        if (!url) return null;
        return {
          id: photo.id,
          url,
          alt: photo.alt_text || `${project.name} photo`,
        };
      })
    )
  ).filter(Boolean) as { id: string; url: string; alt: string }[];

  // Resolve unit data
  const units = await Promise.all(
    (project.units || []).map(async (unit) => {
      const sortedUnitPhotos = sortPhotos(unit.unit_photos || []);
      const heroPhotoPath =
        sortedUnitPhotos.find((photo) => photo.role === 'main')?.storage_path ||
        sortedUnitPhotos[0]?.storage_path ||
        '';
      const heroImage = resolveImageUrl(heroPhotoPath);

      return {
        id: unit.id,
        name: unit.name,
        unitCode: unit.unit_code || '',
        price: unit.price ?? null,
        formattedPrice: formatPrice(unit.price ?? null),
        squareFeet: unit.square_feet ?? null,
        bedrooms: unit.bedrooms ?? null,
        bathrooms: unit.bathrooms ?? null,
        shortDescription: unit.short_description ?? null,
        details: buildUnitDetails(unit),
        heroImage,
        availability: unit.availability_status || 'Available',
      };
    })
  );

  return {
    project,
    heroImages,
    gallery,
    completionLabel,
    address,
    mapUrl,
    isStaticMap: Boolean(mapsApiKey),
    units,
  };
};
