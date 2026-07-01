import { useState } from 'react';
import { type Skill, type CEFRLevel } from '../data/activities';

export interface SessionEntry {
  id:              string;
  skill:           Skill;
  topicIcon:       string;
  topicLabel:      string;
  level:           CEFRLevel;
  accuracy?:       number;
  wordCount:       number;
  duration:        number;
  timestamp:       number;
  feedbackExcerpt?: string;
  corrections?:    string[];
}

interface Props {
  sessions: SessionEntry[];
  onClear:  () => void;
}

const SKILL_META: Record<Skill, { label: string; icon: string; color: string; bg: string; border: string }> = {
  speaking:  { label: 'Speaking',  icon: '🎙️', color: 'text-violet-400', bg: 'bg-violet-500/15',  border: 'border-violet-500/30' },
  listening: { label: 'Listening', icon: '🎧', color: 'text-amber-400',  bg: 'bg-amber-500/15',   border: 'border-amber-500/30'  },
  reading:   { label: 'Reading',   icon: '📖', color: 'text-sky-400',    bg: 'bg-sky-500/15',     border: 'border-sky-500/30'    },
  writing:   { label: 'Writing',   icon: '✍️', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30'},
};

const CEFR_BADGE: Record<CEFRLevel, string> = {
  A1: 'bg-slate-600/50    text-slate-300   border-slate-500/30',
  A2: 'bg-emerald-500/15  text-emerald-400 border-emerald-500/30',
  B1: 'bg-sky-500/15      text-sky-400     border-sky-500/30',
  B2: 'bg-violet-500/15   text-violet-400  border-violet-500/30',
  C1: 'bg-rose-500/15     text-rose-400    border-rose-500/30',
};

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatRelative(ts: number): string {
  const diff  = Date.now() - ts;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function SmallAccuracyRing({ pct }: { pct: number }) {
  const r    = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 85 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171';

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#1a1a2e" strokeWidth="5" />
      <circle
        cx="20" cy="20" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="20" y="20" textAnchor="middle" dominantBaseline="central"
            fill="white" fontSize="9" fontWeight="bold">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function SessionCard({ s }: { s: SessionEntry }) {
  const [expanded, setExpanded] = useState(false);
  const meta = SKILL_META[s.skill];
  const hasAccuracy = s.accuracy !== undefined && (s.skill === 'speaking' || s.skill === 'listening');

  return (
    <div className="bg-surface rounded-xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/15">
      <div className="px-4 py-3 flex items-start gap-3">
        {/* Skill + topic icon */}
        <div className="relative shrink-0 mt-0.5">
          <span className="text-lg">{s.topicIcon}</span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-sm font-medium text-slate-200 truncate">{s.topicLabel}</span>
            {/* Skill badge */}
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${meta.bg} ${meta.border} ${meta.color}`}>
              {meta.icon} {meta.label}
            </span>
            {/* CEFR badge */}
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${CEFR_BADGE[s.level]}`}>
              {s.level}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>🕐 {formatDuration(s.duration)}</span>
            <span>📝 {s.wordCount} words</span>
            <span>{formatRelative(s.timestamp)}</span>
          </div>

          {/* Feedback excerpt */}
          {s.feedbackExcerpt && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed italic">
              {s.feedbackExcerpt}
            </p>
          )}

          {/* Corrections toggle */}
          {s.corrections && s.corrections.length > 0 && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-1.5 underline underline-offset-2"
            >
              {expanded ? '▲ Hide corrections' : `▼ ${s.corrections.length} correction${s.corrections.length !== 1 ? 's' : ''}`}
            </button>
          )}

          {expanded && s.corrections && s.corrections.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {s.corrections.map((c, i) => (
                <li key={i} className="text-xs text-rose-300 bg-rose-500/10 rounded px-2 py-1">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Accuracy ring (speaking / listening) */}
        {hasAccuracy && s.accuracy !== undefined && (
          <SmallAccuracyRing pct={s.accuracy} />
        )}
      </div>
    </div>
  );
}

const ALL_SKILLS: (Skill | 'all')[] = ['all', 'speaking', 'listening', 'reading', 'writing'];
const FILTER_LABELS: Record<Skill | 'all', string> = {
  all:       'All',
  speaking:  '🎙️ Speaking',
  listening: '🎧 Listening',
  reading:   '📖 Reading',
  writing:   '✍️ Writing',
};

export function SessionHistory({ sessions, onClear }: Props) {
  const [filter, setFilter]     = useState<Skill | 'all'>('all');
  const [showAll, setShowAll]   = useState(false);

  if (sessions.length === 0) return null;

  const filtered  = filter === 'all' ? sessions : sessions.filter(s => s.skill === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 5);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Session History
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-600 hover:text-rose-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Skill filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ALL_SKILLS.map(sk => (
          <button
            key={sk}
            onClick={() => { setFilter(sk); setShowAll(false); }}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all
              ${filter === sk
                ? sk === 'all'
                  ? 'bg-slate-600/50 border-slate-500/50 text-slate-200'
                  : `${SKILL_META[sk as Skill].bg} ${SKILL_META[sk as Skill].border} ${SKILL_META[sk as Skill].color}`
                : 'border-white/10 bg-surface text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
          >
            {FILTER_LABELS[sk]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {displayed.map(s => <SessionCard key={s.id} s={s} />)}
      </div>

      {filtered.length > 5 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-3 w-full py-2 rounded-lg border border-white/10 text-xs text-slate-500
                     hover:text-slate-300 hover:border-white/20 transition-all"
        >
          {showAll ? '▲ Show fewer' : `▼ Show ${filtered.length - 5} more`}
        </button>
      )}

      {displayed.length === 0 && (
        <div className="text-center text-slate-600 text-sm py-4">
          No sessions found for this filter.
        </div>
      )}
    </div>
  );
}
