import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Lock,
  Send,
  FileText,
  MessageSquare,
  Award,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import ProgressRing from '@/components/ui/ProgressRing';
import { LoadingState, ErrorState } from '@/components/ui/AsyncState';
import { internshipService } from '@/services/auth.service';

const roleOptions = ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Analyst'];
const tabs = ['Brief', 'Submission'];
const STORAGE_KEY = 'careerOS_internshipId';

export default function Internship() {
  const [phase, setPhase] = useState('checking'); // checking | onboarding | active
  const [starting, setStarting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  const [internship, setInternship] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [tab, setTab] = useState('Brief');
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async (internshipId) => {
    const res = await internshipService.getTasks({ internshipId });
    return res.data.data;
  }, []);

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) {
      setPhase('onboarding');
      return;
    }
    loadTasks(savedId)
      .then((fetchedTasks) => {
        setTasks(fetchedTasks);
        const current = fetchedTasks.find((t) => t.status === 'pending') || fetchedTasks[0];
        setActiveTask(current);
        setPhase('active');
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setPhase('onboarding');
      });
  }, [loadTasks]);

  const handleStart = async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await internshipService.start({ role: selectedRole });
      const { internship: newInternship, tasks: newTasks } = res.data.data;
      localStorage.setItem(STORAGE_KEY, newInternship._id);
      setInternship(newInternship);
      setTasks(newTasks);
      setActiveTask(newTasks.find((t) => t.status === 'pending') || newTasks[0]);
      setPhase('active');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start internship.');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim() || !activeTask) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await internshipService.submitTask({
        taskId: activeTask._id,
        submissionContent: submission,
      });
      const { task: updatedTask, internship: updatedInternship } = res.data.data;
      setInternship(updatedInternship);
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      setActiveTask(updatedTask);

      // unlock next task locally for the sidebar
      const nextTasks = await loadTasks(updatedInternship._id);
      setTasks(nextTasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === 'checking') return <LoadingState label="Loading your internship…" />;

  if (phase === 'onboarding') {
    return (
      <div>
        <PageHeader title="Virtual Internship" description="Missions reviewed by AI, structured like a real engineering sprint." />
        <GlassCard strong className="p-8 max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-indigo-soft)] flex items-center justify-center mx-auto mb-5">
            <GitBranch size={22} className="text-[var(--color-indigo)]" />
          </div>
          <h3 className="font-display font-medium text-xl text-[var(--color-ink)] mb-2">Start your internship</h3>
          <p className="text-sm text-[var(--color-ink-faint)] mb-6">
            Pick a role. The AI will generate a 5-mission sprint tailored to it.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roleOptions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  r === selectedRole
                    ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                    : 'text-[var(--color-ink-soft)] border border-[var(--color-line)] hover:bg-[var(--color-canvas-soft)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <GradientButton className="w-full" onClick={handleStart} disabled={starting} icon={Sparkles}>
            {starting ? 'Generating missions…' : 'Start internship'}
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  const completed = tasks.filter((t) => t.status === 'reviewed').length;
  const progress = internship?.progress ?? Math.round((completed / (tasks.length || 1)) * 100);
  const review = activeTask?.aiReview;

  return (
    <div>
      <PageHeader title="Virtual Internship" description={internship?.role || 'Your simulated engineering sprint'} />

      <GlassCard className="p-5 mb-6 flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-indigo-soft)] flex items-center justify-center">
            <GitBranch size={18} className="text-[var(--color-indigo)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">{completed}/{tasks.length} missions shipped</p>
            <p className="text-xs text-[var(--color-ink-faint)] font-mono">{progress}% complete</p>
          </div>
        </div>
        <div className="flex-1 min-w-[140px] h-2 rounded-full bg-[var(--color-line)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#5B5FEF,#12B5A6)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-[260px_1fr_300px] gap-6">
        <GlassCard className="p-5 h-fit">
          <h3 className="font-display font-medium text-xs text-[var(--color-ink-faint)] uppercase tracking-widest mb-4">Missions</h3>
          <ul className="space-y-1">
            {tasks.map((t) => (
              <li key={t._id}>
                <button
                  disabled={t.status === 'locked'}
                  onClick={() => {
                    setActiveTask(t);
                    setTab('Brief');
                    setSubmission(t.submissionContent || '');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    activeTask?._id === t._id
                      ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                      : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas-soft)]'
                  } ${t.status === 'locked' ? 'opacity-45 cursor-not-allowed' : ''}`}
                >
                  {t.status === 'reviewed' && <CheckCircle2 size={16} className="text-[var(--color-mint)] shrink-0" />}
                  {t.status === 'pending' && <Circle size={16} className="text-[var(--color-indigo)] shrink-0" />}
                  {t.status === 'locked' && <Lock size={14} className="text-[var(--color-ink-faint)] shrink-0" />}
                  <span className="truncate flex-1">{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-[var(--color-line)]">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-[var(--color-gold)]" />
              <span className="text-xs font-medium text-[var(--color-ink)]">Certificate</span>
            </div>
            <p className="text-xs text-[var(--color-ink-faint)] leading-relaxed">
              {progress === 100 ? 'Unlocked — check your notifications.' : `Unlocks at 100% completion.`}
            </p>
          </div>
        </GlassCard>

        <GlassCard strong className="overflow-hidden">
          <div className="px-7 pt-6 pb-4 border-b border-[var(--color-line)]">
            <h2 className="font-display font-semibold text-2xl text-[var(--color-ink)] mb-4">{activeTask?.title}</h2>
            <div className="flex gap-1 -mb-4">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                    tab === t ? 'text-[var(--color-indigo)]' : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {t === 'Brief' && <FileText size={14} className="inline mr-1.5 -mt-0.5" />}
                  {t === 'Submission' && <Send size={14} className="inline mr-1.5 -mt-0.5" />}
                  {t}
                  {tab === t && <motion.div layoutId="tab-underline" className="absolute left-2 right-2 -bottom-px h-0.5 bg-[var(--color-indigo)]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-7 min-h-[320px]">
            <AnimatePresence mode="wait">
              {tab === 'Brief' && (
                <motion.div key="brief" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed whitespace-pre-line">
                    {activeTask?.description}
                  </p>
                </motion.div>
              )}

              {tab === 'Submission' && (
                <motion.div key="submission" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    disabled={activeTask?.status === 'reviewed' || activeTask?.status === 'locked'}
                    placeholder="Paste your solution, PR link, or notes here…"
                    rows={9}
                    className="w-full rounded-xl border border-[var(--color-line)] bg-white p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] resize-none disabled:opacity-60"
                  />
                  {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                  {activeTask?.status !== 'reviewed' && activeTask?.status !== 'locked' && (
                    <div className="mt-4">
                      <GradientButton icon={Send} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Submitting for AI review…' : 'Submit for review'}
                      </GradientButton>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        <GlassCard className="p-6 h-fit">
          <h3 className="font-display font-medium text-xs text-[var(--color-ink-faint)] uppercase tracking-widest mb-5">AI Review</h3>

          {submitting && (
            <div className="text-center py-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 mx-auto mb-4 rounded-full border-2 border-[var(--color-indigo-soft)] border-t-[var(--color-indigo)]"
              />
              <p className="text-sm text-[var(--color-ink-faint)]">Reviewing your submission…</p>
            </div>
          )}

          {!submitting && !review && (
            <div className="text-center py-10">
              <Sparkles size={24} className="text-[var(--color-ink-faint)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-ink-faint)]">Submit your work to receive AI feedback and a mission score.</p>
            </div>
          )}

          {!submitting && review && (
            <div className="space-y-5">
              <div className="flex flex-col items-center">
                <ProgressRing value={review.qualityScore} size={100} color="var(--color-mint)" />
                <p className="text-sm font-medium text-[var(--color-ink)] mt-3">Quality score</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ['Security', review.securityScore],
                  ['Performance', review.performanceScore],
                  ['Docs', review.documentationScore],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="font-mono text-sm text-[var(--color-ink)]">{val}</p>
                    <p className="text-[10px] text-[var(--color-ink-faint)]">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{review.feedback}</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
