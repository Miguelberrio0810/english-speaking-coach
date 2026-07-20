// Shared anti-repetition memory: recent topics used by AI-generated quizzes
// and AI-generated practice activities, so the model can be told what to
// avoid on the next generation. Keeps only the last N attempts' tags.

const TOPIC_HISTORY_KEY = 'coach_recent_topics_v1';
const MAX_ENTRIES = 40;

export function loadRecentTopics(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(TOPIC_HISTORY_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

export function addRecentTopics(topics: string[]) {
  if (topics.length === 0) return;
  const next = [...topics, ...loadRecentTopics()].slice(0, MAX_ENTRIES);
  localStorage.setItem(TOPIC_HISTORY_KEY, JSON.stringify(next));
}
