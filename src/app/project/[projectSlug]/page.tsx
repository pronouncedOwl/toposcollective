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

  return <ProjectDetailLayout data={data} />;
}
