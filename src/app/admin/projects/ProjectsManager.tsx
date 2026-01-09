'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';

type ApiUnit = {
  id: string;
  name: string;
  unit_code: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  description: string | null;
  floorplan_url: string | null;
  availability_status: string | null;
  sort_order: number | null;
};

type ApiPhoto = {
  id: string;
  storage_path: string;
  role: string;
  alt_text: string | null;
  caption: string | null;
};

type ApiProject = {
  id: string;
  slug: string;
  name: string;
  status: 'coming_soon' | 'completed';
  is_public: boolean;
  address_line1: string;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  total_units: number | null;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  featured: boolean;
  sort_order: number | null;
  metadata: Record<string, unknown> | null;
  units?: ApiUnit[];
  project_photos?: ApiPhoto[];
};

type UnitFormState = {
  id?: string;
  name: string;
  unitCode: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  description: string;
  floorplanUrl: string;
  availabilityStatus: string;
  sortOrder: string;
};

type ProjectFormState = {
  slug: string;
  name: string;
  status: 'coming_soon' | 'completed';
  isPublic: boolean;
  featured: boolean;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  estimatedCompletion: string;
  actualCompletion: string;
  totalUnits: string;
  shortDescription: string;
  longDescription: string;
  heroImageUrl: string;
  sortOrder: string;
  units: UnitFormState[];
};

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Coming Soon', value: 'coming_soon' },
  { label: 'Completed', value: 'completed' },
] as const;

const emptyUnit: UnitFormState = {
  name: '',
  unitCode: '',
  bedrooms: '',
  bathrooms: '',
  squareFeet: '',
  description: '',
  floorplanUrl: '',
  availabilityStatus: '',
  sortOrder: '',
};

const initialFormState: ProjectFormState = {
  slug: '',
  name: '',
  status: 'coming_soon',
  isPublic: false,
  featured: false,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'USA',
  estimatedCompletion: '',
  actualCompletion: '',
  totalUnits: '',
  shortDescription: '',
  longDescription: '',
  heroImageUrl: '',
  sortOrder: '0',
  units: [],
};

const projectBucket = process.env.NEXT_PUBLIC_PROJECT_BUCKET || 'project-assets';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const buildPhotoUrl = (path: string) => {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${projectBucket}/${path}`;
};

const adminHeaders = (): Record<string, string> => {
  const token = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toNullIfEmpty = (value: string) => (value === '' ? null : value);
const toNumberOrNull = (value: string) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const projectToFormState = (project: ApiProject): ProjectFormState => ({
  slug: project.slug || '',
  name: project.name || '',
  status: project.status,
  isPublic: Boolean(project.is_public),
  featured: Boolean(project.featured),
  addressLine1: project.address_line1 || '',
  addressLine2: project.address_line2 || '',
  city: project.city || '',
  state: project.state || '',
  postalCode: project.postal_code || '',
  country: project.country || '',
  estimatedCompletion: project.estimated_completion || '',
  actualCompletion: project.actual_completion || '',
  totalUnits: project.total_units?.toString() || '',
  shortDescription: project.short_description || '',
  longDescription: project.long_description || '',
  heroImageUrl: project.hero_image_url || '',
  sortOrder: project.sort_order?.toString() || '0',
  units: (project.units || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((unit) => ({
    id: unit.id,
    name: unit.name || '',
    unitCode: unit.unit_code || '',
    bedrooms: unit.bedrooms?.toString() || '',
    bathrooms: unit.bathrooms?.toString() || '',
    squareFeet: unit.square_feet?.toString() || '',
    description: unit.description || '',
    floorplanUrl: unit.floorplan_url || '',
    availabilityStatus: unit.availability_status || '',
    sortOrder: unit.sort_order?.toString() || '',
  })),
});

const formToApiPayload = (form: ProjectFormState) => ({
  slug: form.slug.trim(),
  name: form.name.trim(),
  status: form.status,
  isPublic: form.isPublic,
  featured: form.featured,
  addressLine1: form.addressLine1,
  addressLine2: toNullIfEmpty(form.addressLine2),
  city: toNullIfEmpty(form.city),
  state: toNullIfEmpty(form.state),
  postalCode: toNullIfEmpty(form.postalCode),
  country: toNullIfEmpty(form.country) || 'USA',
  estimatedCompletion: toNullIfEmpty(form.estimatedCompletion),
  actualCompletion: toNullIfEmpty(form.actualCompletion),
  totalUnits: toNumberOrNull(form.totalUnits),
  shortDescription: toNullIfEmpty(form.shortDescription),
  longDescription: toNullIfEmpty(form.longDescription),
  heroImageUrl: toNullIfEmpty(form.heroImageUrl),
  sortOrder: toNumberOrNull(form.sortOrder) ?? 0,
  units: form.units.map((unit, index) => ({
    id: unit.id,
    name: unit.name.trim(),
    unitCode: toNullIfEmpty(unit.unitCode),
    bedrooms: toNumberOrNull(unit.bedrooms),
    bathrooms: toNumberOrNull(unit.bathrooms),
    squareFeet: toNumberOrNull(unit.squareFeet),
    description: toNullIfEmpty(unit.description),
    floorplanUrl: toNullIfEmpty(unit.floorplanUrl),
    availabilityStatus: toNullIfEmpty(unit.availabilityStatus),
    sortOrder: toNumberOrNull(unit.sortOrder) ?? index,
  })),
});

const ProjectListRow = ({
  project,
  onEdit,
  onDelete,
}: {
  project: ApiProject;
  onEdit: (project: ApiProject) => void;
  onDelete: (project: ApiProject) => void;
}) => (
  <tr className="border-b border-slate-200 text-sm">
    <td className="py-3 font-medium text-slate-900">{project.name}</td>
    <td className="py-3 capitalize text-slate-500">{project.status.replace('_', ' ')}</td>
    <td className="py-3 text-center text-slate-500">{project.is_public ? 'Yes' : 'No'}</td>
    <td className="py-3 text-center text-slate-500">{project.units?.length ?? 0}</td>
    <td className="py-3 text-center text-slate-500">{project.project_photos?.length ?? 0}</td>
    <td className="py-3 text-right">
      <div className="flex justify-end gap-2">
        <button className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100" onClick={() => onDelete(project)}>
          Delete
        </button>
      </div>
    </td>
  </tr>
);

const PhotoUploader = ({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(event.target.files)) {
        const response = await fetch(`/api/projects/${projectId}/photos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...adminHeaders(),
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            role: 'gallery',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to reserve upload slot');
        }

        const payload = await response.json();
        const upload = payload?.data?.upload;

        if (!upload) {
          throw new Error('Upload response malformed');
        }

        const uploadResult = await supabase.storage.from(upload.bucket).uploadToSignedUrl(upload.objectPath, upload.token, file);

        if (uploadResult.error) {
          throw uploadResult.error;
        }
      }

      event.target.value = '';
      onUploaded();
    } catch (error) {
      console.error('Photo upload failed', error);
      alert('Photo upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      {uploading ? 'Uploading…' : 'Upload photos'}
    </label>
  );
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_TABS)[number]['value']>('all');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const selectedProject = useMemo(() => projects.find((project) => project.id === editingId) || null, [projects, editingId]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const query = new URLSearchParams({ include: 'units,photos' });
      if (statusFilter !== 'all') {
        query.set('status', statusFilter);
      }

      const response = await fetch(`/api/projects?${query.toString()}`, {
        headers: {
          ...adminHeaders(),
        },
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
  }, [statusFilter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, refreshToken]);

  useEffect(() => {
    if (editingId && selectedProject) {
      setForm(projectToFormState(selectedProject));
    }
  }, [editingId, selectedProject]);

  const startCreate = () => {
    setEditingId(null);
    setForm(initialFormState);
  };

  const startEdit = (project: ApiProject) => {
    setEditingId(project.id);
    setForm(projectToFormState(project));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteProject = async (project: ApiProject) => {
    if (!confirm(`Delete project “${project.name}”? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: {
          ...adminHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      if (editingId === project.id) {
        startCreate();
      }

      setFeedback({ type: 'success', message: 'Project deleted' });
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to delete project', error);
      setFeedback({ type: 'error', message: 'Could not delete project' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = formToApiPayload(form);
      const endpoint = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Save failed');
      }

      setFeedback({ type: 'success', message: editingId ? 'Project updated' : 'Project created' });

      if (!editingId) {
        setForm(initialFormState);
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to save project', error);
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateUnitField = <K extends keyof UnitFormState>(index: number, field: K, value: UnitFormState[K]) => {
    setForm((prev) => {
      const nextUnits = [...prev.units];
      nextUnits[index] = { ...nextUnits[index], [field]: value };
      return {
        ...prev,
        units: nextUnits,
      };
    });
  };

  const addUnit = () => {
    setForm((prev) => ({
      ...prev,
      units: [...prev.units, { ...emptyUnit }],
    }));
  };

  const removeUnit = (index: number) => {
    setForm((prev) => ({
      ...prev,
      units: prev.units.filter((_, idx) => idx !== index),
    }));
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/projects/${editingId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          ...adminHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to delete photo', error);
      setFeedback({ type: 'error', message: 'Could not delete photo' });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projects</p>
            <h2 className="text-2xl font-semibold text-slate-900">Content dashboard</h2>
          </div>
          <div className="flex items-center gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === tab.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400" onClick={startCreate}>
              New Project
            </button>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Public</th>
                <th className="px-4 py-3 text-center">Units</th>
                <th className="px-4 py-3 text-center">Photos</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                    {loading ? 'Loading projects…' : 'No projects found'}
                  </td>
                </tr>
              )}
              {projects.map((project) => (
                <ProjectListRow key={project.id} project={project} onEdit={startEdit} onDelete={handleDeleteProject} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{editingId ? 'Edit Project' : 'Create Project'}</p>
            <h3 className="text-xl font-semibold text-slate-900">{editingId ? form.name || 'Draft' : 'New project'}</h3>
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

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Project Name
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Slug
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-slate-600">
              Status
              <select className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.status} onChange={(e) => updateField('status', e.target.value as ProjectFormState['status'])}>
                <option value="coming_soon">Coming Soon</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-600">
              Sort Order
              <input type="number" className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.sortOrder} onChange={(e) => updateField('sortOrder', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Total Units
              <input type="number" className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.totalUnits} onChange={(e) => updateField('totalUnits', e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Address Line 1
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} required />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Address Line 2
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="text-sm font-medium text-slate-600">
              City
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-600">
              State
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Postal Code
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Country
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Estimated Completion
              <input type="date" className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.estimatedCompletion} onChange={(e) => updateField('estimatedCompletion', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Actual Completion
              <input type="date" className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.actualCompletion} onChange={(e) => updateField('actualCompletion', e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Hero Image URL
              <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" value={form.heroImageUrl} onChange={(e) => updateField('heroImageUrl', e.target.value)} />
            </label>
            <div className="flex items-center gap-6 pt-6">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <input type="checkbox" checked={form.isPublic} onChange={(e) => updateField('isPublic', e.target.checked)} />
                Public
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} />
                Featured
              </label>
            </div>
          </div>

          <label className="text-sm font-medium text-slate-600">
            Short Description
            <textarea className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" rows={2} value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} />
          </label>

          <label className="text-sm font-medium text-slate-600">
            Long Description
            <textarea className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" rows={5} value={form.longDescription} onChange={(e) => updateField('longDescription', e.target.value)} />
          </label>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Units</p>
                <h4 className="text-lg font-semibold text-slate-900">Residences</h4>
              </div>
              <button type="button" className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-400" onClick={addUnit}>
                Add Unit
              </button>
            </div>

            {form.units.length === 0 && <p className="text-sm text-slate-500">No units yet. Use “Add Unit” to start describing each residence.</p>}

            <div className="space-y-4">
              {form.units.map((unit, index) => (
                <div key={unit.id || index} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{unit.name || `Unit ${index + 1}`}</p>
                    <button type="button" className="text-xs font-medium text-rose-500 hover:text-rose-600" onClick={() => removeUnit(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="text-xs font-medium text-slate-500">
                      Name / Label
                      <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.name} onChange={(e) => updateUnitField(index, 'name', e.target.value)} required />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Unit Code
                      <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.unitCode} onChange={(e) => updateUnitField(index, 'unitCode', e.target.value)} />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Sort Order
                      <input type="number" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.sortOrder} onChange={(e) => updateUnitField(index, 'sortOrder', e.target.value)} />
                    </label>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="text-xs font-medium text-slate-500">
                      Bedrooms
                      <input type="number" step="0.5" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.bedrooms} onChange={(e) => updateUnitField(index, 'bedrooms', e.target.value)} />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Bathrooms
                      <input type="number" step="0.5" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.bathrooms} onChange={(e) => updateUnitField(index, 'bathrooms', e.target.value)} />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Square Feet
                      <input type="number" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.squareFeet} onChange={(e) => updateUnitField(index, 'squareFeet', e.target.value)} />
                    </label>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <label className="text-xs font-medium text-slate-500">
                      Availability
                      <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.availabilityStatus} onChange={(e) => updateUnitField(index, 'availabilityStatus', e.target.value)} />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Floorplan URL
                      <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.floorplanUrl} onChange={(e) => updateUnitField(index, 'floorplanUrl', e.target.value)} />
                    </label>
                  </div>
                  <label className="mt-3 text-xs font-medium text-slate-500">
                    Description
                    <textarea className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" rows={2} value={unit.description} onChange={(e) => updateUnitField(index, 'description', e.target.value)} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" className="text-sm font-medium text-slate-500 hover:text-slate-700" onClick={startCreate}>
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      {editingId && selectedProject && (
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Media</p>
              <h3 className="text-xl font-semibold text-slate-900">Project photos</h3>
            </div>
            <PhotoUploader projectId={editingId} onUploaded={() => setRefreshToken((token) => token + 1)} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {(selectedProject.project_photos || []).map((photo) => {
              const photoUrl = buildPhotoUrl(photo.storage_path);
              return (
                <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-slate-200">
                  {photoUrl ? (
                    <Image src={photoUrl} alt={photo.alt_text || 'Project photo'} width={320} height={200} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-500">No preview</div>
                  )}
                  <button
                    className="absolute right-2 top-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-600 opacity-0 shadow group-hover:opacity-100"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            {selectedProject.project_photos?.length === 0 && <p className="col-span-full text-sm text-slate-500">No photos uploaded yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}

