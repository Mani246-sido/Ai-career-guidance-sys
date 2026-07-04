import { useState, useMemo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import ProgressRing from '@/components/ui/ProgressRing';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { careerService } from '@/services/auth.service';

export default function TimeMachine() {
  const [inputs, setInputs] = useState({
    studyHours: 4,
    projects: 3,
    internships: 1,
    certifications: 2,
    dsaScore: 50,
  });

  const [official, setOfficial] = useState(null); // last real AI prediction from backend
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setInputs((s) => ({ ...s, [key]: Number(e.target.value) }));

  // Instant client-side preview — moves the moment you touch a slider.
  const preview = useMemo(() => {
    const score =
      inputs.studyHours * 3.5 +
      inputs.projects * 7 +
      inputs.internships * 10 +
      inputs.certifications * 4 +
      inputs.dsaScore * 0.3;
    const placement = Math.min(97, 20 + score * 0.6);
    const salary = Math.round((3.5 + score * 0.15) * 10) / 10;
    const readiness = Math.min(98, 25 + score * 0.55);
    return { placement, salary, readiness };
  }, [inputs]);

  // Load last real prediction on mount so the page isn't empty
  useEffect(() => {
    careerService
      .history()
      .then((res) => {
        const history = res.data.data;
        if (history?.length) setOfficial(history[0]);
      })
      .catch(() => {});
  }, []);

  const runPrediction = async () => {
    setPredicting(true);
    setError(null);
    try {
      const res = await careerService.predict(inputs);
      setOfficial(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Try again.');
    } finally {
      setPredicting(false);
    }
  };

  const sliders = [
    { key: 'studyHours', label: 'Daily study hours', min: 1, max: 10, unit: 'hrs' },
    { key: 'projects', label: 'Live projects completed', min: 0, max: 10, unit: '' },
    { key: 'internships', label: 'Internships done', min: 0, max: 4, unit: '' },
    { key: 'certifications', label: 'Certifications earned', min: 0, max: 8, unit: '' },
    { key: 'dsaScore', label: 'DSA progress', min: 0, max: 100, unit: '%' },
  ];

  const results = official?.results;

  return (
    <div>
      <PageHeader title="Career Time Machine" description="Adjust your inputs, preview instantly, then run the real AI prediction." />

      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard strong className="p-8 lg:col-span-3 space-y-7">
          {sliders.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-ink)]">{s.label}</label>
                <span className="text-sm font-mono text-[var(--color-indigo)]">{inputs[s.key]}{s.unit}</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={inputs[s.key]}
                onChange={set(s.key)}
                className="w-full h-2 rounded-full appearance-none bg-[var(--color-line)] accent-[var(--color-indigo)] cursor-pointer"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <GradientButton icon={Sparkles} onClick={runPrediction} disabled={predicting} className="w-full">
            {predicting ? 'Running AI prediction…' : 'Run official AI prediction'}
          </GradientButton>
        </GlassCard>

        <div className="lg:col-span-2 space-y-5">
          <GlassCard className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] mb-4">Live preview</p>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col items-center">
                <ProgressRing value={Math.round(preview.placement)} size={90} label="Placement" />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing value={Math.round(preview.readiness)} size={90} label="Readiness" color="var(--color-mint)" />
              </div>
            </div>
            <div className="text-center mt-5">
              <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-widest font-mono mb-1">Est. salary</p>
              <span className="text-xl font-display font-semibold text-[var(--color-ink)]">₹{preview.salary} LPA</span>
            </div>
          </GlassCard>

          <GlassCard strong className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)] mb-4">
              {results ? 'Official AI result' : 'No prediction yet'}
            </p>
            {results ? (
              <>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col items-center">
                    <ProgressRing value={results.placementProbability} size={90} label="Placement" />
                  </div>
                  <div className="flex flex-col items-center">
                    <ProgressRing value={results.readinessScore} size={90} label="Readiness" color="var(--color-mint)" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-widest font-mono mb-1">Salary range</p>
                  <span className="text-xl font-display font-semibold text-[var(--color-ink)]">
                    ₹<AnimatedCounter value={results.salaryRangeMin} className="inline" /> – {results.salaryRangeMax} LPA
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--color-ink-faint)]">Run the AI prediction to see your official numbers here.</p>
            )}
          </GlassCard>
        </div>
      </div>

      {official?.aiInsights?.length > 0 && (
        <GlassCard className="p-6 mt-6">
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-4">AI insights</h3>
          <ul className="space-y-2">
            {official.aiInsights.map((insight, i) => (
              <li key={i} className="text-sm text-[var(--color-ink-soft)] flex gap-2">
                <span className="text-[var(--color-indigo)]">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
