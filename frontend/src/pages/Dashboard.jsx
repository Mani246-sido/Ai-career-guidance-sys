import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, FileText, Sparkles, Bell, Briefcase } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import MetricCard from '@/components/ui/MetricCard';
import GlassCard from '@/components/ui/GlassCard';
import ProgressRing from '@/components/ui/ProgressRing';
import { LoadingState, ErrorState } from '@/components/ui/AsyncState';
import { useAuthStore } from '@/store/authStore';
import { dashboardService } from '@/services/auth.service';

// Illustrative radar until a dedicated skill-vector endpoint exists —
// real gap data lives on the Skill Gap page.
const skillData = [
  { skill: 'DSA', value: 72 },
  { skill: 'Projects', value: 85 },
  { skill: 'Communication', value: 60 },
  { skill: 'System Design', value: 45 },
  { skill: 'Resume', value: 78 },
  { skill: 'Interviews', value: 55 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.get();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState label="Loading your dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const readiness = data?.careerReadiness ?? 0;
  const placement = data?.placementProbability ?? 0;
  const resumeScore = data?.resumeScore ?? 0;
  const salaryMin = data?.salaryRange?.min ?? 0;
  const salaryMax = data?.salaryRange?.max ?? 0;
  const insights = data?.aiInsights || [];
  const notifications = data?.notifications || [];
  const internships = data?.activeInternships || [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-semibold text-3xl text-[var(--color-ink)]">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[var(--color-ink-faint)] mt-1">
          {data?.profile?.targetRole
            ? `Tracking toward ${data.profile.targetRole}`
            : "Here's where your simulation stands today."}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard icon={Target} label="Career readiness" value={readiness} suffix="%" accent="indigo" />
        <MetricCard icon={TrendingUp} label="Placement probability" value={placement} suffix="%" accent="mint" />
        <MetricCard icon={FileText} label="Resume score" value={resumeScore} suffix="/100" accent="gold" />
        <MetricCard icon={Briefcase} label="Salary range" value={salaryMin} suffix={` – ${salaryMax} LPA`} accent="sky" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-4">Skill radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="#E6E8EE" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#4A5066', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#5B5FEF" fill="#5B5FEF" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] self-start mb-2">Overall readiness</h3>
          <ProgressRing value={readiness} size={140} label="Ready" />
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[var(--color-indigo)]" />
            <h3 className="font-display font-medium text-lg text-[var(--color-ink)]">AI insights</h3>
          </div>
          {insights.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-faint)]">Run a career prediction in the Time Machine to get insights here.</p>
          ) : (
            <ul className="space-y-3">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex gap-2">
                  <span className="text-[var(--color-indigo)]">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-[var(--color-indigo)]" />
            <h3 className="font-display font-medium text-lg text-[var(--color-ink)]">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-faint)]">You're all caught up.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li key={n._id} className="flex items-start justify-between gap-4 text-sm">
                  <div>
                    <p className="text-[var(--color-ink)] font-medium">{n.title}</p>
                    <p className="text-[var(--color-ink-faint)] text-xs mt-0.5">{n.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      {internships.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-4">Active internships</h3>
          <ul className="space-y-3">
            {internships.map((i) => (
              <li key={i._id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] font-medium">{i.role}</span>
                <span className="font-mono text-xs text-[var(--color-ink-faint)]">{i.progress || 0}% complete</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
