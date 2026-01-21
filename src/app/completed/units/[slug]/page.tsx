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

export default async function UnitPage({ params }: UnitPageProps) {
  const data = await getProjectUnitPageData('completed', params.slug);
  if (!data) {
    notFound();
  }

  return (
    <ProjectUnitLayout
      data={data}
      backHref="/completed"
      backLabel="Back to Completed"
      ctaPrimaryLabel="Get info about future listings"
      ctaSecondaryLabel="Investor inquiries"
    />
  );
}
