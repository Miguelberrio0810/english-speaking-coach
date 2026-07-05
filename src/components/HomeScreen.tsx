import { useState } from 'react';
import { type Skill, type CEFRLevel, type Activity, getActivities, CEFR_LEVELS } from '../data/activities';
import { type UserProfile } from '../lib/profile';
import { type SessionEntry } from './SessionHistory';
import { RecommendationsPanel } from './RecommendationsPanel';

interface Props {
  onStart:         (activity: Activity) => void;
  profile:         UserProfile | null;
  history:         SessionEntry[];
  onProfileUpdate: (profile: UserProfile) => void;
  onRetakeQuiz:    () => void;
}

interface SkillMeta {
  skill:   Skill;
  icon:    string;
  label:   string;
  desc:    string;
  color:   string;
  bg:      string;
  border:  string;
  ring:    string;
}

const SKILLS: SkillMeta[] = [
  {
    skill:  'speaking',
    icon:   '🎙️',
    label:  'Speaking',
    desc:   'Read text aloud and get pronunciation feedback',
    color:  'text-violet-400',
    bg:     'bg-violet-500/10',
    border: 'border-violet-500/30',
    ring:   'ring-violet-500/40',
  },
  {
    skill:  'listening',
    icon:   '🎧',
    label:  'Listening',
    desc:   'Listen and type what you hear — dictation challenge',
    color:  'text-amber-400',
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/30',
    ring:   'ring-amber-500/40',
  },
  {
    skill:  'reading',
    icon:   '📖',
    label:  'Reading',
    desc:   'Read a passage and answer comprehension questions',
    color:  'text-sky-400',
    bg:     'bg-sky-500/10',
    border: 'border-sky-500/30',
    ring:   'ring-sky-500/40',
  },
  {
    skill:  'writing',
    icon:   '✍️',
    label:  'Writing',
    desc:   'Respond to a prompt and get grammar & CEFR feedback',
    color:  'text-emerald-400',
    bg:     'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    ring:   'ring-emerald-500/40',
  },
];

const CEFR_BADGE: Record<CEFRLevel, string> = {
  A1: 'bg-slate-600/50    text-slate-300   border-slate-500/30',
  A2: 'bg-emerald-500/15  text-emerald-400 border-emerald-500/30',
  B1: 'bg-sky-500/15      text-sky-400     border-sky-500/30',
  B2: 'bg-violet-500/15   text-violet-400  border-violet-500/30',
  C1: 'bg-rose-500/15     text-rose-400    border-rose-500/30',
};

export function HomeScreen({ onStart, profile, history, onProfileUpdate, onRetakeQuiz }: Props) {
  const [selectedSkill,    setSelectedSkill]    = useState<Skill | null>(null);
  const [selectedLevel,    setSelectedLevel]    = useState<CEFRLevel | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const skillMeta = selectedSkill ? SKILLS.find(s => s.skill === selectedSkill) : null;
  const activities = selectedSkill && selectedLevel
    ? getActivities(selectedSkill, selectedLevel)
    : [];

  function handleSkillClick(skill: Skill) {
    setSelectedSkill(skill);
    setSelectedLevel(profile?.skillLevels[skill] ?? null);
    setSelectedActivity(null);
  }

  function handleLevelClick(level: CEFRLevel) {
    setSelectedLevel(level);
    setSelectedActivity(null);
  }

  function handleActivityClick(activity: Activity) {
    setSelectedActivity(prev => prev?.id === activity.id ? null : activity);
  }

  function handleStart() {
    if (selectedActivity) onStart(selectedActivity);
  }

  return (
    <div className="fade-in flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        bg-violet-500/15 border border-violet-500/20 mb-4">
          <span className="text-2xl">🇬🇧</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          English Coach
        </h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Four skills. Five CEFR levels. Real AI feedback.
        </p>
      </div>

      <RecommendationsPanel
        profile={profile}
        history={history}
        onProfileUpdate={onProfileUpdate}
        onRetakeQuiz={onRetakeQuiz}
      />

      {/* ── Skill cards ── */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Choose a Skill
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SKILLS.map(s => {
            const active = selectedSkill === s.skill;
            return (
              <button
                key={s.skill}
                onClick={() => handleSkillClick(s.skill)}
                className={`
                  relative rounded-2xl border p-4 text-left transition-all duration-200
                  ${active
                    ? `${s.bg} ${s.border} ring-1 ${s.ring} shadow-lg`
                    : 'bg-surface border-white/10 hover:border-white/20 hover:bg-surface-2'}
                `}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`font-semibold text-sm mb-1 ${active ? s.color : 'text-slate-200'}`}>
                  {s.label}
                </div>
                <div className="text-xs text-slate-500 leading-snug">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CEFR Level picker (shown after skill) ── */}
      {selectedSkill && (
        <div className="fade-in">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Choose Your Level
          </h2>
          <div className="flex flex-wrap gap-2">
            {CEFR_LEVELS.map(lvl => {
              const active = selectedLevel === lvl.value;
              return (
                <button
                  key={lvl.value}
                  onClick={() => handleLevelClick(lvl.value)}
                  title={lvl.desc}
                  className={`
                    px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200
                    ${active
                      ? CEFR_BADGE[lvl.value] + ' shadow-sm'
                      : 'border-white/10 bg-surface text-slate-400 hover:border-white/25 hover:text-slate-200'}
                  `}
                >
                  {lvl.value}
                </button>
              );
            })}
          </div>
          {selectedLevel && (
            <p className="text-xs text-slate-500 mt-2">
              {CEFR_LEVELS.find(l => l.value === selectedLevel)?.desc}
            </p>
          )}
        </div>
      )}

      {/* ── Activity grid ── */}
      {activities.length > 0 && skillMeta && (
        <div className="fade-in">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Choose an Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activities.map(act => {
              const active = selectedActivity?.id === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => handleActivityClick(act)}
                  className={`
                    rounded-2xl border p-4 text-left transition-all duration-200
                    ${active
                      ? `${skillMeta.bg} ${skillMeta.border} ring-1 ${skillMeta.ring}`
                      : 'bg-surface border-white/10 hover:border-white/20 hover:bg-surface-2'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{act.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm mb-0.5 ${active ? skillMeta.color : 'text-slate-200'}`}>
                        {act.title}
                      </div>
                      <div className="text-xs text-slate-500">{act.theme}</div>
                      <div className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                        {act.text.slice(0, 80)}…
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Start button ── */}
      {selectedActivity && skillMeta && (
        <div className="fade-in pb-4">
          <button
            onClick={handleStart}
            className={`
              w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
              shadow-lg hover:-translate-y-0.5 active:translate-y-0
              ${selectedSkill === 'speaking'  ? 'bg-violet-600  hover:bg-violet-500  shadow-violet-900/40' : ''}
              ${selectedSkill === 'listening' ? 'bg-amber-600   hover:bg-amber-500   shadow-amber-900/40'  : ''}
              ${selectedSkill === 'reading'   ? 'bg-sky-600     hover:bg-sky-500     shadow-sky-900/40'    : ''}
              ${selectedSkill === 'writing'   ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40': ''}
            `}
          >
            {skillMeta.icon} Start {skillMeta.label} — {selectedActivity.title}
          </button>
        </div>
      )}
    </div>
  );
}
