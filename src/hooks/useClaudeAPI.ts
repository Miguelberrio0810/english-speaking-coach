import { useState, useRef, useCallback } from 'react';
import { type Skill } from '../data/activities';

export interface UseClaudeAPIReturn {
  streamingText: string;
  isStreaming:   boolean;
  error:         string | null;
  getFeedback:   (params: GetFeedbackParams) => Promise<void>;
  cancel:        () => void;
  reset:         () => void;
}

export interface GetFeedbackParams {
  skill:        Skill;
  level:        string;
  topicLabel:   string;
  practiceText: string;
  // Speaking / Listening
  spokenText?:  string;
  accuracy?:    number;
  // Listening
  listenedText?: string;
  // Reading
  passage?:     string;
  questions?:   string[];
  answers?:     string;
  // Writing
  writingPrompt?: string;
  writtenText?:   string;
}

// ── System prompts per skill ───────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<Skill, string> = {
  speaking: `You are an expert English speaking coach. Evaluate pronunciation accuracy, fluency, and word choice based on the target text versus what the student actually said. Be warm but specific. Give actionable pronunciation tips. Format your response with markdown headings.`,

  listening: `You are an expert English listening coach. The student listened to a text and transcribed what they heard. Evaluate their transcription accuracy, identify vocabulary they missed or misheard, note patterns in their errors, and give specific listening comprehension tips. Format your response with markdown headings.`,

  reading: `You are an expert English reading coach. The student read a passage and answered comprehension questions. Evaluate the quality of their understanding, their inference ability, and their vocabulary. Identify any misunderstandings and give specific reading strategy tips. Format your response with markdown headings.`,

  writing: `You are an expert English writing coach and CEFR examiner. Evaluate this written response for grammar accuracy, vocabulary range and appropriateness, coherence and cohesion, and task achievement at the given CEFR level. Identify specific corrections with examples. Be detailed and precise. Format your response with markdown headings.`,
};

// ── User prompt builders per skill ────────────────────────────────────────

function buildSpeakingPrompt(p: GetFeedbackParams): string {
  return `
## Session Details
- **Topic:** ${p.topicLabel}
- **CEFR Level:** ${p.level}
- **Word Accuracy Score:** ${p.accuracy !== undefined ? p.accuracy.toFixed(1) + '%' : 'N/A'}

## Target Text (what the student should have said)
${p.practiceText}

## Student's Speech (what the student actually said)
${p.spokenText || '*(nothing recorded)*'}

---

Please provide feedback in these sections:

### 🎯 Overall Assessment
A 2–3 sentence summary of performance.

### ✅ What You Did Well
Specific strengths — words, phrases, or patterns they got right.

### 📝 Areas to Improve
Specific words or phrases that were missing, incorrect, or unclear.

### 🗣️ Pronunciation Tips
Pronunciation patterns to practice based on the sounds in this text.

### 💡 Next Steps
One concrete exercise to improve before the next session.
`.trim();
}

function buildListeningPrompt(p: GetFeedbackParams): string {
  return `
## Session Details
- **Topic:** ${p.topicLabel}
- **CEFR Level:** ${p.level}
- **Transcription Accuracy:** ${p.accuracy !== undefined ? p.accuracy.toFixed(1) + '%' : 'N/A'}

## Original Audio Text
${p.practiceText}

## Student's Transcription (what they typed)
${p.spokenText || '*(nothing written)*'}

---

Please provide feedback in these sections:

### 🎯 Overall Assessment
How well did the student capture what they heard?

### ✅ What You Got Right
Words and phrases transcribed accurately.

### 👂 What You Missed or Misheard
Specific errors, substitutions, or omissions with explanations of why these are commonly difficult to hear.

### 🔊 Listening Strategy Tips
Specific techniques to improve comprehension at this level.

### 💡 Next Steps
A focused listening exercise to try next.
`.trim();
}

function buildReadingPrompt(p: GetFeedbackParams): string {
  const questionsBlock = p.questions
    ? p.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
    : '';

  return `
## Session Details
- **Topic:** ${p.topicLabel}
- **CEFR Level:** ${p.level}

## Passage
${p.practiceText}

## Comprehension Questions
${questionsBlock}

## Student's Answers
${p.answers || '*(no answers provided)*'}

---

Please provide feedback in these sections:

### 🎯 Overall Comprehension
A summary of how well the student understood the passage.

### ✅ Strong Answers
Which questions were answered well and why.

### 📝 Answers to Improve
Which answers were incomplete, incorrect, or imprecise. Provide the correct information from the text.

### 📚 Reading Strategy Tips
Specific techniques for reading comprehension at this level.

### 💡 Vocabulary Note
Highlight 2–3 key vocabulary items from the passage the student should remember.
`.trim();
}

function buildWritingPrompt(p: GetFeedbackParams): string {
  return `
## Session Details
- **Task:** ${p.topicLabel}
- **CEFR Target Level:** ${p.level}
- **Word Count:** ${p.writtenText ? p.writtenText.split(/\s+/).filter(Boolean).length : 0} words

## Writing Prompt / Task
${p.writingPrompt || p.practiceText}

## Student's Written Response
${p.writtenText || '*(nothing written)*'}

---

Please provide detailed feedback in these sections:

### 🎯 Overall Assessment & CEFR Level
Assess the overall quality and estimate the actual CEFR level demonstrated.

### ✅ Strengths
Specific examples of good grammar, vocabulary, or structure from their writing.

### 📝 Grammar Corrections
List specific grammatical errors with corrections. Format as:
- **Error:** "incorrect phrase" → **Correction:** "correct phrase"

### 📚 Vocabulary Feedback
Comment on vocabulary range and appropriateness. Suggest more precise or sophisticated alternatives where relevant.

### 🔗 Coherence & Structure
Assess how well the writing flows and is organized.

### 💡 Specific Improvement Tips
Two or three actionable tips targeted at this student's current level.
`.trim();
}

function buildPrompt(p: GetFeedbackParams): string {
  switch (p.skill) {
    case 'speaking':  return buildSpeakingPrompt(p);
    case 'listening': return buildListeningPrompt(p);
    case 'reading':   return buildReadingPrompt(p);
    case 'writing':   return buildWritingPrompt(p);
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useClaudeAPI(): UseClaudeAPIReturn {
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming]     = useState(false);
  const [error, setError]                = useState<string | null>(null);
  const abortControllerRef               = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    cancel();
    setStreamingText('');
    setError(null);
  }, [cancel]);

  const getFeedback = useCallback(async (params: GetFeedbackParams) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStreamingText('');
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_tokens: 1800,
          system:     SYSTEM_PROMPTS[params.skill],
          messages: [
            { role: 'user', content: buildPrompt(params) },
          ],
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = (errBody as { error?: { message?: string } }).error?.message
          || `API error ${response.status}`;
        throw new Error(msg);
      }

      if (!response.body) throw new Error('No response body from API.');

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr) as {
              type:   string;
              delta?: { type: string; text: string };
            };

            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta.text
            ) {
              setStreamingText(prev => prev + parsed.delta!.text);
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  return { streamingText, isStreaming, error, getFeedback, cancel, reset };
}
