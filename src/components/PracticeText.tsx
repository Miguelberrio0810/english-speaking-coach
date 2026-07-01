import { useState } from 'react';
import { type Topic, type Level } from '../data/practiceTexts';

interface Props {
  topic:    Topic;
  level:    Level;
  text:     string;
  onBack:   () => void;
  onReady:  () => void;
}

const LEVEL_BADGE: Record<Level, { label: string; cls: string }> = {
  beginner:     { label: 'Beginner',     cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  intermediate: { label: 'Intermediate', cls: 'bg-amber-500/20  text-amber-400  border border-amber-500/30'  },
  advanced:     { label: 'Advanced',     cls: 'bg-rose-500/20   text-rose-400   border border-rose-500/30'   },
};

export function PracticeText({ topic, level, text, onBack, onReady }: Props) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const fontClass = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' }[fontSize];
  const badge = LEVEL_BADGE[level];

  return (
    <div className="fade-in flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          title="Back to topic selection"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{topic.icon}</span>
          <span className="font-semibold text-white truncate">{topic.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-1 ${badge.cls}`}>
            {badge.label}
          </span>
        </div>

        {/* Font size controls */}
        <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-1">
          {(['sm', 'base', 'lg'] as const).map(sz => (
            <button
              key={sz}
              onClick={() => setFontSize(sz)}
              className={`w-7 h-7 rounded text-xs font-bold transition-colors
                ${fontSize === sz ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {sz === 'sm' ? 'A' : sz === 'base' ? 'A' : 'A'}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions banner */}
      <div className="flex items-start gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
        <span className="text-violet-400 mt-0.5">💡</span>
        <div className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-violet-300">How to practice:</strong> Read the text below out loud,
          naturally and clearly. Focus on{' '}
          <em className="text-violet-300">pronunciation</em>,{' '}
          <em className="text-violet-300">rhythm</em>, and{' '}
          <em className="text-violet-300">expression</em>. When ready, click{' '}
          <strong className="text-white">Start Recording</strong> and speak.
        </div>
      </div>

      {/* Practice text card */}
      <div className="bg-surface rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Practice Text
          </h2>
          <span className="text-xs text-slate-600">
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <p className={`${fontClass} text-slate-200 leading-relaxed whitespace-pre-wrap`}>
          {text}
        </p>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🐢', tip: 'Slow down — clarity matters more than speed' },
          { icon: '😮', tip: 'Open your mouth fully for clear vowel sounds' },
          { icon: '🎵', tip: 'Vary your tone to sound natural and engaged' },
        ].map(({ icon, tip }) => (
          <div key={tip} className="bg-surface rounded-xl border border-white/5 p-3 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-xs text-slate-500 leading-snug">{tip}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onReady}
        className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold
                   transition-all duration-200 shadow-lg shadow-violet-900/40
                   hover:shadow-violet-900/60 hover:-translate-y-0.5 active:translate-y-0"
      >
        🎤 Start Recording
      </button>
    </div>
  );
}
