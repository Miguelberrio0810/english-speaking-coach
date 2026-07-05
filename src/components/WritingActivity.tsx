import { useState } from 'react';
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

export function WritingActivity({ activity, onBack, onComplete }: Props) {
  const [writtenText, setWrittenText] = useState('');
  const [step, setStep]               = useState<'write' | 'feedback'>('write');
  const [hasAsked, setHasAsked]       = useState(false);
  const [startTime]                   = useState(Date.now());

  const { streamingText, isStreaming, error, getFeedback, cancel, reset: resetAPI } = useClaudeAPI();

  const min = activity.wordTarget?.min ?? 50;
  const max = activity.wordTarget?.max ?? 300;
  const wordCount  = writtenText.split(/\s+/).filter(Boolean).length;
  const inRange    = wordCount >= min && wordCount <= max;
  const tooShort   = wordCount > 0 && wordCount < min;
  const tooLong    = wordCount > max;

  async function handleSubmit() {
    if (!writtenText.trim()) return;

    setStep('feedback');
    setHasAsked(true);
    resetAPI();

    const duration = Math.round((Date.now() - startTime) / 1000);

    await getFeedback({
      skill:          'writing',
      level:          activity.level,
      topicLabel:     activity.title,
      practiceText:   activity.text,
      writingPrompt:  activity.text,
      writtenText,
    });

    const entry: SessionEntry = {
      id:              crypto.randomUUID(),
      skill:           'writing',
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

  // Progress color
  const progressPct = Math.min(100, (wordCount / max) * 100);
  const progressColor =
    tooShort   ? 'bg-amber-500'
    : inRange   ? 'bg-emerald-500'
    : tooLong   ? 'bg-rose-500'
    : 'bg-slate-600';

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
          <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 font-semibold">
            {activity.level}
          </span>
        </div>
        <span className="text-xs text-emerald-400">✍️ Writing</span>
      </div>

      {step === 'write' && (
        <div className="fade-in flex flex-col gap-5">
          {/* Writing prompt */}
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400">📋</span>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Writing Task</h2>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{activity.text}</p>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
              <span className="text-xs text-slate-500">Target:</span>
              <span className="text-xs font-semibold text-emerald-400">{min}–{max} words</span>
            </div>
          </div>

          {/* Writing tips banner */}
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <span className="text-emerald-400 mt-0.5">💡</span>
            <div className="text-sm text-slate-300 leading-relaxed">
              Write naturally — focus on <em className="text-emerald-300">expressing your ideas clearly</em>.
              The AI will evaluate grammar, vocabulary, coherence, and CEFR appropriateness.
            </div>
          </div>

          {/* Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Your Writing
              </label>
              <span className={`text-xs font-semibold tabular-nums
                ${tooShort ? 'text-amber-400' : inRange ? 'text-emerald-400' : tooLong ? 'text-rose-400' : 'text-slate-500'}`}>
                {wordCount} / {max} words
              </span>
            </div>
            <textarea
              value={writtenText}
              onChange={e => setWrittenText(e.target.value)}
              placeholder={`Start writing here… (aim for ${min}–${max} words)`}
              rows={10}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3
                         text-slate-200 text-sm leading-[1.85] placeholder-slate-600
                         focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                         resize-y transition-colors"
            />

            {/* Progress bar */}
            <div className="mt-2">
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {tooShort && (
                <p className="text-xs text-amber-400 mt-1">
                  {min - wordCount} more word{min - wordCount !== 1 ? 's' : ''} to reach the minimum
                </p>
              )}
              {tooLong && (
                <p className="text-xs text-rose-400 mt-1">
                  {wordCount - max} word{wordCount - max !== 1 ? 's' : ''} over the target maximum
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!writtenText.trim()}
            className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200
              ${writtenText.trim()
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            ✨ Submit for AI Feedback
          </button>
        </div>
      )}

      {/* ── STEP: feedback ── */}
      {step === 'feedback' && (
        <div className="fade-in flex flex-col gap-5">
          {/* Summary card */}
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Your Submission</div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold tabular-nums text-emerald-400">{wordCount}</div>
              <div className="text-sm text-slate-400">words written at <strong className="text-white">{activity.level}</strong> level</div>
            </div>
          </div>

          {/* Written text (collapsed) */}
          <details className="bg-surface rounded-xl border border-white/10 p-4 cursor-pointer">
            <summary className="text-xs font-semibold text-slate-500 uppercase tracking-widest select-none">
              Your Writing ↕
            </summary>
            <p className="text-slate-300 text-sm leading-relaxed mt-3 whitespace-pre-wrap">{writtenText}</p>
          </details>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-semibold text-sm mb-1">API Error</div>
              <div className="text-slate-400 text-sm">{error}</div>
              <button onClick={handleSubmit} className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
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
                  <span className="text-emerald-400">🤖</span>
                  <h3 className="text-sm font-semibold text-slate-200">AI Writing Feedback</h3>
                  {isStreaming && (
                    <span className="flex gap-0.5 ml-2">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </div>
                {isStreaming
                  ? <button onClick={cancel} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Stop</button>
                  : <button onClick={handleSubmit} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Regenerate</button>
                }
              </div>
              <div className="feedback-prose feedback-prose--writing text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm
                       hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
          >
            ✍️ New Writing Session
          </button>
        </div>
      )}
    </div>
  );
}
