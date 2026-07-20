import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Skill } from '../data/activities';
import { type UserProfile } from '../lib/profile';
import { type SessionEntry } from './SessionHistory';
import { getResourcesForSkill } from '../data/resources';

interface Props {
  profile:         UserProfile | null;
  history:         SessionEntry[];
  onProfileUpdate: (profile: UserProfile) => void;
  onRetakeQuiz:    () => void;
}

const SKILL_ICON: Record<Skill, string> = {
  speaking: '🎙️', listening: '🎧', reading: '📖', writing: '✍️',
};

export function RecommendationsPanel({ profile, history, onProfileUpdate, onRetakeQuiz }: Props) {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  if (!profile) {
    return (
      <div className="fade-in bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4">
        <span className="text-2xl">🧭</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-0.5">{t('recommendations.findLevel')}</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('recommendations.findLevelBody')}
          </p>
        </div>
        <button
          onClick={onRetakeQuiz}
          className="shrink-0 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
        >
          {t('recommendations.startButton')}
        </button>
      </div>
    );
  }

  async function handleRefresh() {
    if (!profile) return;
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'refresh',
          skillLevels: profile.skillLevels,
          recentSessions: history.slice(0, 10).map(s => ({
            skill: s.skill, level: s.level, accuracy: s.accuracy, timestamp: s.timestamp,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Request failed (${res.status})`);
      }

      const data = await res.json() as Omit<UserProfile, 'quizTakenAt'>;
      onProfileUpdate({ ...data, quizTakenAt: profile.quizTakenAt });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('recommendations.refreshError'));
    } finally {
      setRefreshing(false);
    }
  }

  const resources = getResourcesForSkill(profile.weakestSkill).slice(0, 3);

  return (
    <div className="fade-in bg-surface rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-rose-400">🎯</span>
          <h2 className="text-sm font-semibold text-slate-200">
            {t('recommendations.focus', { skill: `${SKILL_ICON[profile.weakestSkill]} ${t(`skills.${profile.weakestSkill}.label`)}` })}
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-400">
          {t('recommendations.overallLevel', { level: profile.overallLevel })}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">{profile.summary}</p>

      <ul className="flex flex-col gap-1.5">
        {profile.tips.map((tip, i) => (
          <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
            <span className="text-violet-400 shrink-0">•</span>{tip}
          </li>
        ))}
      </ul>

      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {resources.map(r => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              title={r.description}
              className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-surface-2 text-slate-400
                         hover:text-violet-300 hover:border-violet-500/40 transition-colors"
            >
              {r.title} →
            </a>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="flex items-center gap-3 pt-1 border-t border-white/5 mt-1">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-xs text-slate-500 hover:text-violet-400 transition-colors disabled:opacity-50"
        >
          {refreshing ? t('recommendations.refreshing') : t('recommendations.refresh')}
        </button>
        <button
          onClick={onRetakeQuiz}
          className="text-xs text-slate-500 hover:text-violet-400 transition-colors ml-auto"
        >
          {t('recommendations.retakeQuiz')}
        </button>
      </div>
    </div>
  );
}
