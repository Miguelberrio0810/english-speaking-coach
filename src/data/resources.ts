import { type Skill } from './activities';

export interface Resource {
  skill:       Skill;
  title:       string;
  url:         string;
  description: string;
}

// Static, curated, homepage-level links only (no deep links) to avoid link-rot
// or AI-hallucinated URLs — the AI only generates the "why", never the "where".
export const RESOURCES: Resource[] = [
  {
    skill: 'speaking', title: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    description: 'Pronunciation videos and everyday-conversation practice.',
  },
  {
    skill: 'speaking', title: 'ELSA Speak',
    url: 'https://elsaspeak.com/',
    description: 'AI-driven pronunciation drills with instant feedback.',
  },
  {
    skill: 'speaking', title: 'British Council — LearnEnglish',
    url: 'https://learnenglish.britishcouncil.org/',
    description: 'Speaking practice activities organized by CEFR level.',
  },

  {
    skill: 'listening', title: 'VOA Learning English',
    url: 'https://learningenglish.voanews.com/',
    description: 'News and stories recorded at a slower, clearer pace.',
  },
  {
    skill: 'listening', title: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    description: '6 Minute English and other short listening episodes.',
  },
  {
    skill: 'listening', title: 'TED Talks',
    url: 'https://www.ted.com/',
    description: 'Real-world speech at natural speed, with subtitles.',
  },

  {
    skill: 'reading', title: 'British Council — LearnEnglish',
    url: 'https://learnenglish.britishcouncil.org/',
    description: 'Graded reading passages with comprehension questions.',
  },
  {
    skill: 'reading', title: 'VOA Learning English',
    url: 'https://learningenglish.voanews.com/',
    description: 'Short articles written in simplified English.',
  },
  {
    skill: 'reading', title: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    description: 'News and vocabulary articles for reading practice.',
  },

  {
    skill: 'writing', title: 'Cambridge — Write & Improve',
    url: 'https://writeandimprove.com/',
    description: 'Free tool that scores your writing and suggests corrections.',
  },
  {
    skill: 'writing', title: 'Grammarly Blog',
    url: 'https://www.grammarly.com/blog',
    description: 'Grammar rules and writing-style guidance.',
  },
  {
    skill: 'writing', title: 'British Council — LearnEnglish',
    url: 'https://learnenglish.britishcouncil.org/',
    description: 'Writing prompts and model answers by CEFR level.',
  },
];

export function getResourcesForSkill(skill: Skill): Resource[] {
  return RESOURCES.filter(r => r.skill === skill);
}
