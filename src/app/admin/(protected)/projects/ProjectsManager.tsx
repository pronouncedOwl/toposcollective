'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../../../lib/supabase-browser';

type ApiUnit = {
  id: string;
  name: string;
  unit_code: string | null;
  price: number | null;
  sold_price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  time_on_market_days: number | null;
  description: string | null;
  short_description: string | null;
  long_description: string | null;
  floorplan_url: string | null;
  availability_status: string | null;
  sort_order: number | null;
  unit_photos?: ApiUnitPhoto[];
};

type ApiUnitPhoto = {
  id: string;
  storage_path: string;
  role: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number | null;
  metadata?: Record<string, unknown> | null;
};

type UnitPhotoOrderMap = Record<string, string[]>;

type ApiProjectPhoto = {
  id: string;
  storage_path: string;
  role: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number | null;
  metadata?: Record<string, unknown> | null;
};

type ProjectPhotoOrder = string[];

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
  featured: boolean;
  sort_order: number | null;
  metadata: Record<string, unknown> | null;
  project_photos?: ApiProjectPhoto[];
  units?: ApiUnit[];
};

type UnitFormState = {
  id?: string;
  name: string;
  unitCode: string;
  price: string;
  soldPrice: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  timeOnMarketDays: string;
  description: string;
  shortDescription: string;
  longDescription: string;
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
  sortOrder: string;
  units: UnitFormState[];
};

const emptyUnit: UnitFormState = {
  name: '',
  unitCode: '',
  price: '',
  soldPrice: '',
  bedrooms: '',
  bathrooms: '',
  squareFeet: '',
  timeOnMarketDays: '',
  description: '',
  shortDescription: '',
  longDescription: '',
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
  sortOrder: '0',
  units: [],
};

const toNullIfEmpty = (value: string) => (value === '' ? null : value);
const toNumberOrNull = (value: string) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const sortUnitPhotos = (photos: ApiUnitPhoto[]) =>
  [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const sortProjectPhotos = (photos: ApiProjectPhoto[]) =>
  [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const orderUnitPhotos = (photos: ApiUnitPhoto[], order?: string[]) => {
  const sorted = sortUnitPhotos(photos);
  if (!order?.length) return sorted;
  const byId = new Map(sorted.map((photo) => [photo.id, photo]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as ApiUnitPhoto[];
  const orderedSet = new Set(order);
  const remaining = sorted.filter((photo) => !orderedSet.has(photo.id));
  return [...ordered, ...remaining];
};

const orderProjectPhotos = (photos: ApiProjectPhoto[], order?: string[]) => {
  const sorted = sortProjectPhotos(photos);
  if (!order?.length) return sorted;
  const byId = new Map(sorted.map((photo) => [photo.id, photo]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as ApiProjectPhoto[];
  const orderedSet = new Set(order);
  const remaining = sorted.filter((photo) => !orderedSet.has(photo.id));
  return [...ordered, ...remaining];
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
  sortOrder: project.sort_order?.toString() || '0',
  units: (project.units || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((unit) => ({
    id: unit.id,
    name: unit.name || '',
    unitCode: unit.unit_code || '',
    price: unit.price?.toString() || '',
    soldPrice: unit.sold_price?.toString() || '',
    bedrooms: unit.bedrooms?.toString() || '',
    bathrooms: unit.bathrooms?.toString() || '',
    squareFeet: unit.square_feet?.toString() || '',
    timeOnMarketDays: unit.time_on_market_days?.toString() || '',
    description: unit.description || '',
    shortDescription: unit.short_description || '',
    longDescription: unit.long_description || '',
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
  sortOrder: toNumberOrNull(form.sortOrder) ?? 0,
  units: form.units.map((unit, index) => ({
    id: unit.id,
    name: unit.name.trim(),
    unitCode: toNullIfEmpty(unit.unitCode),
    price: toNumberOrNull(unit.price),
    soldPrice: toNumberOrNull(unit.soldPrice),
    bedrooms: toNumberOrNull(unit.bedrooms),
    bathrooms: toNumberOrNull(unit.bathrooms),
    squareFeet: toNumberOrNull(unit.squareFeet),
    timeOnMarketDays: toNumberOrNull(unit.timeOnMarketDays),
    description: toNullIfEmpty(unit.description),
    shortDescription: toNullIfEmpty(unit.shortDescription),
    longDescription: toNullIfEmpty(unit.longDescription),
    floorplanUrl: toNullIfEmpty(unit.floorplanUrl),
    availabilityStatus: toNullIfEmpty(unit.availabilityStatus),
    sortOrder: toNumberOrNull(unit.sortOrder) ?? index,
  })),
});

const UnitPhotoUploader = ({
  unitId,
  onUploaded,
  onError,
}: {
  unitId: string;
  onUploaded: () => void;
  onError?: (message: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(event.target.files)) {
        const response = await fetch(`/api/projects/units/${unitId}/photos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
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

        const uploadResult = await supabaseBrowser.storage
          .from(upload.bucket)
          .uploadToSignedUrl(upload.objectPath, upload.token, file);

        if (uploadResult.error) {
          throw uploadResult.error;
        }
      }

      event.target.value = '';
      onUploaded();
    } catch (error) {
      console.error('Unit photo upload failed', error);
      onError?.('Unit photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      {uploading ? 'Uploading…' : 'Upload photos'}
    </label>
  );
};

const ProjectPhotoUploader = ({
  projectId,
  onUploaded,
  onError,
}: {
  projectId: string;
  onUploaded: () => void;
  onError?: (message: string) => void;
}) => {
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
          },
          credentials: 'include',
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

        const uploadResult = await supabaseBrowser.storage
          .from(upload.bucket)
          .uploadToSignedUrl(upload.objectPath, upload.token, file);

        if (uploadResult.error) {
          throw uploadResult.error;
        }
      }

      event.target.value = '';
      onUploaded();
    } catch (error) {
      console.error('Project photo upload failed', error);
      onError?.('Project photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      {uploading ? 'Uploading…' : 'Upload photos'}
    </label>
  );
};

const SortableProjectPhotoCard = ({
  photo,
  photoUrl,
  isHero,
  onToggleHero,
  onDelete,
}: {
  photo: ApiProjectPhoto;
  photoUrl: string;
  isHero: boolean;
  onToggleHero: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  const ringClass = isHero ? 'ring-2 ring-emerald-500' : '';
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${ringClass} ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={photo.alt_text || 'Project photo'} width={240} height={160} className="h-32 w-full object-contain" />
      ) : (
        <div className="flex h-32 items-center justify-center bg-slate-100 text-[10px] text-slate-500">Loading preview…</div>
      )}
      <button
        type="button"
        className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 opacity-0 shadow transition group-hover:opacity-100 touch-none"
        {...attributes}
        {...listeners}
      >
        Drag
      </button>
      {isHero && (
        <span className="absolute left-2 top-2 rounded-full bg-slate-900/90 px-2 py-1 text-[10px] font-semibold text-white">
          Project hero
        </span>
      )}
      <button
        type="button"
        className="absolute left-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 opacity-0 shadow transition group-hover:opacity-100"
        onClick={onToggleHero}
      >
        {isHero ? 'Unset hero' : 'Set hero'}
      </button>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-rose-600 opacity-0 shadow group-hover:opacity-100"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

const SortableUnitPhotoCard = ({
  photo,
  photoUrl,
  isMain,
  onSetMain,
  onDelete,
}: {
  photo: ApiUnitPhoto;
  photoUrl: string;
  isMain: boolean;
  onSetMain: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  const ringClass = isMain ? 'ring-2 ring-emerald-500' : '';
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${ringClass} ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={photo.alt_text || 'Unit photo'} width={240} height={160} className="h-32 w-full object-contain" />
      ) : (
        <div className="flex h-32 items-center justify-center bg-slate-100 text-[10px] text-slate-500">Loading preview…</div>
      )}
      <button
        type="button"
        className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 opacity-0 shadow transition group-hover:opacity-100 touch-none"
        {...attributes}
        {...listeners}
      >
        Drag
      </button>
      {isMain ? (
        <span className="absolute left-2 top-2 rounded-full bg-slate-900/90 px-2 py-1 text-[10px] font-semibold text-white">
          Unit main
        </span>
      ) : (
        <button
          type="button"
          className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 opacity-0 shadow group-hover:opacity-100"
          onClick={onSetMain}
        >
          Set unit main
        </button>
      )}
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-rose-600 opacity-0 shadow group-hover:opacity-100"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default function ProjectsManager({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(projectId ?? null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [photoOrder, setPhotoOrder] = useState<UnitPhotoOrderMap>({});
  const [projectPhotoOrder, setProjectPhotoOrder] = useState<ProjectPhotoOrder>([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const handleUploadError = (message: string) => {
    setFeedback({ type: 'error', message });
  };

  const selectedProject = useMemo(() => project, [project]);

  const loadProject = useCallback(async (id: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const query = new URLSearchParams({ include: 'units,photos' });
      const response = await fetch(`/api/projects/${id}?${query.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load project');
      }

      const payload = await response.json();
      const projectData = payload?.data?.project || null;
      setProject(projectData);
      if (projectData) {
        setForm(projectToFormState(projectData));
      }
    } catch (error) {
      console.error('Failed to load project', error);
      setFeedback({ type: 'error', message: 'Could not load project' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setEditingId(projectId ?? null);
    if (!projectId) {
      setProject(null);
      setForm(initialFormState);
    }
  }, [projectId]);

  useEffect(() => {
    if (!editingId) return;
    loadProject(editingId);
  }, [editingId, refreshToken, loadProject]);

  useEffect(() => {
    if (editingId && selectedProject) {
      setForm(projectToFormState(selectedProject));
    }
  }, [editingId, selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const paths = new Set<string>();
    (selectedProject.project_photos || []).forEach((photo) => photo.storage_path && paths.add(photo.storage_path));
    (selectedProject.units || []).forEach((unit) =>
      (unit.unit_photos || []).forEach((photo) => photo.storage_path && paths.add(photo.storage_path)),
    );

    const missing = Array.from(paths).filter((path) => !signedUrls[path]);
    if (missing.length === 0) return;

    let cancelled = false;
    const loadSignedUrls = async () => {
      try {
        const response = await fetch('/api/photos/signed/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ paths: missing }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch signed URLs');
        }

        const payload = await response.json();
        const urls = payload?.data?.urls;

        if (cancelled || !urls || typeof urls !== 'object') return;
        setSignedUrls((prev) => ({ ...prev, ...urls }));
      } catch (error) {
        console.warn('Failed to fetch signed URLs', error);
      }
    };

    void loadSignedUrls();
    return () => {
      cancelled = true;
    };
  }, [selectedProject, refreshToken, signedUrls]);

  useEffect(() => {
    if (!selectedProject) return;
    setPhotoOrder((prev) => {
      const next = { ...prev };
      (selectedProject.units || []).forEach((unit) => {
        if (!unit.id) return;
        const sortedIds = sortUnitPhotos(unit.unit_photos || []).map((photo) => photo.id);
        const existing = next[unit.id];
        if (!existing) {
          next[unit.id] = sortedIds;
          return;
        }
        const existingSet = new Set(existing);
        const merged = [...existing];
        sortedIds.forEach((id) => {
          if (!existingSet.has(id)) merged.push(id);
        });
        next[unit.id] = merged;
      });
      return next;
    });
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const sortedIds = sortProjectPhotos(selectedProject.project_photos || []).map((photo) => photo.id);
    setProjectPhotoOrder((prev) => {
      if (prev.length === 0) return sortedIds;
      const existingSet = new Set(prev);
      const filtered = prev.filter((id) => sortedIds.includes(id));
      const merged = [...filtered];
      sortedIds.forEach((id) => {
        if (!existingSet.has(id)) merged.push(id);
      });
      return merged;
    });
  }, [selectedProject]);


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
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Save failed');
      }

      setFeedback({ type: 'success', message: editingId ? 'Project updated' : 'Project created' });

      if (!editingId) {
        const createdId = result?.data?.project?.id;
        if (createdId) {
          router.push(`/admin/projects/edit/${createdId}`);
          return;
        }
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

  const handleDeleteProjectPhoto = async (photoId: string) => {
    if (!editingId) return;
    if (!confirm('Delete this project photo? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/projects/${editingId}/photos/${photoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project photo');
      }

      setProjectPhotoOrder((prev) => prev.filter((id) => id !== photoId));
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to delete project photo', error);
      setFeedback({ type: 'error', message: 'Could not delete project photo' });
    }
  };

  const handleToggleProjectHeroPhoto = async (photoId: string, makeHero: boolean) => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/projects/${editingId}/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: makeHero ? 'hero' : 'gallery' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project hero photo');
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to toggle project hero photo', error);
      setFeedback({ type: 'error', message: 'Could not update project hero photo' });
    }
  };

  const handleReorderProjectPhotos = async (order: string[]) => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/projects/${editingId}/photos/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder project photos');
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to reorder project photos', error);
      setFeedback({ type: 'error', message: 'Could not reorder project photos' });
      setRefreshToken((token) => token + 1);
    }
  };

  const handleDeleteUnitPhoto = async (unitId: string, photoId: string) => {
    if (!confirm('Delete this unit photo? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/projects/units/${unitId}/photos/${photoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete unit photo');
      }

      setPhotoOrder((prev) => {
        const existing = prev[unitId];
        if (!existing) return prev;
        return {
          ...prev,
          [unitId]: existing.filter((id) => id !== photoId),
        };
      });
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to delete unit photo', error);
      setFeedback({ type: 'error', message: 'Could not delete unit photo' });
    }
  };

  const handleSetUnitMainPhoto = async (unitId: string, photoId: string) => {
    try {
      const response = await fetch(`/api/projects/units/${unitId}/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: 'main' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update unit main photo');
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to set unit main photo', error);
      setFeedback({ type: 'error', message: 'Could not update unit main photo' });
    }
  };

  const handleReorderUnitPhotos = async (unitId: string, order: string[]) => {
    try {
      const response = await fetch(`/api/projects/units/${unitId}/photos/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder unit photos');
      }

      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to reorder unit photos', error);
      setFeedback({ type: 'error', message: 'Could not reorder unit photos' });
      setRefreshToken((token) => token + 1);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="-mx-6 -mt-6 mb-6 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur sticky top-4 z-20">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{editingId ? 'Edit Project' : 'Create Project'}</p>
            <h3 className="text-xl font-semibold text-slate-900">{editingId ? form.name || 'Draft' : 'New project'}</h3>
            {editingId && loading && !selectedProject && <p className="mt-2 text-xs text-slate-500">Loading project…</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="project-form"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Project'}
            </button>
            <Link className="text-sm font-medium text-slate-500 hover:text-slate-700" href="/admin/projects">
              Back to projects
            </Link>
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
        </div>

        <form id="project-form" className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={form.isPublic} onChange={(e) => updateField('isPublic', e.target.checked)} />
              Public
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} />
              Featured
            </label>
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
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project photos</p>
                <p className="text-xs text-slate-500">Set hero images for the project filmstrip.</p>
              </div>
              {editingId ? (
                <ProjectPhotoUploader
                  projectId={editingId}
                  onUploaded={() => setRefreshToken((token) => token + 1)}
                  onError={handleUploadError}
                />
              ) : (
                <span className="text-xs text-slate-400">Save to upload</span>
              )}
            </div>

            {(() => {
              const projectPhotos = orderProjectPhotos(
                selectedProject?.project_photos || [],
                projectPhotoOrder.length ? projectPhotoOrder : undefined,
              );
              const orderedPhotoIds = projectPhotos.map((photo) => photo.id);
              const handlePhotoDragEnd = (event: DragEndEvent) => {
                if (!editingId) return;
                const { active, over } = event;
                if (!over || active.id === over.id) return;
                const activeId = String(active.id);
                const overId = String(over.id);
                const oldIndex = orderedPhotoIds.indexOf(activeId);
                const newIndex = orderedPhotoIds.indexOf(overId);
                if (oldIndex < 0 || newIndex < 0) return;
                const nextOrder = arrayMove(orderedPhotoIds, oldIndex, newIndex);
                setProjectPhotoOrder(nextOrder);
                void handleReorderProjectPhotos(nextOrder);
              };

              return (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhotoDragEnd}>
                  <SortableContext items={orderedPhotoIds} strategy={rectSortingStrategy}>
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {projectPhotos.map((photo) => {
                        const photoUrl = signedUrls[photo.storage_path] || '';
                        const isHero = photo.role === 'hero';
                        return (
                          <SortableProjectPhotoCard
                            key={photo.id}
                            photo={photo}
                            photoUrl={photoUrl}
                            isHero={isHero}
                            onToggleHero={() => handleToggleProjectHeroPhoto(photo.id, !isHero)}
                            onDelete={() => handleDeleteProjectPhoto(photo.id)}
                          />
                        );
                      })}
                      {editingId && projectPhotos.length === 0 && (
                        <p className="col-span-full text-xs text-slate-500">No project photos uploaded yet.</p>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              );
            })()}
          </div>

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
              {form.units.map((unit, index) => {
                const unitPhotos = orderUnitPhotos(
                  [
                  ...(selectedProject?.units?.find((entry) => entry.id === unit.id)?.unit_photos || []),
                  ],
                  unit.id ? photoOrder[unit.id] : undefined,
                );
                const orderedPhotoIds = unitPhotos.map((photo) => photo.id);
                const handlePhotoDragEnd = (event: DragEndEvent) => {
                  if (!unit.id) return;
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;
                  const activeId = String(active.id);
                  const overId = String(over.id);
                  const oldIndex = orderedPhotoIds.indexOf(activeId);
                  const newIndex = orderedPhotoIds.indexOf(overId);
                  if (oldIndex < 0 || newIndex < 0) return;
                  const nextOrder = arrayMove(orderedPhotoIds, oldIndex, newIndex);
                  setPhotoOrder((prev) => ({ ...prev, [unit.id as string]: nextOrder }));
                  void handleReorderUnitPhotos(unit.id as string, nextOrder);
                };
                return (
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
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <label className="text-xs font-medium text-slate-500">
                        Asking Price
                        <input type="number" step="0.01" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.price} onChange={(e) => updateUnitField(index, 'price', e.target.value)} />
                      </label>
                      <label className="text-xs font-medium text-slate-500">
                        Selling Price
                        <input type="number" step="0.01" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.soldPrice} onChange={(e) => updateUnitField(index, 'soldPrice', e.target.value)} />
                      </label>
                      <label className="text-xs font-medium text-slate-500">
                        Time on Market (Days)
                        <input type="number" className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" value={unit.timeOnMarketDays} onChange={(e) => updateUnitField(index, 'timeOnMarketDays', e.target.value)} />
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
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="text-xs font-medium text-slate-500">
                        Short Description
                        <textarea className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" rows={2} value={unit.shortDescription} onChange={(e) => updateUnitField(index, 'shortDescription', e.target.value)} />
                      </label>
                      <label className="text-xs font-medium text-slate-500">
                        Long Description
                        <textarea className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" rows={3} value={unit.longDescription} onChange={(e) => updateUnitField(index, 'longDescription', e.target.value)} />
                      </label>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Unit photos</p>
                          <p className="text-xs text-slate-500">Set the main image per unit.</p>
                        </div>
                        {unit.id ? (
                          <UnitPhotoUploader
                            unitId={unit.id}
                            onUploaded={() => setRefreshToken((token) => token + 1)}
                            onError={handleUploadError}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">Save to upload</span>
                        )}
                      </div>

                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhotoDragEnd}>
                        <SortableContext items={orderedPhotoIds} strategy={rectSortingStrategy}>
                          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {unitPhotos.map((photo) => {
                              const photoUrl = signedUrls[photo.storage_path] || '';
                              const isMain = photo.role === 'main';
                              return (
                                <SortableUnitPhotoCard
                                  key={photo.id}
                                  photo={photo}
                                  photoUrl={photoUrl}
                                  isMain={isMain}
                                  onSetMain={() => handleSetUnitMainPhoto(unit.id as string, photo.id)}
                                  onDelete={() => handleDeleteUnitPhoto(unit.id as string, photo.id)}
                                />
                              );
                            })}
                            {unit.id && unitPhotos.length === 0 && <p className="col-span-full text-xs text-slate-500">No photos uploaded yet.</p>}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </section>

    </div>
  );
}

