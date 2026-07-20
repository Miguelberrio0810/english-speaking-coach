import type { Skill, CEFRLevel } from '../src/data/activities';

export const config = { runtime: 'edge' };

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const CEFR_VALUES: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const SKILLS: Skill[] = ['speaking', 'listening', 'reading', 'writing'];

interface RequestBody {
  skill:        Skill;
  level:        CEFRLevel;
  recentTopics?: string[];
}

interface GeneratedActivity {
  icon:        string;
  theme:       string;
  title:       string;
  text:        string;
  questions?:   string[];
  wordTarget?:  { min: number; max: number };
  topic:       string;
}

const SKILL_INSTRUCTIONS: Record<Skill, string> = {
  speaking: `Write a monologue passage in "text" for the student to read aloud (first-person, natural spoken English). Do not include "questions" or "wordTarget".`,
  listening: `Write a monologue passage in "text" that will be read aloud by text-to-speech for the student to transcribe (first-person or narrative, natural spoken English). Do not include "questions" or "wordTarget".`,
  reading: `Write a short passage in "text" and 3-4 comprehension questions in "questions" (an array of strings) that can be answered from the passage. Do not include "wordTarget".`,
  writing: `Write a short writing task instruction in "text" (what the student should write about, 1-3 sentences of instructions) and a "wordTarget" object with "min"/"max" word counts appropriate for the level. Do not include "questions".`,
};

const LEVEL_GUIDE: Record<CEFRLevel, string> = {
  A1: 'very simple vocabulary, present tense, ~60-90 words',
  A2: 'simple vocabulary, past/present tense, everyday topics, ~90-120 words',
  B1: 'connected sentences, opinions, some complex ideas, ~120-160 words',
  B2: 'abstract topics, sophisticated vocabulary, ~150-200 words',
  C1: 'academic/nuanced vocabulary, complex argumentation, ~180-260 words',
};

function isCEFR(v: unknown): v is CEFRLevel {
  return typeof v === 'string' && (CEFR_VALUES as string[]).includes(v);
}
function isSkill(v: unknown): v is Skill {
  return typeof v === 'string' && (SKILLS as string[]).includes(v);
}

function parseActivity(text: string): GeneratedActivity | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const o = parsed as Record<string, unknown>;

  if (
    typeof o.icon !== 'string' ||
    typeof o.theme !== 'string' ||
    typeof o.title !== 'string' ||
    typeof o.text !== 'string' ||
    typeof o.topic !== 'string' ||
    (o.questions !== undefined && (!Array.isArray(o.questions) || !o.questions.every(q => typeof q === 'string'))) ||
    (o.wordTarget !== undefined && (
      typeof o.wordTarget !== 'object' || o.wordTarget === null ||
      typeof (o.wordTarget as Record<string, unknown>).min !== 'number' ||
      typeof (o.wordTarget as Record<string, unknown>).max !== 'number'
    ))
  ) {
    return null;
  }

  return o as unknown as GeneratedActivity;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: 'Server is missing ANTHROPIC_API_KEY.' } }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body.' } }), { status: 400 });
  }

  if (!isSkill(body.skill) || !isCEFR(body.level)) {
    return new Response(JSON.stringify({ error: { message: 'Invalid skill or level.' } }), { status: 400 });
  }

  const recentTopics = (body.recentTopics ?? []).slice(0, 30);

  const systemPrompt = `You are an English learning content writer creating one new practice activity for a ${body.level} CEFR level student, for the "${body.skill}" skill.

## Fixed evaluation target — do not deviate
Target CEFR level ${body.level}: ${LEVEL_GUIDE[body.level]}.
${SKILL_INSTRUCTIONS[body.skill]}

## Variable content — must be fresh
Pick an everyday topic/theme the student hasn't practiced recently. Do NOT reuse any of these recent topics:
${recentTopics.length ? recentTopics.map(t => `- ${t}`).join('\n') : '(none yet)'}

## Output
Respond with ONLY a single JSON object, no prose before or after:
{
  "icon": "one relevant emoji",
  "theme": "short theme name, e.g. 'Cooking'",
  "title": "short activity title",
  "text": "...",
  "questions": ["..."] ,
  "wordTarget": { "min": 0, "max": 0 },
  "topic": "short topic tag (2-3 words) for future anti-repetition"
}
Only include "questions" for reading activities and "wordTarget" for writing activities — omit both fields entirely for speaking/listening.`;

  const anthropicRes = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:       MODEL,
      max_tokens:  1200,
      stream:      false,
      temperature: 1,
      system:      systemPrompt,
      messages:    [{ role: 'user', content: `Generate a new ${body.skill} activity now. Random seed: ${crypto.randomUUID()}.` }],
    }),
  });

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.json().catch(() => ({}));
    return new Response(JSON.stringify(errBody), {
      status: anthropicRes.status,
      headers: { 'content-type': 'application/json' },
    });
  }

  const data = await anthropicRes.json() as { content?: { type: string; text?: string }[] };
  const text = data.content?.find(b => b.type === 'text')?.text ?? '';
  const activity = parseActivity(text);

  if (!activity) {
    return new Response(
      JSON.stringify({ error: { message: 'Could not generate a valid activity from the model.' } }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(activity), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
