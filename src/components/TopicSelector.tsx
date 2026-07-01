import { TOPICS, type Topic, type Level } from '../data/practiceTexts';

interface Props {
  selectedTopic: Topic | null;
  selectedLevel: Level;
  onSelectTopic: (topic: Topic) => void;
  onSelectLevel: (level: Level) => void;
  onStart:       () => void;
}

const LEVELS: { value: Level; label: string; desc: string; color: string }[] = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Simple sentences, common words',       color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Longer phrases, natural expressions',  color: 'text-amber-400  border-amber-400/40  bg-amber-400/10'  },
  { value: 'advanced',     label: 'Advanced',     desc: 'Complex sentences, formal language',   color: 'text-rose-400   border-rose-400/40   bg-rose-400/10'   },
];

export function TopicSelector({
  selectedTopic,
  selectedLevel,
  onSelectTopic,
  onSelectLevel,
  onStart,
}: Props) {
  return (
    <div className="fade-in flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          🎙️ English Speaking Coach
        </h1>
        <p className="text-slate-400 text-sm">
          Choose a topic and level, then read aloud and get AI feedback.
        </p>
      </div>

      {/* Level selector */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Difficulty Level
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              onClick={() => onSelectLevel(lvl.value)}
              className={`
                rounded-xl border p-3 text-left transition-all duration-200
                ${selectedLevel === lvl.value
                  ? lvl.color + ' shadow-md'
                  : 'border-white/10 bg-surface text-slate-400 hover:border-white/20 hover:bg-surface-2'}
              `}
            >
              <div className={`font-semibold text-sm mb-0.5 ${selectedLevel === lvl.value ? '' : 'text-slate-300'}`}>
                {lvl.label}
              </div>
              <div className="text-xs opacity-75 leading-snug">{lvl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Choose a Topic
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOPICS.map(topic => {
            const active = selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`
                  rounded-xl border p-4 text-left transition-all duration-200 group
                  ${active
                    ? 'border-violet-500/60 bg-violet-500/15 shadow-lg shadow-violet-900/20'
                    : 'border-white/10 bg-surface hover:border-white/20 hover:bg-surface-2'}
                `}
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <div className={`font-semibold text-sm mb-1 ${active ? 'text-violet-300' : 'text-slate-200'}`}>
                  {topic.label}
                </div>
                <div className="text-xs text-slate-500 leading-snug line-clamp-2">
                  {topic.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-center pt-2 pb-4">
        <button
          onClick={onStart}
          disabled={!selectedTopic}
          className={`
            px-8 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
            ${selectedTopic
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-900/60 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-surface-2 text-slate-600 cursor-not-allowed'}
          `}
        >
          {selectedTopic
            ? `Start Practice → ${selectedTopic.icon} ${selectedTopic.label}`
            : 'Select a topic to continue'}
        </button>
      </div>
    </div>
  );
}
