import { notFound } from 'next/navigation';
import ProjectUnitLayout from '@/components/projects/ProjectUnitLayout';
import { getProjectUnitPageData } from '@/lib/projects-view';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

type UnitPageProps = {
  params: {
    slug: string;
  };
};

export default async function ComingSoonUnitPage({ params }: UnitPageProps) {
  const data = await getProjectUnitPageData('coming_soon', params.slug);
  if (!data) {
    notFound();
  }

  return (
    <ProjectUnitLayout
      data={data}
      backHref="/coming-soon"
      backLabel="Back to Coming Soon"
      ctaPrimaryLabel="Schedule a Tour"
      ctaSecondaryLabel="Request Details"
    />
  );
}
