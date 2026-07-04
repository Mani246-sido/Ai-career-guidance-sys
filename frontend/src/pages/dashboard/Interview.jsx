import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import ProgressRing from '@/components/ui/ProgressRing';
import { interviewService } from '@/services/auth.service';

const roles = ['Backend Developer', 'Frontend Developer', 'Data Analyst', 'Product Intern'];

export default function Interview() {
  const [stage, setStage] = useState('setup'); // setup | answering | scoring | done
  const [role, setRole] = useState(roles[0]);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [report, setReport] = useState(null);

  const handleStart = async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await interviewService.start({ role, mode: 'text' });
      setQuestions(res.data.data.questions);
      setTranscript([]);
      setCurrentIndex(0);
      setAnswer('');
      setStage('answering');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start interview.');
    } finally {
      setStarting(false);
    }
  };

  const handleNext = async () => {
    const updatedTranscript = [...transcript, { question: questions[currentIndex], answer }];
    setTranscript(updatedTranscript);
    setAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    setStage('scoring');
    setError(null);
    try {
      const res = await interviewService.submitFeedback({
        role,
        mode: 'text',
        transcript: updatedTranscript,
      });
      setReport(res.data.data);
      setStage('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate feedback.');
      setStage('answering');
    }
  };

  if (stage === 'setup') {
    return (
      <div>
        <PageHeader title="Mock Interview" description="Practice with an AI interviewer that adapts to your answers." />
        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard strong className="p-8 lg:col-span-2 flex flex-col items-center text-center justify-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-indigo-soft)] flex items-center justify-center mb-5">
              <Mic size={26} className="text-[var(--color-indigo)]" />
            </div>
            <h3 className="font-display font-medium text-xl text-[var(--color-ink)] mb-2">Ready when you are</h3>
            <p className="text-sm text-[var(--color-ink-faint)] max-w-sm mb-6">
              5 questions for {role}. You'll get a score on clarity, structure, and technical depth.
            </p>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <GradientButton size="lg" icon={Play} onClick={handleStart} disabled={starting}>
              {starting ? 'Preparing questions…' : 'Start interview'}
            </GradientButton>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display font-medium text-sm text-[var(--color-ink-faint)] uppercase tracking-widest mb-4">Target role</h3>
            <ul className="space-y-2">
              {roles.map((r) => (
                <li key={r}>
                  <button
                    onClick={() => setRole(r)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      r === role ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas-soft)]'
                    }`}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (stage === 'answering') {
    return (
      <div>
        <PageHeader title="Mock Interview" description={`${role} · Question ${currentIndex + 1} of ${questions.length}`} />
        <GlassCard strong className="p-8 max-w-2xl mx-auto">
          <div className="flex gap-1.5 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentIndex ? 'bg-[var(--color-indigo)]' : 'bg-[var(--color-line)]'}`} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-display font-medium text-xl text-[var(--color-ink)] mb-6 leading-relaxed">
                {questions[currentIndex]}
              </p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer…"
                rows={7}
                className="w-full rounded-xl border border-[var(--color-line)] bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] resize-none"
              />
            </motion.div>
          </AnimatePresence>
          <div className="mt-5 flex justify-end">
            <GradientButton icon={ArrowRight} onClick={handleNext} disabled={!answer.trim()}>
              {currentIndex + 1 < questions.length ? 'Next question' : 'Finish & get feedback'}
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (stage === 'scoring') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 mb-5 rounded-full border-2 border-[var(--color-indigo-soft)] border-t-[var(--color-indigo)]"
        />
        <p className="text-[var(--color-ink-faint)]">Scoring your interview…</p>
      </div>
    );
  }

  // stage === 'done'
  return (
    <div>
      <PageHeader title="Interview feedback" description={`${role} · Completed`} />
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard strong className="p-8 lg:col-span-1 flex flex-col items-center text-center">
          <CheckCircle2 size={22} className="text-[var(--color-mint)] mb-3" />
          <div className="grid grid-cols-3 gap-3 w-full mb-2">
            <div className="text-center">
              <ProgressRing value={report.technicalScore} size={72} />
              <p className="text-[10px] text-[var(--color-ink-faint)] mt-1">Technical</p>
            </div>
            <div className="text-center">
              <ProgressRing value={report.communicationScore} size={72} color="var(--color-mint)" />
              <p className="text-[10px] text-[var(--color-ink-faint)] mt-1">Communication</p>
            </div>
            <div className="text-center">
              <ProgressRing value={report.confidenceScore} size={72} color="var(--color-gold)" />
              <p className="text-[10px] text-[var(--color-ink-faint)] mt-1">Confidence</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 lg:col-span-2">
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-3">Feedback</h3>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">{report.feedback}</p>

          {report.improvementRoadmap?.length > 0 && (
            <>
              <h4 className="text-sm font-medium text-[var(--color-ink)] mb-3">Improvement roadmap</h4>
              <ul className="space-y-2">
                {report.improvementRoadmap.map((r, i) => (
                  <li key={i} className="text-sm text-[var(--color-ink-soft)] flex gap-2">
                    <span className="text-[var(--color-indigo)]">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          <GradientButton size="sm" className="mt-6" onClick={() => setStage('setup')}>
            Practice again
          </GradientButton>
        </GlassCard>
      </div>
    </div>
  );
}
