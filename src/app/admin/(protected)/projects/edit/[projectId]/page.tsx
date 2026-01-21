import ProjectsManager from '../../ProjectsManager';

export const dynamic = 'force-dynamic';

export default function AdminProjectsEditPage({ params }: { params: { projectId: string } }) {
  return <ProjectsManager projectId={params.projectId} />;
}
