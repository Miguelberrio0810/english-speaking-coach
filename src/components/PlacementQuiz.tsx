import { useState, useRef, useCallback } from 'react';
import { QUIZ_QUESTIONS, PLACEMENT_WRITING_PROMPT, PLACEMENT_SPEAKING_PASSAGE, type QuizSkill } from '../data/quiz';
import { type CEFRLevel, type Skill } from '../data/activities';
import { type UserProfile } from '../lib/profile';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAccuracy } from './AccuracyResult';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onSkip:     () => void;
}

type Step = 'intro' | 'mcq' | 'writing' | 'speaking' | 'submitting' | 'results' | 'error';

const CEFR_BADGE: Record<CEFRLevel, string> = {
  A1: 'bg-slate-600/50    text-slate-300   border-slate-500/30',
  A2: 'bg-emerald-500/15  text-emerald-400 border-emerald-500/30',
  B1: 'bg-sky-500/15      text-sky-400     border-sky-500/30',
  B2: 'bg-violet-500/15   text-violet-400  border-violet-500/30',
  C1: 'bg-rose-500/15     text-rose-400    border-rose-500/30',
};

const SKILL_LABEL: Record<Skill, string> = {
  speaking: '🎙️ Speaking', listening: '🎧 Listening', reading: '📖 Reading', writing: '✍️ Writing',
};

export function PlacementQuiz({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUIZ_QUESTIONS.map(() => null));
  const [writingText, setWritingText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<Omit<UserProfile, 'quizTakenAt'> | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speech = useSpeechRecognition();
  const { accuracy } = useAccuracy(PLACEMENT_SPEAKING_PASSAGE, speech.transcript);

  const currentQ = QUIZ_QUESTIONS[qIndex];

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  function selectAnswer(idx: number) {
    const next = [...answers];
    next[qIndex] = idx;
    setAnswers(next);
  }

  function nextQuestion() {
    window.speechSynthesis.cancel();
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep('writing');
    }
  }

  function computeMcqStats(): Record<QuizSkill, number> {
    const totals: Record<QuizSkill, { correct: number; total: number }> = {
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 },
      grammar: { correct: 0, total: 0 },
    };
    QUIZ_QUESTIONS.forEach((q, i) => {
      totals[q.skill].total += 1;
      if (answers[i] === q.correctIndex) totals[q.skill].correct += 1;
    });
    return {
      reading:   totals.reading.total   ? (totals.reading.correct   / totals.reading.total)   * 100 : 0,
      listening: totals.listening.total ? (totals.listening.correct / totals.listening.total) * 100 : 0,
      grammar:   totals.grammar.total   ? (totals.grammar.correct   / totals.grammar.total)   * 100 : 0,
    };
  }

  async function submitQuiz() {
    setStep('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quiz',
          mcqStats: computeMcqStats(),
          writingSample: { prompt: PLACEMENT_WRITING_PROMPT, text: writingText },
          speakingSample: {
            targetText: PLACEMENT_SPEAKING_PASSAGE,
            spokenText: speech.transcript,
            accuracy,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Request failed (${res.status})`);
      }

      const data = await res.json() as Omit<UserProfile, 'quizTakenAt'>;
      setResult(data);
      setStep('results');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong scoring your quiz.');
      setStep('error');
    }
  }

  function finish() {
    if (!result) return;
    onComplete({ ...result, quizTakenAt: Date.now() });
  }

  const wordCount = writingText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="fade-in flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        bg-violet-500/15 border border-violet-500/20 mb-4">
          <span className="text-2xl">🧭</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Level Check</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          A quick 5-minute check across all four skills so we can personalize your practice.
        </p>
      </div>

      {/* ── INTRO ── */}
      {step === 'intro' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5 text-sm text-slate-300 leading-relaxed">
            You'll answer 15 quick multiple-choice questions, write a few sentences, and read a short
            passage aloud. We'll estimate your CEFR level per skill and suggest what to focus on next.
          </div>
          <button
            onClick={() => setStep('mcq')}
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold
                       transition-all duration-200 shadow-lg shadow-violet-900/40 hover:-translate-y-0.5"
          >
            Start Level Check
          </button>
          <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 mx-auto">
            Skip for now
          </button>
        </div>
      )}

      {/* ── MCQ ── */}
      {step === 'mcq' && currentQ && (
        <div className="fade-in flex flex-col gap-5">
          <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">
            Question {qIndex + 1} of {QUIZ_QUESTIONS.length} · {currentQ.level}
          </div>

          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            {currentQ.skill === 'listening' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => speak(currentQ.audioText ?? '')}
                  className="self-start px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all"
                >
                  🔊 Play Sentence
                </button>
                <p className="text-xs text-slate-500">Press play, then answer the question below.</p>
              </div>
            ) : (
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{currentQ.prompt}</p>
            )}
          </div>

          <div className="text-sm font-medium text-slate-200">{currentQ.question}</div>

          <div className="flex flex-col gap-2">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150
                  ${answers[qIndex] === i
                    ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                    : 'bg-surface border-white/10 text-slate-300 hover:border-white/20'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={answers[qIndex] === null}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${answers[qIndex] !== null
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            {qIndex < QUIZ_QUESTIONS.length - 1 ? 'Next →' : 'Continue to Writing →'}
          </button>
        </div>
      )}

      {/* ── WRITING ── */}
      {step === 'writing' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Writing Sample</div>
            <p className="text-slate-200 text-sm leading-relaxed">{PLACEMENT_WRITING_PROMPT}</p>
          </div>
          <textarea
            value={writingText}
            onChange={e => setWritingText(e.target.value)}
            placeholder="Write here…"
            rows={8}
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3
                       text-slate-200 text-sm leading-[1.85] placeholder-slate-600
                       focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20
                       resize-y transition-colors"
          />
          <div className="text-xs text-slate-500 text-right">{wordCount} words</div>
          <button
            onClick={() => setStep('speaking')}
            disabled={!writingText.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${writingText.trim()
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            Continue to Speaking →
          </button>
        </div>
      )}

      {/* ── SPEAKING ── */}
      {step === 'speaking' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Read This Aloud</div>
            <p className="text-slate-200 text-sm leading-relaxed">{PLACEMENT_SPEAKING_PASSAGE}</p>
          </div>

          {!speech.isSupported && (
            <div className="text-center text-sm text-rose-400 py-2">
              Speech recognition isn't supported in this browser — try Chrome, or skip this step.
            </div>
          )}

          <div className="flex flex-col items-center gap-3 py-4">
            <button
              onClick={speech.isRecording ? speech.stop : speech.start}
              disabled={!speech.isSupported}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg text-white
                ${speech.isRecording ? 'bg-rose-600 hover:bg-rose-500' : 'bg-violet-600 hover:bg-violet-500'}`}
            >
              {speech.isRecording ? '⏹️' : '🎙️'}
            </button>
            <span className="text-sm text-slate-400">
              {speech.isRecording ? 'Recording… tap to stop' : 'Tap to start recording'}
            </span>
          </div>

          {speech.transcript && (
            <div className="bg-surface rounded-xl border border-white/10 p-4 text-sm text-slate-300">
              {speech.transcript}
            </div>
          )}

          <button
            onClick={submitQuiz}
            disabled={speech.isRecording || (!speech.transcript.trim() && speech.isSupported)}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${!speech.isRecording && (speech.transcript.trim() || !speech.isSupported)
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            ✨ Get My Results
          </button>
        </div>
      )}

      {/* ── SUBMITTING ── */}
      {step === 'submitting' && (
        <div className="fade-in text-center text-slate-400 text-sm py-10">
          Scoring your level check…
        </div>
      )}

      {/* ── ERROR ── */}
      {step === 'error' && (
        <div className="fade-in flex flex-col gap-4">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
            <div className="text-rose-300 font-semibold text-sm mb-1">Couldn't score your quiz</div>
            <div className="text-slate-400 text-sm">{errorMsg}</div>
          </div>
          <button onClick={submitQuiz} className="w-full py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:border-violet-500/40">
            Try again
          </button>
          <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 mx-auto">
            Skip for now
          </button>
        </div>
      )}

      {/* ── RESULTS ── */}
      {step === 'results' && result && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your Levels</div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(result.skillLevels) as Skill[]).map(sk => (
                <div key={sk} className={`rounded-xl border p-3 ${sk === result.weakestSkill ? 'ring-1 ring-rose-500/40' : ''}`}>
                  <div className="text-xs text-slate-400 mb-1">{SKILL_LABEL[sk]}</div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${CEFR_BADGE[result.skillLevels[sk]]}`}>
                    {result.skillLevels[sk]}
                  </span>
                  {sk === result.weakestSkill && (
                    <div className="text-[10px] text-rose-400 mt-1">Focus area</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mt-4">{result.summary}</p>
          </div>

          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Tips to Improve {SKILL_LABEL[result.weakestSkill]}
            </div>
            <ul className="flex flex-col gap-2">
              {result.tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                  <span className="text-violet-400 shrink-0">•</span>{tip}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={finish}
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold
                       transition-all duration-200 shadow-lg shadow-violet-900/40 hover:-translate-y-0.5"
          >
            Continue to Home →
          </button>
        </div>
      )}
    </div>
  );
}
