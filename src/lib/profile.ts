import { type Skill, type CEFRLevel } from '../data/activities';

export interface UserProfile {
  skillLevels:  Record<Skill, CEFRLevel>;
  overallLevel: CEFRLevel;
  weakestSkill: Skill;
  tips:         string[];
  summary:      string;
  quizTakenAt:  number;
}

const PROFILE_KEY = 'coach_profile_v1';

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}
