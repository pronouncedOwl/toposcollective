'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../../lib/supabase-browser';

type SessionStatus = {
  email: string | null;
  role: 'admin' | 'employee' | null;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({ email: null, role: null });
  const [requestState, setRequestState] = useState({
    name: '',
    email: '',
    note: '',
  });
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);
  const [requestSending, setRequestSending] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session');
        const payload = await response.json();
        const email = payload?.data?.user?.email ?? null;
        const role = payload?.data?.role ?? null;
        setSessionStatus({ email, role });
        if (email && role) {
          router.replace('/admin/projects');
        }
      } catch (error) {
        console.error('Failed to check admin session', error);
      }
    };

    checkSession();
  }, [router]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectTo = `${baseUrl}/admin/auth/callback?next=/admin/projects`;
      
      console.log('[admin-login] Starting OAuth sign-in:', {
        baseUrl,
        redirectTo,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        windowLocationOrigin: window.location.origin,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });
      
      const { error, data } = await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });

      console.log('[admin-login] OAuth sign-in response:', {
        error: error?.message,
        errorDetails: error,
        data,
      });

      if (error) {
        console.error('[admin-login] Failed to start sign-in:', error);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('[admin-login] Exception during sign-in:', error);
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestFeedback(null);
    setRequestSending(true);

    try {
      const response = await fetch('/api/admin/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestState),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Request failed');
      }

      setRequestFeedback(
        payload?.data?.duplicate
          ? 'We already have your request. We will follow up soon.'
          : 'Request submitted. We will follow up soon.',
      );
      setRequestState({ name: '', email: '', note: '' });
    } catch (error) {
      console.error('Failed to submit access request', error);
      setRequestFeedback('Could not submit request. Please try again.');
    } finally {
      setRequestSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Access</p>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in to the Projects CMS</h1>
          <p className="text-sm text-slate-600">
            Sign in with your company Google account. Access is restricted to approved team members.
          </p>
        </div>
        {sessionStatus.email && !sessionStatus.role && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {sessionStatus.email} is signed in but not yet approved. Please request access below.
          </div>
        )}
        <button
          className="mt-6 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Opening Google sign-in…' : 'Sign in with Google'}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Request Access</p>
          <h2 className="text-2xl font-semibold text-slate-900">Need access?</h2>
          <p className="text-sm text-slate-600">
            Tell us who you are and we will add you to the system.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleRequestSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Name
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                required
                value={requestState.name}
                onChange={(event) => setRequestState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                required
                type="email"
                value={requestState.email}
                onChange={(event) => setRequestState((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Note (optional)
            <textarea
              className="min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              value={requestState.note}
              onChange={(event) => setRequestState((prev) => ({ ...prev, note: event.target.value }))}
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={requestSending}
            >
              {requestSending ? 'Sending…' : 'Request to be added'}
            </button>
            {requestFeedback && <span className="text-sm text-slate-600">{requestFeedback}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}
