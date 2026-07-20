import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type QuizSkill, type QuizQuestion } from '../data/quiz';
import { type CEFRLevel, type Skill } from '../data/activities';
import { type UserProfile } from '../lib/profile';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAccuracy } from './AccuracyResult';
import { loadRecentTopics, addRecentTopics } from '../lib/topicHistory';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onSkip:     () => void;
}

type Step = 'intro' | 'mcq' | 'writing' | 'speaking' | 'submitting' | 'results' | 'error';
type QuizLoadState = 'loading' | 'ready' | 'error';

interface GeneratedQuiz {
  questions:       QuizQuestion[];
  writingPrompt:   string;
  speakingPassage: string;
  topics:          string[];
}

const CEFR_BADGE: Record<CEFRLevel, string> = {
  A1: 'bg-slate-600/50    text-slate-300   border-slate-500/30',
  A2: 'bg-emerald-500/15  text-emerald-400 border-emerald-500/30',
  B1: 'bg-sky-500/15      text-sky-400     border-sky-500/30',
  B2: 'bg-violet-500/15   text-violet-400  border-violet-500/30',
  C1: 'bg-rose-500/15     text-rose-400    border-rose-500/30',
};

const SKILL_ICON: Record<Skill, string> = {
  speaking: '🎙️', listening: '🎧', reading: '📖', writing: '✍️',
};

async function fetchGeneratedQuiz(): Promise<GeneratedQuiz> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recentTopics: loadRecentTopics() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Request failed (${res.status})`);
  }
  return res.json() as Promise<GeneratedQuiz>;
}

export function PlacementQuiz({ onComplete, onSkip }: Props) {
  const { t } = useTranslation();

  const [quizLoadState, setQuizLoadState] = useState<QuizLoadState>('loading');
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);

  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [writingText, setWritingText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<Omit<UserProfile, 'quizTakenAt'> | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speech = useSpeechRecognition();

  const questions = quiz?.questions ?? [];
  const currentQ = questions[qIndex];
  const { accuracy } = useAccuracy(quiz?.speakingPassage ?? '', speech.transcript);

  // Data-fetching effect (the canonical case for useEffect): generates a
  // fresh quiz on mount. quizLoadState defaults to 'loading', so no extra
  // synchronous setState is needed before the fetch settles into 'ready'/'error'.
  const loadQuiz = useCallback(async () => {
    setQuizLoadState('loading');
    try {
      const data = await fetchGeneratedQuiz();
      setQuiz(data);
      setAnswers(data.questions.map(() => null));
      setQuizLoadState('ready');
      addRecentTopics(data.topics);
    } catch {
      setQuizLoadState('error');
    }
  }, []);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);

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
    if (qIndex < questions.length - 1) {
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
    questions.forEach((q, i) => {
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
    if (!quiz) return;
    setStep('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quiz',
          mcqStats: computeMcqStats(),
          writingSample: { prompt: quiz.writingPrompt, text: writingText },
          speakingSample: {
            targetText: quiz.speakingPassage,
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
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">{t('placement.title')}</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          {t('placement.subtitle')}
        </p>
      </div>

      {/* ── INTRO ── */}
      {step === 'intro' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5 text-sm text-slate-300 leading-relaxed">
            {t('placement.introBody')}
          </div>

          {quizLoadState === 'loading' && (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-4 rounded-full bg-surface-2 animate-pulse" style={{ width: `${80 - i * 15}%` }} />
              ))}
              <p className="text-xs text-slate-500 text-center">{t('placement.generating')}</p>
            </div>
          )}

          {quizLoadState === 'error' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center">
              <p className="text-rose-300 text-sm mb-3">{t('placement.generateError')}</p>
              <button onClick={loadQuiz} className="text-xs text-rose-300 underline underline-offset-2">
                {t('common.tryAgain')}
              </button>
            </div>
          )}

          <button
            onClick={() => setStep('mcq')}
            disabled={quizLoadState !== 'ready'}
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold
                       transition-all duration-200 shadow-lg shadow-violet-900/40 hover:-translate-y-0.5
                       disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {t('placement.start')}
          </button>
          <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 mx-auto">
            {t('placement.skip')}
          </button>
        </div>
      )}

      {/* ── MCQ ── */}
      {step === 'mcq' && currentQ && (
        <div className="fade-in flex flex-col gap-5">
          <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">
            {t('placement.questionProgress', { current: qIndex + 1, total: questions.length, level: currentQ.level })}
          </div>

          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            {currentQ.skill === 'listening' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => speak(currentQ.audioText ?? '')}
                  className="self-start px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all"
                >
                  {t('placement.playSentence')}
                </button>
                <p className="text-xs text-slate-500">{t('placement.pressPlay')}</p>
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
            {qIndex < questions.length - 1 ? t('placement.next') : t('placement.continueToWriting')}
          </button>
        </div>
      )}

      {/* ── WRITING ── */}
      {step === 'writing' && quiz && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{t('placement.writingSampleLabel')}</div>
            <p className="text-slate-200 text-sm leading-relaxed">{quiz.writingPrompt}</p>
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
          <div className="text-xs text-slate-500 text-right">{t('placement.wordCount', { count: wordCount })}</div>
          <button
            onClick={() => setStep('speaking')}
            disabled={!writingText.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${writingText.trim()
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            {t('placement.continueToSpeaking')}
          </button>
        </div>
      )}

      {/* ── SPEAKING ── */}
      {step === 'speaking' && quiz && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{t('placement.readAloud')}</div>
            <p className="text-slate-200 text-sm leading-relaxed">{quiz.speakingPassage}</p>
          </div>

          {!speech.isSupported && (
            <div className="text-center text-sm text-rose-400 py-2">
              {t('placement.speechNotSupported')}
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
              {speech.isRecording ? t('recording.recordingTapStop') : t('recording.tapToStart')}
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
            {t('placement.getResults')}
          </button>
        </div>
      )}

      {/* ── SUBMITTING ── */}
      {step === 'submitting' && (
        <div className="fade-in flex flex-col gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-4 rounded-full bg-surface-2 animate-pulse" style={{ width: `${85 - i * 18}%` }} />
          ))}
          <p className="text-slate-400 text-sm text-center py-2">{t('placement.scoring')}</p>
        </div>
      )}

      {/* ── ERROR ── */}
      {step === 'error' && (
        <div className="fade-in flex flex-col gap-4">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
            <div className="text-rose-300 font-semibold text-sm mb-1">{t('placement.errorTitle')}</div>
            <div className="text-slate-400 text-sm">{errorMsg}</div>
          </div>
          <button onClick={submitQuiz} className="w-full py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:border-violet-500/40">
            {t('common.tryAgain')}
          </button>
          <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 mx-auto">
            {t('placement.skip')}
          </button>
        </div>
      )}

      {/* ── RESULTS ── */}
      {step === 'results' && result && (
        <div className="fade-in flex flex-col gap-5">
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{t('placement.yourLevels')}</div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(result.skillLevels) as Skill[]).map(sk => (
                <div key={sk} className={`rounded-xl border p-3 ${sk === result.weakestSkill ? 'ring-1 ring-rose-500/40' : ''}`}>
                  <div className="text-xs text-slate-400 mb-1">{SKILL_ICON[sk]} {t(`skills.${sk}.label`)}</div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${CEFR_BADGE[result.skillLevels[sk]]}`}>
                    {result.skillLevels[sk]}
                  </span>
                  {sk === result.weakestSkill && (
                    <div className="text-[10px] text-rose-400 mt-1">{t('placement.focusArea')}</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mt-4">{result.summary}</p>
          </div>

          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              {t('placement.tipsToImprove', { skill: `${SKILL_ICON[result.weakestSkill]} ${t(`skills.${result.weakestSkill}.label`)}` })}
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
            {t('placement.continueToHome')}
          </button>
        </div>
      )}
    </div>
  );
}
