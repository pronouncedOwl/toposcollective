'use client';

import { useEffect, useMemo, useState } from 'react';

type RoleRow = {
  email: string;
  role: 'admin' | 'employee';
  created_at: string;
};

type AccessRequest = {
  id: string;
  email: string;
  name: string;
  note: string | null;
  created_at: string;
};

type Feedback = { type: 'success' | 'error'; message: string } | null;

export default function RolesManager({ adminEmail }: { adminEmail: string }) {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [formState, setFormState] = useState({ email: '', role: 'employee' as RoleRow['role'] });

  const loadRoles = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const [rolesRes, requestsRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/access-requests'),
      ]);

      if (!rolesRes.ok || !requestsRes.ok) {
        throw new Error('Failed to load roles');
      }

      const rolesPayload = await rolesRes.json();
      const requestsPayload = await requestsRes.json();
      setRoles(rolesPayload?.data?.roles ?? []);
      setRequests(requestsPayload?.data?.requests ?? []);
    } catch (error) {
      console.error('Failed to load roles', error);
      setFeedback({ type: 'error', message: 'Could not load roles' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleAddRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to add role');
      }

      setFormState({ email: '', role: 'employee' });
      setFeedback({ type: 'success', message: 'Role saved' });
      loadRoles();
    } catch (error) {
      console.error('Failed to add role', error);
      setFeedback({ type: 'error', message: 'Could not save role' });
    }
  };

  const handleDeleteRole = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) return;
    try {
      const response = await fetch(`/api/admin/roles/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete role');
      }
      loadRoles();
    } catch (error) {
      console.error('Failed to delete role', error);
      setFeedback({ type: 'error', message: 'Could not remove role' });
    }
  };

  const handleChangeRole = async (email: string, role: RoleRow['role']) => {
    try {
      const response = await fetch(`/api/admin/roles/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      loadRoles();
    } catch (error) {
      console.error('Failed to update role', error);
      setFeedback({ type: 'error', message: 'Could not update role' });
    }
  };

  const handleApproveRequest = async (request: AccessRequest, role: RoleRow['role']) => {
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: request.email, role }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      await fetch(`/api/admin/access-requests/${request.id}`, { method: 'DELETE' });
      loadRoles();
    } catch (error) {
      console.error('Failed to approve request', error);
      setFeedback({ type: 'error', message: 'Could not approve request' });
    }
  };

  const currentAdminRole = useMemo(
    () => roles.find((role) => role.email === adminEmail)?.role ?? 'admin',
    [adminEmail, roles],
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-900">Roles</h1>
            <p className="text-sm text-slate-600">Manage who can access the CMS.</p>
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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Add User</p>
            <h2 className="text-xl font-semibold text-slate-900">Grant access</h2>
          </div>
        </div>
        <form className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr_auto]" onSubmit={handleAddRole}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            placeholder="name@company.com"
            type="email"
            required
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            value={formState.role}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, role: event.target.value as RoleRow['role'] }))
            }
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            type="submit"
          >
            Save
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Approved</p>
            <h2 className="text-xl font-semibold text-slate-900">Team access</h2>
          </div>
          <span className="text-sm text-slate-500">{loading ? 'Loading…' : `${roles.length} users`}</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    {loading ? 'Loading roles…' : 'No roles found'}
                  </td>
                </tr>
              )}
              {roles.map((role) => (
                <tr key={role.email} className="border-b border-slate-200">
                  <td className="px-4 py-3 text-slate-900">{role.email}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                      value={role.role}
                      disabled={role.email === adminEmail}
                      onChange={(event) => handleChangeRole(role.email, event.target.value as RoleRow['role'])}
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDeleteRole(role.email)}
                      disabled={role.email === adminEmail && currentAdminRole === 'admin'}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Requests</p>
            <h2 className="text-xl font-semibold text-slate-900">Pending access</h2>
          </div>
          <span className="text-sm text-slate-500">{loading ? 'Loading…' : `${requests.length} requests`}</span>
        </div>
        <div className="mt-6 space-y-4">
          {requests.length === 0 && (
            <div className="rounded-xl border border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              {loading ? 'Loading requests…' : 'No pending requests'}
            </div>
          )}
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{request.name}</p>
                  <p className="text-sm text-slate-600">{request.email}</p>
                  {request.note && <p className="mt-2 text-xs text-slate-500">{request.note}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700"
                    onClick={() => handleApproveRequest(request, 'employee')}
                  >
                    Approve employee
                  </button>
                  <button
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700"
                    onClick={() => handleApproveRequest(request, 'admin')}
                  >
                    Approve admin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
