'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type ApiProject = {
  id: string;
  name: string;
  status: 'coming_soon' | 'completed';
  is_public: boolean;
  units?: { id: string }[];
};

const ProjectListRow = ({ project, onDelete }: { project: ApiProject; onDelete: (project: ApiProject) => void }) => (
  <tr className="border-b border-slate-200 text-sm">
    <td className="py-3 font-medium text-slate-900">{project.name}</td>
    <td className="py-3 text-center text-slate-500">{project.is_public ? 'Yes' : 'No'}</td>
    <td className="py-3 text-center text-slate-500">{project.units?.length ?? 0}</td>
    <td className="py-3 text-right">
      <div className="flex justify-end gap-2">
        <Link
          className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          href={`/admin/projects/edit/${project.id}`}
        >
          Edit
        </Link>
        <button
          className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
          onClick={() => onDelete(project)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function ProjectsList() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const query = new URLSearchParams({ include: 'units' });
      const response = await fetch(`/api/projects?${query.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const payload = await response.json();
      setProjects(payload?.data?.projects || []);
    } catch (error) {
      console.error('Failed to load projects', error);
      setFeedback({ type: 'error', message: 'Could not load projects' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDeleteProject = async (project: ApiProject) => {
    if (!confirm(`Delete project “${project.name}”? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setFeedback({ type: 'success', message: 'Project deleted' });
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
      setFeedback({ type: 'error', message: 'Could not delete project' });
    }
  };

  const grouped = useMemo(() => {
    return {
      coming_soon: projects.filter((project) => project.status === 'coming_soon'),
      completed: projects.filter((project) => project.status === 'completed'),
    };
  }, [projects]);

  const renderSection = (title: string, items: ApiProject[]) => (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projects</p>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>
        {feedback && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
            }`}
          >
            {feedback.message}
          </span>
        )}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-center">Public</th>
              <th className="px-4 py-3 text-center">Units</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                  {loading ? 'Loading projects…' : 'No projects found'}
                </td>
              </tr>
            )}
            {items.map((project) => (
              <ProjectListRow key={project.id} project={project} onDelete={handleDeleteProject} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-900">Projects dashboard</h1>
          </div>
          <Link
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            href="/admin/projects/create"
          >
            Create Project
          </Link>
        </div>
      </section>

      {renderSection('Coming Soon', grouped.coming_soon)}
      {renderSection('Completed', grouped.completed)}
    </div>
  );
}
