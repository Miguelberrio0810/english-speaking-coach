import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Skill } from '../../data/activities';

interface SkillCardData {
  title:       string;
  description: string;
  image:       string;
}

const SKILL_ORDER: Skill[] = ['speaking', 'listening', 'reading', 'writing'];

const skillCardData: Record<Skill, SkillCardData> = {
  speaking: {
    title:       'Speaking',
    description: 'Read text aloud and get pronunciation feedback',
    image:       'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
  },
  listening: {
    title:       'Listening',
    description: 'Listen and type what you hear — dictation challenge',
    image:       'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  },
  reading: {
    title:       'Reading',
    description: 'Read a passage and answer comprehension questions',
    image:       'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop',
  },
  writing: {
    title:       'Writing',
    description: 'Respond to a prompt and get grammar & CEFR feedback',
    image:       'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
  },
};

interface StackCard {
  id:    number;
  skill: Skill;
}

const initialCards: StackCard[] = SKILL_ORDER.map((skill, i) => ({ id: i + 1, skill }));

const positionStyles = [
  { scale: 1,    y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9,  y: -44 },
];

const exitAnimation = { y: 340, scale: 1, zIndex: 10 };
const enterAnimation = { y: -16, scale: 0.9 };

function CardContent({ skill, onPractice }: { skill: Skill; onPractice?: (skill: Skill) => void }) {
  const data = skillCardData[skill];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-white/10">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">{data.title}</span>
          <span className="text-muted-foreground">{data.description}</span>
        </div>
        <button
          onClick={() => onPractice?.(skill)}
          className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-foreground pl-4 pr-3 text-sm font-medium text-background"
        >
          Practice
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          >
            <path d="M9.5 18L15.5 12L9.5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AnimatedCard({
  card,
  index,
  isAnimating,
  onPractice,
}: {
  card:         StackCard;
  index:        number;
  isAnimating:  boolean;
  onPractice?:  (skill: Skill) => void;
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index;

  const exitAnim = index === 0 ? exitAnimation : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: 'spring',
        duration: 1,
        bounce: 0,
      }}
      style={{
        zIndex,
        left: '50%',
        x: '-50%',
        bottom: 0,
      }}
      className="absolute flex h-[280px] w-full max-w-[512px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform"
    >
      <CardContent skill={card.skill} onPractice={index === 0 ? onPractice : undefined} />
    </motion.div>
  );
}

interface AnimatedCardStackProps {
  /** Fired when the user taps "Practice" on the front card. */
  onSelectSkill?: (skill: Skill) => void;
}

export default function AnimatedCardStack({ onSelectSkill }: AnimatedCardStackProps) {
  const [cards, setCards] = useState(initialCards);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextId, setNextId] = useState(initialCards.length + 1);

  const handleNext = () => {
    setIsAnimating(true);

    const lastSkill = cards[cards.length - 1].skill;
    const nextSkill = SKILL_ORDER[(SKILL_ORDER.indexOf(lastSkill) + 1) % SKILL_ORDER.length];

    setCards([...cards.slice(1), { id: nextId, skill: nextSkill }]);
    setNextId(prev => prev + 1);
    setIsAnimating(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      <div className="relative h-[380px] w-full max-w-[644px] overflow-hidden">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard
              key={card.id}
              card={card}
              index={index}
              isAnimating={isAnimating}
              onPractice={onSelectSkill}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-border py-4">
        <button
          onClick={handleNext}
          className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-background px-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
        >
          Next Skill
        </button>
      </div>
    </div>
  );
}
