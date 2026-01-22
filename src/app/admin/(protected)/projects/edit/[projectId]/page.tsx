import ProjectsManager from '../../ProjectsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsEditPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectsManager projectId={projectId} />;
}
