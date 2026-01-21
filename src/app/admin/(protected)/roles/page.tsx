import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../../lib/admin-auth';
import RolesManager from './RolesManager';

export default async function RolesPage() {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect('/admin/login');
  }

  if (adminUser.role !== 'admin') {
    redirect('/admin/projects');
  }

  return <RolesManager adminEmail={adminUser.email} />;
}
