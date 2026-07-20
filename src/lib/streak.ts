import { type SessionEntry } from '../components/SessionHistory';

// Consecutive-day practice streak, computed from local session history.
// A day "counts" if the user completed at least one session on it.
export function computeStreak(sessions: SessionEntry[]): { current: number; best: number } {
  if (sessions.length === 0) return { current: 0, best: 0 };

  const days = [...new Set(sessions.map(s => s.timestamp))]
    .map(ts => new Date(ts).setHours(0, 0, 0, 0))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => b - a);

  const DAY_MS = 86_400_000;
  const today = new Date().setHours(0, 0, 0, 0);

  // Current streak: walk back from today (or yesterday, so a day not yet
  // practiced doesn't reset it prematurely) while consecutive days exist.
  let current = 0;
  if (days[0] === today || days[0] === today - DAY_MS) {
    current = 1;
    for (let i = 1; i < days.length; i++) {
      if (days[i - 1] - days[i] === DAY_MS) current++;
      else break;
    }
  }

  // Best streak within the available history.
  let best = days.length ? 1 : 0;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i - 1] - days[i] === DAY_MS ? run + 1 : 1;
    best = Math.max(best, run);
  }
  best = Math.max(best, current);

  return { current, best };
}
