import Link from 'next/link';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/admin-auth';
import LogoutButton from '../../../components/admin/LogoutButton';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Topos Collective</p>
            <h1 className="text-xl font-semibold text-slate-900">Projects CMS</h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/admin/projects" className="hover:text-slate-900">
              Projects
            </Link>
            <Link href="/admin/gallery" className="hover:text-slate-900">
              Gallery
            </Link>
            {adminUser.role === 'admin' && (
              <Link href="/admin/roles" className="hover:text-slate-900">
                Roles
              </Link>
            )}
            <Link href="/" className="hover:text-slate-900">
              View Site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
