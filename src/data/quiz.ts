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

// The quiz content itself (questions, writing prompt, speaking passage) is
// generated per-attempt by /api/generate-quiz so it varies every time —
// see src/components/PlacementQuiz.tsx.
