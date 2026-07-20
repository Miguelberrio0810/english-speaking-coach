export const config = { runtime: 'edge' };

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
type QuizSkill = 'reading' | 'listening' | 'grammar';

const CEFR_VALUES: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const QUIZ_SKILLS: QuizSkill[] = ['reading', 'listening', 'grammar'];

interface QuizQuestion {
  id:           string;
  skill:        QuizSkill;
  level:        CEFRLevel;
  prompt:       string;
  audioText?:   string;
  question:     string;
  options:      string[];
  correctIndex: number;
}

interface GeneratedQuiz {
  questions:      QuizQuestion[];
  writingPrompt:  string;
  speakingPassage: string;
  topics:         string[];
}

interface RequestBody {
  recentTopics?: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// FIXED evaluation criteria (never changes between attempts, so results
// stay comparable): 5 CEFR levels × 3 categories = 15 MCQs, one writing
// task, one speaking passage, same difficulty ladder every time.
//
// VARIABLE content (must change every attempt): topics, vocabulary,
// sentence subjects. The model is given recently-used topics and told not
// to repeat them.
// ─────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a CEFR English placement exam item writer. Generate a brand-new English placement quiz.

## Fixed evaluation structure — do not deviate
Produce exactly 15 multiple-choice questions: one reading, one grammar, and one listening question at EACH of the 5 CEFR levels (A1, A2, B1, B2, C1). Each level's questions must test the difficulty and grammar/vocabulary complexity typical of that CEFR level (e.g. A1 = simple present, basic vocabulary; C1 = inverted structures, nuanced abstract vocabulary), so that results stay consistent and comparable across different quiz attempts even though the topics differ every time.
- "reading" questions: a short passage in "prompt" (2-4 sentences for A1-A2, longer/denser for B1-C1), then a comprehension "question" with 4 "options".
- "grammar" questions: a fill-in-the-blank sentence in "prompt" (use "___" for the blank), then "question" asking to choose the correct word/form, with 4 "options".
- "listening" questions: leave "prompt" as an empty string and put the sentence to be read aloud in "audioText" instead, then a comprehension "question" with 4 "options".
Also produce one writing prompt (a short instruction asking the student to write 4-8 sentences about a topic) and one speaking passage (4-6 sentences at approximately B1 level, natural spoken English, for the student to read aloud).

## Variable content — must be fresh every time
Choose everyday topics/themes (e.g. daily routines, travel, work, hobbies, food, technology, weather) for the passages, sentences, and prompts. Vary vocabulary and sentence subjects across attempts.
${''}
## Anti-repetition
The student has recently seen quizzes about these topics — do NOT reuse any of them, pick different topics entirely:
{{RECENT_TOPICS}}

## Output
Respond with ONLY a single JSON object, no prose before or after, exactly matching this shape:
{
  "questions": [
    { "id": "q1", "skill": "reading|grammar|listening", "level": "A1|A2|B1|B2|C1", "prompt": "...", "audioText": "... (listening only, omit otherwise)", "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0 },
    ... exactly 15 items, one reading + one grammar + one listening per level ...
  ],
  "writingPrompt": "...",
  "speakingPassage": "...",
  "topics": ["short topic tag 1", "short topic tag 2", "..."]
}
"topics" should list 3-6 short tags (2-3 words each) summarizing the themes used this time, so future attempts can avoid them.`;

function isCEFR(v: unknown): v is CEFRLevel {
  return typeof v === 'string' && (CEFR_VALUES as string[]).includes(v);
}

function isQuizSkill(v: unknown): v is QuizSkill {
  return typeof v === 'string' && (QUIZ_SKILLS as string[]).includes(v);
}

function isValidQuestion(q: unknown): q is QuizQuestion {
  if (typeof q !== 'object' || q === null) return false;
  const o = q as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    isQuizSkill(o.skill) &&
    isCEFR(o.level) &&
    typeof o.prompt === 'string' &&
    (o.audioText === undefined || typeof o.audioText === 'string') &&
    typeof o.question === 'string' &&
    Array.isArray(o.options) && o.options.length === 4 && o.options.every(x => typeof x === 'string') &&
    typeof o.correctIndex === 'number' && o.correctIndex >= 0 && o.correctIndex < 4
  );
}

function parseQuiz(text: string): GeneratedQuiz | null {
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

  if (
    !Array.isArray(obj.questions) ||
    obj.questions.length !== 15 ||
    !obj.questions.every(isValidQuestion) ||
    typeof obj.writingPrompt !== 'string' ||
    typeof obj.speakingPassage !== 'string' ||
    !Array.isArray(obj.topics) ||
    !obj.topics.every(t => typeof t === 'string')
  ) {
    return null;
  }

  // Sanity check: one reading + one grammar + one listening per level.
  const byLevel = new Map<string, Set<string>>();
  for (const q of obj.questions as QuizQuestion[]) {
    if (!byLevel.has(q.level)) byLevel.set(q.level, new Set());
    byLevel.get(q.level)!.add(q.skill);
  }
  const structureOk = CEFR_VALUES.every(lvl => byLevel.get(lvl)?.size === 3);
  if (!structureOk) return null;

  return {
    questions:       obj.questions as QuizQuestion[],
    writingPrompt:   obj.writingPrompt,
    speakingPassage: obj.speakingPassage,
    topics:          obj.topics as string[],
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

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const recentTopics = (body.recentTopics ?? []).slice(0, 30);
  const systemPrompt = SYSTEM_PROMPT.replace(
    '{{RECENT_TOPICS}}',
    recentTopics.length ? recentTopics.map(t => `- ${t}`).join('\n') : '(none yet — this is the student\'s first attempt)',
  );

  // Nudge sampling variety across back-to-back requests with the same prompt.
  const userNudge = `Generate a new quiz now. Random seed: ${crypto.randomUUID()}.`;

  const anthropicRes = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:       MODEL,
      max_tokens:  4000,
      stream:      false,
      temperature: 1,
      system:      systemPrompt,
      messages:    [{ role: 'user', content: userNudge }],
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
  const quiz = parseQuiz(text);

  if (!quiz) {
    return new Response(
      JSON.stringify({ error: { message: 'Could not generate a valid quiz from the model.' } }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(quiz), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
