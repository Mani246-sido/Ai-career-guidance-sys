import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ExternalLink, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { LoadingState } from '@/components/ui/AsyncState';
import { roadmapService } from '@/services/auth.service';

const roles = ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Analyst'];

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [role, setRole] = useState(roles[0]);
  const [error, setError] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roadmapService.get();
      setRoadmap(res.data.data);
    } catch {
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await roadmapService.generate({ targetRole: role });
      setRoadmap(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleMilestone = async (index, completed) => {
    setUpdatingIndex(index);
    // optimistic update
    setRoadmap((prev) => {
      const next = { ...prev, milestones: [...prev.milestones] };
      next.milestones[index] = { ...next.milestones[index], completed };
      return next;
    });
    try {
      await roadmapService.updateMilestone(roadmap._id, index, { completed });
    } catch {
      // revert on failure
      setRoadmap((prev) => {
        const next = { ...prev, milestones: [...prev.milestones] };
        next.milestones[index] = { ...next.milestones[index], completed: !completed };
        return next;
      });
    } finally {
      setUpdatingIndex(null);
    }
  };

  if (loading) return <LoadingState label="Loading your roadmap…" />;

  if (!roadmap) {
    return (
      <div>
        <PageHeader title="Learning Roadmap" description="Generated from your skill gaps — not a generic course list." />
        <GlassCard strong className="p-8 max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-indigo-soft)] flex items-center justify-center mx-auto mb-5">
            <Sparkles size={22} className="text-[var(--color-indigo)]" />
          </div>
          <h3 className="font-display font-medium text-xl text-[var(--color-ink)] mb-2">No roadmap yet</h3>
          <p className="text-sm text-[var(--color-ink-faint)] mb-6">Pick a target role and generate a milestone-based path.</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  r === role
                    ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                    : 'text-[var(--color-ink-soft)] border border-[var(--color-line)] hover:bg-[var(--color-canvas-soft)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <GradientButton className="w-full" onClick={handleGenerate} disabled={generating} icon={Sparkles}>
            {generating ? 'Generating roadmap…' : 'Generate roadmap'}
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  const doneCount = roadmap.milestones.filter((m) => m.completed).length;

  return (
    <div>
      <PageHeader title="Learning Roadmap" description={`Toward ${roadmap.targetRole}`} />

      <GlassCard strong className="p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-[var(--color-ink)]">Progress</span>
          <span className="text-sm font-mono text-[var(--color-indigo)]">
            {doneCount}/{roadmap.milestones.length}
          </span>
        </div>

        <div className="relative pl-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-line)]" />
          {roadmap.milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="relative pb-8 last:pb-0"
            >
              <span
                className={`absolute -left-8 top-0.5 w-4 h-4 rounded-full ring-4 ${
                  m.completed ? 'bg-[var(--color-mint)] ring-[var(--color-mint-soft)]' : 'bg-white border-2 border-[var(--color-line)] ring-transparent'
                }`}
              />
              <button
                onClick={() => toggleMilestone(i, !m.completed)}
                disabled={updatingIndex === i}
                className="flex items-start gap-2 text-left w-full"
              >
                {m.completed ? (
                  <CheckCircle2 size={16} className="text-[var(--color-mint)] mt-0.5 shrink-0" />
                ) : (
                  <Circle size={16} className="text-[var(--color-ink-faint)] mt-0.5 shrink-0" />
                )}
                <div>
                  <span className={`text-sm font-medium block ${m.completed ? 'text-[var(--color-ink-faint)] line-through' : 'text-[var(--color-ink)]'}`}>
                    {m.title}
                  </span>
                  <span className="text-xs text-[var(--color-ink-faint)]">{m.durationWeeks} weeks · {m.description}</span>
                </div>
              </button>

              {m.resources?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-6">
                  {m.resources.map((r, ri) => (
                    <a
                      key={ri}
                      href={r.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-indigo-soft)] text-[var(--color-indigo)] hover:opacity-80"
                    >
                      {r.title} <ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
