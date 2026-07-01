import { useMemo } from 'react';

interface Props {
  targetText: string;
  spokenText: string;
}

type WordStatus = 'correct' | 'missed' | 'extra';

interface WordToken {
  word:   string;
  status: WordStatus;
}

/* ── LCS-based diff ─────────────────────────────────────────────────────── */
function normalise(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/g, '');
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normalise(a[i - 1]) === normalise(b[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function diffWords(target: string[], spoken: string[]): { targetTokens: WordToken[]; spokenTokens: WordToken[] } {
  const dp = lcs(target, spoken);
  const targetTokens: WordToken[] = [];
  const spokenTokens: WordToken[] = [];

  let i = target.length;
  let j = spoken.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalise(target[i - 1]) === normalise(spoken[j - 1])) {
      targetTokens.unshift({ word: target[i - 1], status: 'correct' });
      spokenTokens.unshift({ word: spoken[j - 1], status: 'correct' });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      spokenTokens.unshift({ word: spoken[j - 1], status: 'extra' });
      j--;
    } else {
      targetTokens.unshift({ word: target[i - 1], status: 'missed' });
      i--;
    }
  }

  return { targetTokens, spokenTokens };
}

function computeAccuracy(target: string[], spoken: string[]): number {
  if (target.length === 0) return 0;
  const dp = lcs(target, spoken);
  const matches = dp[target.length][spoken.length];
  return (matches / target.length) * 100;
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function useAccuracy(targetText: string, spokenText: string) {
  return useMemo(() => {
    const target = targetText.split(/\s+/).filter(Boolean);
    const spoken = spokenText.split(/\s+/).filter(Boolean);
    const accuracy = computeAccuracy(target, spoken);
    const { targetTokens, spokenTokens } = diffWords(target, spoken);
    const matched = targetTokens.filter(t => t.status === 'correct').length;
    const missed  = targetTokens.filter(t => t.status === 'missed').length;
    const extra   = spokenTokens.filter(t => t.status === 'extra').length;
    return { accuracy, targetTokens, spokenTokens, matched, missed, extra };
  }, [targetText, spokenText]);
}

function wordCls(status: WordStatus): string {
  switch (status) {
    case 'correct': return 'text-emerald-400';
    case 'missed':  return 'text-rose-400 line-through opacity-70';
    case 'extra':   return 'text-amber-400';
  }
}

function AccuracyRing({ pct }: { pct: number }) {
  const r   = 40;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color =
    pct >= 85 ? '#34d399'   // emerald
    : pct >= 60 ? '#fbbf24' // amber
    : '#f87171';            // rose

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a24" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
            fill="white" fontSize="16" fontWeight="bold">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export function AccuracyResult({ targetText, spokenText }: Props) {
  const { accuracy, targetTokens, spokenTokens, matched, missed, extra } =
    useAccuracy(targetText, spokenText);

  if (!spokenText.trim()) {
    return (
      <div className="bg-surface rounded-2xl border border-white/10 p-6 text-center text-slate-500 text-sm">
        No speech recorded yet.
      </div>
    );
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      {/* Score row */}
      <div className="bg-surface rounded-2xl border border-white/10 p-5 flex items-center gap-6">
        <AccuracyRing pct={accuracy} />
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Word Accuracy</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">{matched}</div>
              <div className="text-xs text-slate-500">Matched</div>
            </div>
            <div>
              <div className="text-lg font-bold text-rose-400">{missed}</div>
              <div className="text-xs text-slate-500">Missed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">{extra}</div>
              <div className="text-xs text-slate-500">Extra</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500 px-1">
        <span><span className="text-emerald-400 font-semibold">Green</span> = correct</span>
        <span><span className="text-rose-400 font-semibold line-through">Red</span> = missed</span>
        <span><span className="text-amber-400 font-semibold">Yellow</span> = extra</span>
      </div>

      {/* Target text diff */}
      <div className="bg-surface rounded-xl border border-white/10 p-4 overflow-hidden">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Target Text
        </div>
        <div className="flex flex-wrap gap-x-1 gap-y-1.5 text-sm leading-relaxed">
          {targetTokens.map((tok, i) => (
            <span key={i} className={wordCls(tok.status)}>
              {tok.word}
            </span>
          ))}
        </div>
      </div>

      {/* What you said */}
      <div className="bg-surface rounded-xl border border-white/10 p-4 overflow-hidden">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          What You Said
        </div>
        <div className="flex flex-wrap gap-x-1 gap-y-1.5 text-sm leading-relaxed">
          {spokenTokens.map((tok, i) => (
            <span key={i} className={wordCls(tok.status)}>
              {tok.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { computeAccuracy };
