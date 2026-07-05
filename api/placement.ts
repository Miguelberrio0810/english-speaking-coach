import type { Skill, CEFRLevel } from '../src/data/activities';

export const config = { runtime: 'edge' };

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const CEFR_VALUES: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const SKILLS: Skill[] = ['speaking', 'listening', 'reading', 'writing'];

interface QuizRequest {
  mode: 'quiz';
  mcqStats: { reading: number; listening: number; grammar: number };
  writingSample: { prompt: string; text: string };
  speakingSample: { targetText: string; spokenText: string; accuracy: number };
}

interface RefreshRequest {
  mode: 'refresh';
  skillLevels: Record<Skill, CEFRLevel>;
  recentSessions: { skill: Skill; level: CEFRLevel; accuracy?: number; timestamp: number }[];
}

type PlacementRequest = QuizRequest | RefreshRequest;

export interface PlacementResult {
  skillLevels:  Record<Skill, CEFRLevel>;
  overallLevel: CEFRLevel;
  weakestSkill: Skill;
  tips:         string[];
  summary:      string;
}

const SYSTEM_PROMPT = `You are a CEFR English placement examiner. Given evidence about a student's performance, estimate their CEFR level (A1, A2, B1, B2, or C1) for each of the four skills (speaking, listening, reading, writing), pick their single weakest skill, and give 3-5 short, specific, actionable tips to improve that weakest skill.

Respond with ONLY a single JSON object, no prose before or after, exactly matching this shape:
{
  "skillLevels": { "speaking": "A1|A2|B1|B2|C1", "listening": "...", "reading": "...", "writing": "..." },
  "overallLevel": "A1|A2|B1|B2|C1",
  "weakestSkill": "speaking|listening|reading|writing",
  "tips": ["...", "..."],
  "summary": "one or two sentence overall assessment"
}`;

function buildQuizPrompt(p: QuizRequest): string {
  return `
## Multiple-Choice Results (auto-graded, percent correct)
- Reading comprehension: ${p.mcqStats.reading.toFixed(0)}%
- Listening comprehension: ${p.mcqStats.listening.toFixed(0)}%
- Grammar/vocabulary: ${p.mcqStats.grammar.toFixed(0)}%

## Writing Sample
Prompt: ${p.writingSample.prompt}
Student wrote:
${p.writingSample.text || '*(nothing written)*'}

## Speaking Sample
Target text: ${p.speakingSample.targetText}
What the student actually said (speech-to-text transcript): ${p.speakingSample.spokenText || '*(nothing recorded)*'}
Word accuracy vs target: ${p.speakingSample.accuracy.toFixed(1)}%

Estimate this student's CEFR level per skill based on all the evidence above.
`.trim();
}

function buildRefreshPrompt(p: RefreshRequest): string {
  const history = p.recentSessions
    .map(s => `- ${s.skill} (${s.level})${s.accuracy !== undefined ? `, accuracy ${s.accuracy.toFixed(0)}%` : ''}, ${new Date(s.timestamp).toISOString().slice(0, 10)}`)
    .join('\n') || '*(no recent sessions)*';

  return `
## Current Estimated Levels
${SKILLS.map(sk => `- ${sk}: ${p.skillLevels[sk]}`).join('\n')}

## Recent Practice Sessions
${history}

Based on this recent activity, keep or adjust the per-skill CEFR levels, confirm or update the weakest skill, and give fresh, specific tips for that weakest skill. Do not invent evidence beyond what's listed above.
`.trim();
}

function isCEFR(v: unknown): v is CEFRLevel {
  return typeof v === 'string' && (CEFR_VALUES as string[]).includes(v);
}

function isSkill(v: unknown): v is Skill {
  return typeof v === 'string' && (SKILLS as string[]).includes(v);
}

function parseResult(text: string): PlacementResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  const skillLevels = obj.skillLevels as Record<string, unknown> | undefined;

  if (
    !skillLevels ||
    !SKILLS.every(sk => isCEFR(skillLevels[sk])) ||
    !isCEFR(obj.overallLevel) ||
    !isSkill(obj.weakestSkill) ||
    !Array.isArray(obj.tips) ||
    !obj.tips.every(t => typeof t === 'string') ||
    typeof obj.summary !== 'string'
  ) {
    return null;
  }

  return {
    skillLevels: skillLevels as Record<Skill, CEFRLevel>,
    overallLevel: obj.overallLevel,
    weakestSkill: obj.weakestSkill,
    tips: obj.tips as string[],
    summary: obj.summary,
  };
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

  let body: PlacementRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body.' } }), { status: 400 });
  }

  const userPrompt = body.mode === 'quiz' ? buildQuizPrompt(body) : buildRefreshPrompt(body);

  const anthropicRes = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 800,
      stream:     false,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userPrompt }],
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
  const result = parseResult(text);

  if (!result) {
    return new Response(
      JSON.stringify({ error: { message: 'Could not parse a valid placement result from the model.' } }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
