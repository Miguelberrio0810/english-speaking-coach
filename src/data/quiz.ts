import { type CEFRLevel } from './activities';

export type QuizSkill = 'reading' | 'listening' | 'grammar';

export interface QuizQuestion {
  id:           string;
  skill:        QuizSkill;
  level:        CEFRLevel;
  /** For reading/grammar: the passage or fill-in-the-blank sentence shown on screen. */
  prompt:       string;
  /** For listening: the sentence spoken aloud via the Web Speech API instead of shown. */
  audioText?:   string;
  question:     string;
  options:      string[];
  correctIndex: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 15 auto-graded questions: 5 CEFR levels × 3 categories (reading, grammar, listening)
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // A1
  {
    id: 'q-re-a1', skill: 'reading', level: 'A1',
    prompt: `My name is Ana. I have a small dog. His name is Rex.`,
    question: 'What is the name of the dog?',
    options: ['Ana', 'Rex', 'Max', 'Small'],
    correctIndex: 1,
  },
  {
    id: 'q-gr-a1', skill: 'grammar', level: 'A1',
    prompt: `She ___ a teacher.`,
    question: 'Choose the correct word.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
  },
  {
    id: 'q-li-a1', skill: 'listening', level: 'A1',
    prompt: '', audioText: `I have two brothers and one sister.`,
    question: 'How many brothers does the speaker have?',
    options: ['One', 'Two', 'Three', 'None'],
    correctIndex: 1,
  },

  // A2
  {
    id: 'q-re-a2', skill: 'reading', level: 'A2',
    prompt: `Yesterday I went to the supermarket. I bought bread, milk, and eggs. Then I walked home.`,
    question: 'What did the writer NOT buy?',
    options: ['Bread', 'Milk', 'Eggs', 'Cheese'],
    correctIndex: 3,
  },
  {
    id: 'q-gr-a2', skill: 'grammar', level: 'A2',
    prompt: `Last week we ___ to the beach.`,
    question: 'Choose the correct word.',
    options: ['go', 'goes', 'went', 'going'],
    correctIndex: 2,
  },
  {
    id: 'q-li-a2', skill: 'listening', level: 'A2',
    prompt: '', audioText: `The train to the city center leaves at half past nine every morning.`,
    question: 'What time does the train leave?',
    options: ['8:30', '9:00', '9:30', '10:30'],
    correctIndex: 2,
  },

  // B1
  {
    id: 'q-re-b1', skill: 'reading', level: 'B1',
    prompt: `Although the weather was cold, we decided to go hiking because we had been planning the trip for months.`,
    question: 'Why did they go hiking despite the cold weather?',
    options: [
      'They did not notice the weather',
      'They had planned the trip for a long time',
      'The weather improved suddenly',
      'Someone forced them to go',
    ],
    correctIndex: 1,
  },
  {
    id: 'q-gr-b1', skill: 'grammar', level: 'B1',
    prompt: `By the time we arrived, the movie ___ already started.`,
    question: 'Choose the correct verb form.',
    options: ['has', 'have', 'had', 'was'],
    correctIndex: 2,
  },
  {
    id: 'q-li-b1', skill: 'listening', level: 'B1',
    prompt: '', audioText: `Even though she had never played the piano before, she managed to learn a simple song within a week thanks to daily practice.`,
    question: 'How did she learn the song so quickly?',
    options: [
      'She already knew how to play piano',
      'A teacher taught her every day',
      'She practiced every day',
      'She read a book about music',
    ],
    correctIndex: 2,
  },

  // B2
  {
    id: 'q-re-b2', skill: 'reading', level: 'B2',
    prompt: `While remote work offers flexibility, many employees report feeling isolated, suggesting that productivity gains may come at the cost of wellbeing.`,
    question: "What trade-off does the passage suggest about remote work?",
    options: [
      'It increases isolation but has no effect on productivity',
      'It may boost productivity while harming employee wellbeing',
      'It reduces flexibility but improves teamwork',
      'It has no real disadvantages',
    ],
    correctIndex: 1,
  },
  {
    id: 'q-gr-b2', skill: 'grammar', level: 'B2',
    prompt: `___ she studied harder, she would have passed the exam.`,
    question: 'Choose the correct word to complete this conditional sentence.',
    options: ['If', 'Had', 'Unless', 'When'],
    correctIndex: 1,
  },
  {
    id: 'q-li-b2', skill: 'listening', level: 'B2',
    prompt: '', audioText: `Critics argue that while the new policy was designed to reduce traffic congestion, it has inadvertently increased costs for small businesses that rely on deliveries.`,
    question: 'According to the speaker, what is an unintended effect of the policy?',
    options: [
      'It reduced traffic congestion as planned',
      'It increased costs for small businesses',
      'It had no effect on businesses',
      'It was cancelled immediately',
    ],
    correctIndex: 1,
  },

  // C1
  {
    id: 'q-re-c1', skill: 'reading', level: 'C1',
    prompt: `The proliferation of algorithmically curated content has arguably narrowed the range of perspectives individuals encounter, even as the sheer volume of accessible information has expanded exponentially.`,
    question: "What paradox does the author describe?",
    options: [
      'More information available but narrower perspectives encountered',
      'Less information available but broader perspectives encountered',
      'Algorithms have reduced the total volume of information',
      'There is no relationship between information volume and perspective',
    ],
    correctIndex: 0,
  },
  {
    id: 'q-gr-c1', skill: 'grammar', level: 'C1',
    prompt: `Rarely ___ such a compelling argument been presented to the committee.`,
    question: 'Choose the correct word for this inverted sentence structure.',
    options: ['has', 'have', 'had', 'did'],
    correctIndex: 0,
  },
  {
    id: 'q-li-c1', skill: 'listening', level: 'C1',
    prompt: '', audioText: `Notwithstanding the considerable investment in renewable infrastructure, analysts caution that without corresponding reforms to energy storage policy, the anticipated gains in grid reliability may fail to materialize.`,
    question: 'What caution do the analysts express?',
    options: [
      'Renewable investment alone may not be enough without storage policy reform',
      'Grid reliability has already improved significantly',
      'Energy storage policy has already been reformed successfully',
      'Renewable infrastructure investment was a mistake',
    ],
    correctIndex: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Writing + speaking samples used in the placement quiz
// ─────────────────────────────────────────────────────────────────────────────

export const PLACEMENT_WRITING_PROMPT =
  `Write 4-8 sentences about your typical day: what you do in the morning, during the day, and in the evening.`;

export const PLACEMENT_SPEAKING_PASSAGE =
  `Last weekend I visited a small town near the coast. The weather was sunny, so I walked along the beach for almost two hours. In the afternoon, I had lunch at a little restaurant that served fresh fish. Before heading home, I bought a few souvenirs for my family.`;
