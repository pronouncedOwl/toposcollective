import { unstable_noStore as noStore } from 'next/cache';
import ProjectsShowcaseClient from '@/components/projects/ProjectsShowcaseClient';
import { getShowcaseProjects } from '@/lib/projects-view';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function CompletedPage() {
  noStore();
  const projects = await getShowcaseProjects('completed');
  return (
    <ProjectsShowcaseClient
      title="Completed Projects"
      projects={projects}
      emptyState="We&apos;re completing new residences soon. Once keys are delivered, you&apos;ll see them here."
      ctaHeading="Interested in Our Work?"
      ctaBody="Building places you want to be."
      ctaHref="/contact"
      ctaLabel="Contact Us"
    />
  );
}
