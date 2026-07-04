import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, AlertCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { LoadingState } from '@/components/ui/AsyncState';
import { skillService } from '@/services/auth.service';

const roles = ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Analyst'];

export default function SkillGap() {
  const [role, setRole] = useState(roles[0]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await skillService.gapHistory();
      const history = res.data.data;
      if (history?.length) {
        setAnalysis(history[0]);
        setRole(history[0].targetRole);
      }
    } catch {
      // no history yet
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await skillService.gapAnalysis({ targetRole: role });
      setAnalysis(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Make sure your profile has skills listed.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingHistory) return <LoadingState label="Checking your skill history…" />;

  const required = analysis?.requiredSkills || [];
  const missing = new Set(analysis?.missingSkills || []);
  const matchPercentage = analysis?.matchPercentage ?? 0;
  const recommendations = analysis?.recommendations || [];
  const missingCount = missing.size;

  return (
    <div>
      <PageHeader title="Skill Gap Analysis" description="Ranked by how much each skill separates you from the role you want." />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <GlassCard strong className="p-6 lg:col-span-1">
          <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] mb-3 block">
            Target role
          </label>
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--color-line)] bg-white text-sm font-medium text-[var(--color-ink)]"
            >
              {role}
              <motion.span animate={{ rotate: roleOpen ? 180 : 0 }}>
                <ChevronDown size={16} className="text-[var(--color-ink-faint)]" />
              </motion.span>
            </button>
            <AnimatePresence>
              {roleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 w-full glass-strong rounded-xl overflow-hidden z-20"
                >
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-indigo-soft)] hover:text-[var(--color-indigo)] transition-colors ${
                        r === role ? 'text-[var(--color-indigo)] font-medium' : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <GradientButton className="w-full mt-4" icon={Sparkles} size="sm" onClick={runAnalysis} disabled={analyzing}>
            {analyzing ? 'Analyzing…' : 'Run analysis'}
          </GradientButton>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-indigo-soft)] flex items-center justify-center">
              <TrendingUp size={18} className="text-[var(--color-indigo)]" />
            </div>
            <span className="text-3xl font-display font-semibold text-[var(--color-ink)]">{matchPercentage}%</span>
          </div>
          <p className="text-sm text-[var(--color-ink-faint)]">Overall match to {analysis?.targetRole || role}</p>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={18} className="text-red-500" />
            </div>
            <span className="text-3xl font-display font-semibold text-[var(--color-ink)]">{missingCount}</span>
          </div>
          <p className="text-sm text-[var(--color-ink-faint)]">Skills you're missing</p>
        </GlassCard>
      </div>

      {!analysis ? (
        <GlassCard className="p-14 text-center">
          <Sparkles size={24} className="text-[var(--color-ink-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-ink-faint)]">
            Pick a target role and run an analysis to see exactly which skills separate you from it.
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard strong className="p-2 sm:p-4 mb-5">
            {required.map((skill, i) => {
              const isMissing = missing.has(skill);
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className={`flex items-center gap-4 px-4 sm:px-5 py-4 ${i !== required.length - 1 ? 'border-b border-[var(--color-line)]' : ''}`}
                >
                  <span className="font-mono text-xs text-[var(--color-ink-faint)] w-6">{String(i + 1).padStart(2, '0')}</span>
                  {isMissing ? (
                    <XCircle size={18} className="text-red-500 shrink-0" />
                  ) : (
                    <CheckCircle2 size={18} className="text-[var(--color-mint)] shrink-0" />
                  )}
                  <span className="font-display font-medium text-[var(--color-ink)] flex-1">{skill}</span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      isMissing ? 'bg-red-50 text-red-500' : 'bg-[var(--color-mint-soft)] text-[var(--color-mint)]'
                    }`}
                  >
                    {isMissing ? 'Missing' : 'Matched'}
                  </span>
                </motion.div>
              );
            })}
          </GlassCard>

          {recommendations.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-[var(--color-ink-soft)] flex gap-2">
                    <span className="text-[var(--color-indigo)]">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
