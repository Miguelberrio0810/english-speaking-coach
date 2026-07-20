import { useTranslation } from 'react-i18next';
import { type SessionEntry } from './SessionHistory';
import { computeStreak } from '../lib/streak';

interface Props {
  sessions: SessionEntry[];
}

const CHART_W = 280;
const CHART_H = 64;
const CHART_PAD = 6;

function AccuracySparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;

  const xStep = (CHART_W - CHART_PAD * 2) / (points.length - 1);
  const toY = (v: number) => CHART_H - CHART_PAD - (v / 100) * (CHART_H - CHART_PAD * 2);
  const coords = points.map((v, i) => [CHART_PAD + i * xStep, toY(v)] as const);
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0]},${CHART_H} L${coords[0][0]},${CHART_H} Z`;

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-16" preserveAspectRatio="none">
      <path d={areaPath} fill="url(#progressGradient)" opacity={0.25} />
      <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 3 : 2} fill="#8b5cf6" />
      ))}
      <defs>
        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ProgressPanel({ sessions }: Props) {
  const { t } = useTranslation();

  if (sessions.length === 0) return null;

  const { current } = computeStreak(sessions);

  // Sessions are stored newest-first; reverse to chronological order for the trend.
  const withAccuracy = sessions
    .filter((s): s is SessionEntry & { accuracy: number } => s.accuracy !== undefined)
    .slice()
    .reverse();

  const chartPoints = withAccuracy.slice(-10).map(s => s.accuracy);
  const last5 = withAccuracy.slice(-5);
  const hasTrend = last5.length >= 2;

  return (
    <div className="fade-in bg-surface rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {t('progress.title')}
        </h2>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
            ${current > 0
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'border-white/10 text-slate-500'}`}
        >
          🔥 {current > 0 ? t('streak.days', { count: current }) : t('streak.noStreak')}
        </span>
      </div>

      {hasTrend ? (
        <>
          <AccuracySparkline points={chartPoints} />
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('progress.summary', {
              from: Math.round(last5[0].accuracy),
              to: Math.round(last5[last5.length - 1].accuracy),
              count: last5.length,
            })}
          </p>
        </>
      ) : (
        <p className="text-xs text-slate-500 leading-relaxed">{t('progress.notEnoughData')}</p>
      )}
    </div>
  );
}
