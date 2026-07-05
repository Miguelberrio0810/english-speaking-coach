import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import { type Skill } from '../data/activities';

interface Props {
  skill:        Skill;
  topicLabel:   string;
  level:        string;
  practiceText: string;
  spokenText:   string;
  accuracy:     number;
}

const SKILL_COLOR: Record<Skill, { accent: string; border: string; ring: string }> = {
  speaking:  { accent: 'text-violet-400', border: 'border-violet-500/60', ring: 'focus:ring-violet-500/30' },
  listening: { accent: 'text-amber-400',  border: 'border-amber-500/60',  ring: 'focus:ring-amber-500/30'  },
  reading:   { accent: 'text-sky-400',    border: 'border-sky-500/60',    ring: 'focus:ring-sky-500/30'    },
  writing:   { accent: 'text-emerald-400', border: 'border-emerald-500/60', ring: 'focus:ring-emerald-500/30'},
};

const PROSE_CLASS: Record<Skill, string> = {
  speaking:  'feedback-prose',
  listening: 'feedback-prose feedback-prose--listening',
  reading:   'feedback-prose feedback-prose--reading',
  writing:   'feedback-prose feedback-prose--writing',
};

const BOUNCE_COLOR: Record<Skill, string> = {
  speaking:  'bg-violet-400',
  listening: 'bg-amber-400',
  reading:   'bg-sky-400',
  writing:   'bg-emerald-400',
};

const CURSOR_COLOR: Record<Skill, string> = {
  speaking:  'bg-violet-400',
  listening: 'bg-amber-400',
  reading:   'bg-sky-400',
  writing:   'bg-emerald-400',
};

export function FeedbackPanel({
  skill,
  topicLabel,
  level,
  practiceText,
  spokenText,
  accuracy,
}: Props) {
  const [hasAsked, setHasAsked] = useState(false);

  const { streamingText, isStreaming, error, getFeedback, cancel, reset } = useClaudeAPI();

  const colors = SKILL_COLOR[skill];

  async function handleGetFeedback() {
    setHasAsked(true);
    reset();
    await getFeedback({
      skill,
      level,
      topicLabel,
      practiceText,
      spokenText,
      accuracy,
    });
  }

  const hasFeedback = streamingText.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Get feedback button */}
      {!hasFeedback && !isStreaming && (
        <button
          onClick={handleGetFeedback}
          disabled={!spokenText.trim() || isStreaming}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
            ${spokenText.trim()
              ? `bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0`
              : 'bg-surface-2 text-slate-600 cursor-not-allowed'}
          `}
        >
          ✨ Get AI Feedback
        </button>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-rose-400 mt-0.5">⚠️</span>
            <div>
              <div className="text-rose-300 font-semibold text-sm mb-1">API Error</div>
              <div className="text-slate-400 text-sm">{error}</div>
            </div>
          </div>
          <button
            onClick={handleGetFeedback}
            className={`mt-3 text-xs ${colors.accent} hover:opacity-80 underline underline-offset-2`}
          >
            Try again
          </button>
        </div>
      )}

      {/* Streaming / result */}
      {(hasFeedback || isStreaming) && (
        <div className="bg-surface rounded-2xl border border-white/10 p-5 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={colors.accent}>🤖</span>
              <h3 className="text-sm font-semibold text-slate-200">AI Feedback</h3>
              {isStreaming && (
                <span className="flex gap-0.5 ml-2">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 ${BOUNCE_COLOR[skill]} rounded-full animate-bounce`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              )}
            </div>
            {isStreaming ? (
              <button onClick={cancel} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">
                Stop
              </button>
            ) : (
              <button onClick={handleGetFeedback} className={`text-xs text-slate-500 hover:${colors.accent} transition-colors`}>
                Regenerate
              </button>
            )}
          </div>

          <div className={`${PROSE_CLASS[skill]} text-sm`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {streamingText}
            </ReactMarkdown>
            {isStreaming && (
              <span className={`inline-block w-0.5 h-4 ${CURSOR_COLOR[skill]} animate-pulse ml-0.5 align-middle`} />
            )}
          </div>
        </div>
      )}

      {/* No speech warning */}
      {hasAsked && !spokenText.trim() && (
        <div className="text-center text-sm text-slate-500 py-2">
          Record yourself speaking first before requesting feedback.
        </div>
      )}
    </div>
  );
}
