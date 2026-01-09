import CompletedProjectsClient, { CompletedProject } from './CompletedProjectsClient';
import { getPublicProjectsByStatus } from '@/lib/projects-public';
import { getPublicUrl } from '@/lib/storage';

const formatCompletionLabel = (project: Awaited<ReturnType<typeof getPublicProjectsByStatus>>[number]) => {
  const date = project.actual_completion || project.estimated_completion;
  if (!date) return 'Completion date forthcoming';
  const formatted = new Date(date).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return project.status === 'completed' ? `Completed ${formatted}` : `Estimated completion ${formatted}`;
};

const resolveImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return getPublicUrl(path);
};

const buildDetails = (project: Awaited<ReturnType<typeof getPublicProjectsByStatus>>[number]) => {
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

const mapProject = (project: Awaited<ReturnType<typeof getPublicProjectsByStatus>>[number]): CompletedProject => {
  const heroPhoto = project.project_photos?.find((photo) => photo.role === 'hero')?.storage_path;
  const combined = [
    ...(project.project_photos || []).map((photo) => ({ ...photo, order: photo.sort_order ?? 0 })),
    ...(project.units || []).flatMap((unit) => (unit.unit_photos || []).map((photo) => ({ ...photo, order: photo.sort_order ?? 0 }))),
  ];

  const galleryPhotos = combined
    .sort((a, b) => a.order - b.order)
    .map((photo) => ({
      id: photo.id,
      url: resolveImageUrl(photo.storage_path),
      alt: photo.alt_text || `${project.name} photo`,
    }))
    .filter((photo) => photo.url) as CompletedProject['gallery'];

  return {
    id: project.id,
    name: project.name,
    details: buildDetails(project),
    completionLabel: formatCompletionLabel(project),
    heroImage: resolveImageUrl(project.hero_image_url) || resolveImageUrl(heroPhoto || ''),
    gallery: galleryPhotos,
  };
};

export default async function CompletedPage() {
  const projects = await getPublicProjectsByStatus('completed');
  const transformed = projects.map(mapProject);
  return <CompletedProjectsClient projects={transformed} />;
}
