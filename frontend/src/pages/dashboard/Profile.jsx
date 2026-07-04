import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { LoadingState, ErrorState } from '@/components/ui/AsyncState';
import { profileService } from '@/services/auth.service';

export default function Profile() {
  const [form, setForm] = useState({
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',
    skills: '',
    interests: '',
    bio: '',
    targetRole: '',
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.get();
      const p = res.data.data;
      setForm({
        college: p.college || '',
        degree: p.degree || '',
        branch: p.branch || '',
        graduationYear: p.graduationYear || '',
        skills: (p.skills || []).join(', '),
        interests: (p.interests || []).join(', '),
        bio: p.bio || '',
        targetRole: p.targetRole || '',
      });
      setEmail(p.user?.email || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await profileService.update({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading your profile…" />;
  if (error && !form.college && !form.targetRole) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <PageHeader title="Profile" description="Keep this current — it feeds every prediction Vector makes." />

      <form onSubmit={handleSave}>
        <GlassCard strong className="p-8 max-w-2xl space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Email</label>
              <input
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-canvas-soft)] border border-[var(--color-line)] text-sm text-[var(--color-ink-faint)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Target role</label>
              <input
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="e.g. Backend Developer"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">College</label>
              <input
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Degree</label>
              <input
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. B.Tech"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Branch</label>
              <input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                placeholder="e.g. CSE"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Graduation year</label>
              <input
                value={form.graduationYear}
                onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                placeholder="e.g. 2027"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Skills (comma separated)</label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="Node.js, React, MongoDB"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Interests (comma separated)</label>
            <input
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="Backend systems, open source"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3">
            <GradientButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </GradientButton>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[var(--color-mint)] font-medium">
                <Check size={16} /> Saved
              </span>
            )}
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
