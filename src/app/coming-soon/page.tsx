import { unstable_noStore as noStore } from 'next/cache';
import ProjectsShowcaseClient from '@/components/projects/ProjectsShowcaseClient';
import { getShowcaseProjects } from '@/lib/projects-view';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ComingSoonPage() {
  noStore();
  const projects = await getShowcaseProjects('coming_soon');

  return (
    <ProjectsShowcaseClient
      title="Projects Coming Soon"
      projects={projects}
      emptyState="New residences are being designed. Check back soon for fresh announcements."
      ctaHeading="Interested in Our Upcoming Projects?"
      ctaBody="Building places you want to be."
      ctaHref="/contact"
      ctaLabel="Contact Us"
      unitLinkBase="/coming-soon/units"
    />
  );
}
