import { useState, useEffect, useRef } from 'react';
import { type Activity } from '../data/activities';
import { type SessionEntry } from './SessionHistory';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  activity:   Activity;
  onBack:     () => void;
  onComplete: (entry: SessionEntry) => void;
}

export function ReadingActivity({ activity, onBack, onComplete }: Props) {
  const [step, setStep]         = useState<'read' | 'questions' | 'feedback'>('read');
  const [answers, setAnswers]   = useState<string[]>(
    () => (activity.questions ?? []).map(() => '')
  );
  const [elapsed, setElapsed]   = useState(0);
  const [startTime]             = useState(Date.now());
  const [hasAsked, setHasAsked] = useState(false);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  const { streamingText, isStreaming, error, getFeedback, cancel, reset: resetAPI } = useClaudeAPI();

  // Timer
  useEffect(() => {
    if (step === 'read') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  }

  const wordCount = activity.text.split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    const joined = (activity.questions ?? [])
      .map((q, i) => `${i + 1}. ${q}\nAnswer: ${answers[i] || '(no answer)'}`)
      .join('\n\n');

    if (!joined.trim()) return;

    setStep('feedback');
    setHasAsked(true);
    resetAPI();

    const duration = Math.round((Date.now() - startTime) / 1000);

    await getFeedback({
      skill:       'reading',
      level:       activity.level,
      topicLabel:  activity.title,
      practiceText: activity.text,
      questions:   activity.questions,
      answers:     joined,
    });

    const entry: SessionEntry = {
      id:              crypto.randomUUID(),
      skill:           'reading',
      topicLabel:      activity.title,
      topicIcon:       activity.icon,
      level:           activity.level,
      wordCount,
      duration,
      timestamp:       Date.now(),
      feedbackExcerpt: streamingText.slice(0, 200) || undefined,
      corrections:     [],
    };
    onComplete(entry);
  }

  const hasFeedback = streamingText.length > 0;
  const allAnswered = answers.every(a => a.trim().length > 0);

  return (
    <div className="fade-in flex flex-col gap-6">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{activity.icon}</span>
          <span className="font-semibold text-white truncate">{activity.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/15 text-sky-400 font-semibold">
            {activity.level}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {step === 'read' && <span className="font-mono text-sky-400">{formatTime(elapsed)}</span>}
          <span className="text-sky-400">📖 Reading</span>
        </div>
      </div>

      {/* ── STEP: read ── */}
      {step === 'read' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/20 rounded-xl p-4">
            <span className="text-sky-400 mt-0.5">💡</span>
            <div className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-sky-300">How to practice:</strong> Read the passage carefully.
              Take your time — comprehension is more important than speed.
              When you finish, click <strong className="text-white">Go to Questions</strong>.
            </div>
          </div>

          {/* Passage */}
          <div className="bg-surface rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Reading Passage
              </h2>
              <span className="text-xs text-slate-600">{wordCount} words</span>
            </div>
            <p className="text-slate-200 text-base leading-[1.85] whitespace-pre-wrap font-normal">
              {activity.text}
            </p>
          </div>

          <button
            onClick={() => setStep('questions')}
            className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold
                       transition-all duration-200 shadow-lg shadow-sky-900/40 hover:-translate-y-0.5"
          >
            📝 Go to Comprehension Questions
          </button>
        </div>
      )}

      {/* ── STEP: questions ── */}
      {step === 'questions' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/20 rounded-xl p-4">
            <span className="text-sky-400 mt-0.5">✏️</span>
            <div className="text-sm text-slate-300 leading-relaxed">
              Answer each question in your own words. Use information from the passage.
              You can <button
                onClick={() => setStep('read')}
                className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
              >
                re-read the passage
              </button> if needed.
            </div>
          </div>

          {(activity.questions ?? []).map((q, i) => (
            <div key={i} className="bg-surface rounded-xl border border-white/10 p-4">
              <label className="text-sm font-medium text-sky-300 mb-2 block">
                {i + 1}. {q}
              </label>
              <textarea
                value={answers[i]}
                onChange={e => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                placeholder="Your answer…"
                rows={3}
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2.5
                           text-slate-200 text-sm leading-relaxed placeholder-slate-600
                           focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20
                           resize-y transition-colors"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${allAnswered
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/30 hover:-translate-y-0.5'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            ✨ Submit for AI Feedback
          </button>
        </div>
      )}

      {/* ── STEP: feedback ── */}
      {step === 'feedback' && (
        <div className="fade-in flex flex-col gap-5">

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-semibold text-sm mb-1">API Error</div>
              <div className="text-slate-400 text-sm">{error}</div>
              <button onClick={handleSubmit} className="mt-3 text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {!hasFeedback && !isStreaming && hasAsked && !error && (
            <div className="text-center text-slate-500 text-sm py-4">Waiting for AI response…</div>
          )}

          {(hasFeedback || isStreaming) && (
            <div className="bg-surface rounded-2xl border border-white/10 p-5 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sky-400">🤖</span>
                  <h3 className="text-sm font-semibold text-slate-200">AI Reading Feedback</h3>
                  {isStreaming && (
                    <span className="flex gap-0.5 ml-2">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </div>
                {isStreaming
                  ? <button onClick={cancel} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Stop</button>
                  : <button onClick={handleSubmit} className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Regenerate</button>
                }
              </div>
              <div className="feedback-prose feedback-prose--reading text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-sky-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm
                       hover:border-sky-500/40 hover:text-sky-400 hover:bg-sky-500/5 transition-all"
          >
            📖 New Reading Session
          </button>
        </div>
      )}
    </div>
  );
}
