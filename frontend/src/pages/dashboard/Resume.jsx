import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import ProgressRing from '@/components/ui/ProgressRing';
import { LoadingState } from '@/components/ui/AsyncState';
import { profileService, resumeService } from '@/services/auth.service';

export default function Resume() {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const loadLatestReport = useCallback(async () => {
    try {
      const res = await resumeService.reports();
      const reports = res.data.data;
      if (reports?.length) setReport(reports[0]);
    } catch {
      // no reports yet, fine
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestReport();
  }, [loadLatestReport]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      await profileService.uploadResume(formData);

      setUploading(false);
      setAnalyzing(true);
      const res = await resumeService.analyze({});
      setReport(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload or analysis failed.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingState label="Checking for previous reports…" />;

  const busy = uploading || analyzing;

  return (
    <div>
      <PageHeader title="Resume Analyzer" description="Line-by-line feedback scored against the roles you're targeting." />

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard strong className="p-8 lg:col-span-1 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-indigo-soft)] flex items-center justify-center mb-4">
            <FileText size={24} className="text-[var(--color-indigo)]" />
          </div>
          <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-2">
            {fileName ? fileName : 'Upload your resume'}
          </h3>
          <p className="text-sm text-[var(--color-ink-faint)] mb-6">PDF or DOCX, up to 5MB.</p>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
          <GradientButton icon={busy ? Sparkles : Upload} onClick={() => fileRef.current?.click()} disabled={busy}>
            {uploading ? 'Uploading…' : analyzing ? 'Analyzing with AI…' : 'Choose file'}
          </GradientButton>
          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        </GlassCard>

        <GlassCard className="p-8 lg:col-span-2">
          {!report ? (
            <div className="text-center py-14">
              <p className="text-sm text-[var(--color-ink-faint)]">
                No analysis yet — upload your resume to get an ATS score and suggestions.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-8 mb-8">
                <ProgressRing value={report.atsScore} size={120} label="ATS score" />
                <div>
                  <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-1">
                    {report.atsScore >= 75 ? 'Strong match for your target role' : 'Room to sharpen alignment'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    {report.suggestions?.[0] || 'Review the suggestions below to improve your score.'}
                  </p>
                </div>
              </div>

              {report.missingSkills?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--color-ink)] mb-3">Missing skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.missingSkills.map((s) => (
                      <span key={s} className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-500">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {report.suggestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-ink)] mb-3">Suggestions</h4>
                  <ul className="space-y-2">
                    {report.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-[var(--color-ink-soft)] flex gap-2">
                        <span className="text-[var(--color-indigo)]">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
