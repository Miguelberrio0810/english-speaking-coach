import { useState } from 'react';

interface Props {
  isRecording:       boolean;
  isSupported:       boolean;
  transcript:        string;
  interimTranscript: string;
  elapsedSeconds:    number;
  targetText:        string;
  onStart:           () => void;
  onStop:            () => void;
  onReset:           () => void;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function RecordingPanel({
  isRecording,
  isSupported,
  transcript,
  interimTranscript,
  elapsedSeconds,
  targetText,
  onStart,
  onStop,
  onReset,
}: Props) {
  const [textExpanded, setTextExpanded] = useState(true);

  const hasSpoken   = transcript.length > 0;
  const wordCount   = transcript.split(/\s+/).filter(Boolean).length;
  const targetWords = targetText.split(/\s+/).filter(Boolean).length;

  if (!isSupported) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <h3 className="text-amber-300 font-semibold mb-2">Speech Recognition Not Available</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your browser doesn't support the Web Speech API.
          Please use <strong className="text-white">Google Chrome</strong> or{' '}
          <strong className="text-white">Microsoft Edge</strong> for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Reference text card ── */}
      <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
        <button
          onClick={() => setTextExpanded(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left
                     hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              📄 Practice Text
            </span>
            <span className="text-xs text-slate-600">(read this aloud)</span>
          </div>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-200
                        ${textExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {textExpanded && (
          <div className="px-4 pb-4 border-t border-white/5">
            <p className="text-sm text-slate-200 leading-loose mt-3 whitespace-pre-wrap">
              {targetText}
            </p>
          </div>
        )}
      </div>

      {/* Mic button + timer */}
      <div className="flex flex-col items-center gap-4 py-4">
        {/* Pulse ring */}
        <div className="relative flex items-center justify-center">
          {isRecording && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 pulse-ring" />
              <div className="absolute w-20 h-20 rounded-full bg-rose-500/30 pulse-ring"
                   style={{ animationDelay: '0.3s' }} />
            </>
          )}
          <button
            onClick={isRecording ? onStop : onStart}
            className={`
              relative z-10 w-16 h-16 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-offset-background
              ${isRecording
                ? 'bg-rose-600 hover:bg-rose-500 focus:ring-rose-500 shadow-rose-900/50'
                : 'bg-violet-600 hover:bg-violet-500 focus:ring-violet-500 shadow-violet-900/50 hover:scale-105'}
            `}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              /* Stop icon */
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              /* Mic icon — capsule body + stand + base */
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="13" rx="3" fill="currentColor" stroke="none" />
                <path d="M5 10a7 7 0 0014 0" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="8"  y1="21" x2="16" y2="21" />
              </svg>
            )}
          </button>
        </div>

        {/* Status + timer */}
        <div className="flex flex-col items-center gap-1">
          {isRecording ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-400 text-sm font-medium">Recording…</span>
              </div>
              <span className="text-2xl font-mono font-bold text-white tabular-nums">
                {formatTime(elapsedSeconds)}
              </span>
            </>
          ) : hasSpoken ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <span>✓</span>
              <span>Recording complete — {formatTime(elapsedSeconds)}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-sm">Press the mic to begin</span>
          )}
        </div>
      </div>

      {/* Live transcript area */}
      <div className="bg-surface rounded-xl border border-white/10 p-4 min-h-[120px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Live Transcript
          </span>
          {hasSpoken && (
            <span className="text-xs text-slate-500">
              {wordCount} / {targetWords} words
            </span>
          )}
        </div>

        {!hasSpoken && !interimTranscript ? (
          <p className="text-slate-600 text-sm italic">Your speech will appear here…</p>
        ) : (
          <p className="text-slate-200 text-sm leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-slate-500 italic"> {interimTranscript}</span>
            )}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {hasSpoken && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Words spoken</span>
            <span className="text-xs text-slate-400">
              {Math.min(100, Math.round((wordCount / targetWords) * 100))}%
            </span>
          </div>
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (wordCount / targetWords) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {hasSpoken && !isRecording && (
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm
                       hover:border-white/20 hover:text-white hover:bg-surface-2 transition-all"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Tip when recording is active */}
      {isRecording && (
        <div className="text-center text-xs text-slate-600 animate-pulse">
          Speak clearly… press stop when finished
        </div>
      )}
    </div>
  );
}
