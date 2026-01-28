import { notFound } from 'next/navigation';
import ProjectUnitLayout from '@/components/projects/ProjectUnitLayout';
import { getUnitPageDataBySlug } from '@/lib/projects-view';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

type UnitPageProps = {
  params: Promise<{
    projectSlug: string;
    unitSlug: string;
  }>;
};

export default async function UnitPage({ params }: UnitPageProps) {
  const { projectSlug, unitSlug } = await params;
  const data = await getUnitPageDataBySlug(projectSlug, unitSlug);
  
  if (!data) {
    notFound();
  }

  // Determine back link based on project status
  const status = data.project.status;
  const backHref = status === 'completed' ? '/completed' : '/coming-soon';
  const backLabel = status === 'completed' ? 'Back to Completed' : 'Back to Coming Soon';

  return (
    <ProjectUnitLayout
      data={data}
      backHref={backHref}
      backLabel={backLabel}
      ctaPrimaryLabel="Get info about future listings"
      ctaSecondaryLabel="Investor inquiries"
    />
  );
}
