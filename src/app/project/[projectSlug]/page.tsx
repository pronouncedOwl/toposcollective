import { notFound } from 'next/navigation';
import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout';
import { getProjectPageData } from '@/lib/projects-view';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

type ProjectPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const data = await getProjectPageData(projectSlug);
  if (!data) {
    notFound();
  }

  // Determine unitLinkBase based on project status
  const unitLinkBase = data.project.status === 'completed' ? '/completed/units' : '/coming-soon/units';

  return <ProjectDetailLayout data={data} unitLinkBase={unitLinkBase} />;
}
