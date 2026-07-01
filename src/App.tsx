import { useState, useEffect } from 'react';
import { type Activity } from './data/activities';
import { HomeScreen }       from './components/HomeScreen';
import { PracticeText }     from './components/PracticeText';
import { RecordingPanel }   from './components/RecordingPanel';
import { AccuracyResult, useAccuracy } from './components/AccuracyResult';
import { FeedbackPanel }    from './components/FeedbackPanel';
import { ListeningActivity } from './components/ListeningActivity';
import { ReadingActivity }   from './components/ReadingActivity';
import { WritingActivity }   from './components/WritingActivity';
import { SessionHistory, type SessionEntry } from './components/SessionHistory';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

// ── Storage ───────────────────────────────────────────────────────────────

const HISTORY_KEY = 'coach_history_v2';

function loadHistory(): SessionEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveHistory(sessions: SessionEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions.slice(0, 30)));
}

// ── Speaking step ─────────────────────────────────────────────────────────

type SpeakingStep = 'read' | 'record' | 'results';
type ResultTab    = 'Accuracy' | 'AI Feedback';

// ── App ───────────────────────────────────────────────────────────────────

type View = 'home' | 'speaking' | 'listening' | 'reading' | 'writing';

export default function App() {
  const [view,     setView]     = useState<View>('home');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [history,  setHistory]  = useState<SessionEntry[]>(loadHistory);
  const [apiKey,   setApiKey]   = useState(() => localStorage.getItem('claude_api_key') || '');

  // Speaking sub-state
  const [speakingStep, setSpeakingStep] = useState<SpeakingStep>('read');
  const [resultTab,    setResultTab]    = useState<ResultTab>('Accuracy');

  const speech = useSpeechRecognition();

  // For speaking: derive practice text from the activity
  const practiceText = activity?.text ?? '';
  const { accuracy } = useAccuracy(practiceText, speech.transcript);

  // ── History helpers ──

  function addEntry(entry: SessionEntry) {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      saveHistory(next);
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  // ── Navigation ──

  function goHome() {
    speech.reset();
    setView('home');
    setSpeakingStep('read');
    setResultTab('Accuracy');
  }

  function handleActivityStart(act: Activity) {
    setActivity(act);
    speech.reset();
    setSpeakingStep('read');
    setResultTab('Accuracy');
    setView(act.skill);
  }

  // ── Speaking flow ──

  function handleSpeakingReady() {
    setSpeakingStep('record');
  }

  function handleSpeakingFinish() {
    if (!activity) return;
    speech.stop();

    const entry: SessionEntry = {
      id:        crypto.randomUUID(),
      skill:     'speaking',
      topicIcon: activity.icon,
      topicLabel: activity.title,
      level:     activity.level,
      accuracy,
      wordCount: speech.transcript.split(/\s+/).filter(Boolean).length,
      duration:  speech.elapsedSeconds,
      timestamp: Date.now(),
      corrections: [],
    };

    addEntry(entry);
    setSpeakingStep('results');
    setResultTab('Accuracy');
  }

  function handleSpeakingTryAgain() {
    speech.reset();
    setSpeakingStep('record');
  }

  // Stop recording if navigating away
  useEffect(() => {
    if (view !== 'speaking' && speech.isRecording) {
      speech.stop();
    }
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── HOME ── */}
        {view === 'home' && (
          <>
            <HomeScreen onStart={handleActivityStart} />
            <div className="mt-10">
              <SessionHistory sessions={history} onClear={clearHistory} />
            </div>
          </>
        )}

        {/* ── SPEAKING ── */}
        {view === 'speaking' && activity && (
          <>
            {speakingStep === 'read' && (
              <PracticeText
                topic={{ id: activity.id, label: activity.title, icon: activity.icon, description: activity.theme }}
                level={
                  activity.level === 'A1' || activity.level === 'A2' ? 'beginner'
                  : activity.level === 'B1' || activity.level === 'B2' ? 'intermediate'
                  : 'advanced'
                }
                text={practiceText}
                onBack={goHome}
                onReady={handleSpeakingReady}
              />
            )}

            {speakingStep === 'record' && (
              <div className="fade-in flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSpeakingStep('read')}
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl">{activity.icon}</span>
                    <span className="font-semibold text-white truncate">{activity.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/15 text-violet-400 font-semibold">
                      {activity.level}
                    </span>
                  </div>
                </div>

                <RecordingPanel
                  isRecording={speech.isRecording}
                  isSupported={speech.isSupported}
                  transcript={speech.transcript}
                  interimTranscript={speech.interimTranscript}
                  elapsedSeconds={speech.elapsedSeconds}
                  targetText={practiceText}
                  onStart={speech.start}
                  onStop={speech.stop}
                  onReset={handleSpeakingTryAgain}
                />

                {speech.transcript.trim() && !speech.isRecording && (
                  <button
                    onClick={handleSpeakingFinish}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white
                               font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/40
                               hover:-translate-y-0.5 active:translate-y-0 fade-in"
                  >
                    ✅ See My Results
                  </button>
                )}
              </div>
            )}

            {speakingStep === 'results' && (
              <div className="fade-in flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={goHome}
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl">{activity.icon}</span>
                    <span className="font-semibold text-white truncate">{activity.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/15 text-violet-400 font-semibold">
                      {activity.level}
                    </span>
                  </div>
                  <button
                    onClick={handleSpeakingTryAgain}
                    className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 whitespace-nowrap"
                  >
                    Try again
                  </button>
                </div>

                {/* Tab bar */}
                <div className="flex bg-surface rounded-xl p-1 gap-1">
                  {(['Accuracy', 'AI Feedback'] as ResultTab[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setResultTab(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${resultTab === t
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {t === 'Accuracy' ? '📊 Accuracy' : '✨ AI Feedback'}
                    </button>
                  ))}
                </div>

                {resultTab === 'Accuracy' && (
                  <AccuracyResult
                    targetText={practiceText}
                    spokenText={speech.transcript}
                  />
                )}

                {resultTab === 'AI Feedback' && (
                  <FeedbackPanel
                    skill="speaking"
                    topicLabel={activity.title}
                    level={activity.level}
                    practiceText={practiceText}
                    spokenText={speech.transcript}
                    accuracy={accuracy}
                    apiKey={apiKey}
                    onApiKey={setApiKey}
                  />
                )}

                <button
                  onClick={goHome}
                  className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm
                             hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5
                             transition-all duration-200"
                >
                  🎙️ Start a New Session
                </button>
              </div>
            )}
          </>
        )}

        {/* ── LISTENING ── */}
        {view === 'listening' && activity && (
          <ListeningActivity
            activity={activity}
            apiKey={apiKey}
            onApiKey={setApiKey}
            onBack={goHome}
            onComplete={addEntry}
          />
        )}

        {/* ── READING ── */}
        {view === 'reading' && activity && (
          <ReadingActivity
            activity={activity}
            apiKey={apiKey}
            onApiKey={setApiKey}
            onBack={goHome}
            onComplete={addEntry}
          />
        )}

        {/* ── WRITING ── */}
        {view === 'writing' && activity && (
          <WritingActivity
            activity={activity}
            apiKey={apiKey}
            onApiKey={setApiKey}
            onBack={goHome}
            onComplete={addEntry}
          />
        )}

      </div>
    </div>
  );
}
