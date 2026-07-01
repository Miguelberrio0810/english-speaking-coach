import { useState, useRef, useCallback } from 'react';
import { type Activity } from '../data/activities';
import { type SessionEntry } from './SessionHistory';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import { useAccuracy } from './AccuracyResult';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  activity:   Activity;
  apiKey:     string;
  onApiKey:   (key: string) => void;
  onBack:     () => void;
  onComplete: (entry: SessionEntry) => void;
}

type Speed = 'slow' | 'normal' | 'natural';

const SPEED_RATES: Record<Speed, number> = {
  slow:    0.7,
  normal:  0.85,
  natural: 1.0,
};

const MAX_REPLAYS = 3;

export function ListeningActivity({ activity, apiKey, onApiKey, onBack, onComplete }: Props) {
  const [step, setStep]               = useState<'listen' | 'transcribe' | 'feedback'>('listen');
  const [speed, setSpeed]             = useState<Speed>('normal');
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [showKey, setShowKey]         = useState(false);
  const [hasAsked, setHasAsked]       = useState(false);
  const [startTime]                   = useState(Date.now());

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { accuracy } = useAccuracy(activity.text, transcript);
  const { streamingText, isStreaming, error, getFeedback, cancel, reset: resetAPI } = useClaudeAPI();

  const speak = useCallback(() => {
    if (isPlaying || replaysLeft <= 0) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(activity.text);
    utter.lang  = 'en-US';
    utter.rate  = SPEED_RATES[speed];
    utter.pitch = 1.0;

    // prefer an en-US voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en-US') && !v.name.includes('Google'));
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setIsPlaying(true);
    utter.onend   = () => {
      setIsPlaying(false);
      setStep('transcribe');
    };
    utter.onerror = () => setIsPlaying(false);

    utteranceRef.current = utter;
    setReplaysLeft(n => n - 1);
    window.speechSynthesis.speak(utter);
  }, [activity.text, isPlaying, replaysLeft, speed]);

  function stopPlayback() {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }

  async function handleSubmit() {
    if (!transcript.trim()) return;
    setStep('feedback');
    setHasAsked(true);
    resetAPI();

    const duration = Math.round((Date.now() - startTime) / 1000);

    await getFeedback({
      apiKey,
      skill:       'listening',
      level:       activity.level,
      topicLabel:  activity.title,
      practiceText: activity.text,
      spokenText:  transcript,
      accuracy,
    });

    const entry: SessionEntry = {
      id:              crypto.randomUUID(),
      skill:           'listening',
      topicLabel:      activity.title,
      topicIcon:       activity.icon,
      level:           activity.level,
      accuracy,
      wordCount:       transcript.split(/\s+/).filter(Boolean).length,
      duration,
      timestamp:       Date.now(),
      feedbackExcerpt: streamingText.slice(0, 200) || undefined,
      corrections:     [],
    };
    onComplete(entry);
  }

  function handleSaveKey(key: string) {
    onApiKey(key);
    if (key) localStorage.setItem('claude_api_key', key);
    else localStorage.removeItem('claude_api_key');
  }

  const wordCount    = transcript.split(/\s+/).filter(Boolean).length;
  const targetWords  = activity.text.split(/\s+/).filter(Boolean).length;
  const hasFeedback  = streamingText.length > 0;

  return (
    <div className="fade-in flex flex-col gap-6">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{activity.icon}</span>
          <span className="font-semibold text-white truncate">{activity.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-400 font-semibold">
            {activity.level}
          </span>
        </div>
        <span className="text-xs text-amber-400">🎧 Listening</span>
      </div>

      {/* ── STEP: listen ── */}
      {step === 'listen' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <span className="text-amber-400 mt-0.5">💡</span>
            <div className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-300">How to practice:</strong> Press Play to listen to the audio.
              Then type <em className="text-amber-300">exactly</em> what you heard in the text box.
              You can replay up to <strong className="text-white">{MAX_REPLAYS} times</strong>.
            </div>
          </div>

          {/* Speed selector */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Playback Speed</div>
            <div className="flex gap-2">
              {(['slow', 'normal', 'natural'] as Speed[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                    ${speed === s
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-surface border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  {s === 'slow' ? '🐢 Slow' : s === 'normal' ? '🚶 Normal' : '🏃 Natural'}
                </button>
              ))}
            </div>
          </div>

          {/* Play button */}
          <div className="flex flex-col items-center gap-4 py-6">
            <button
              onClick={isPlaying ? stopPlayback : speak}
              disabled={replaysLeft <= 0 && !isPlaying}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-300 shadow-lg text-white
                ${isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40'
                  : replaysLeft > 0
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40 hover:scale-105'
                    : 'bg-surface-2 text-slate-600 cursor-not-allowed'}
              `}
            >
              {isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <div className="text-center">
              {isPlaying ? (
                <span className="text-amber-400 text-sm font-medium animate-pulse">
                  🔊 Playing — listen carefully…
                </span>
              ) : replaysLeft > 0 ? (
                <span className="text-slate-400 text-sm">
                  {replaysLeft === MAX_REPLAYS ? 'Press play to begin' : `${replaysLeft} replay${replaysLeft !== 1 ? 's' : ''} remaining`}
                </span>
              ) : (
                <span className="text-rose-400 text-sm">No replays remaining</span>
              )}
            </div>
          </div>

          {step === 'listen' && replaysLeft < MAX_REPLAYS && !isPlaying && (
            <button
              onClick={() => setStep('transcribe')}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all"
            >
              I'm Ready to Type What I Heard →
            </button>
          )}
        </div>
      )}

      {/* ── STEP: transcribe ── */}
      {step === 'transcribe' && (
        <div className="fade-in flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <span className="text-amber-400 mt-0.5">✏️</span>
            <div className="text-sm text-slate-300 leading-relaxed">
              Type <em className="text-amber-300">exactly</em> what you heard. Spelling and punctuation matter!
              {replaysLeft > 0 && (
                <> You still have <strong className="text-white">{replaysLeft}</strong> replay{replaysLeft !== 1 ? 's' : ''} left.</>
              )}
            </div>
          </div>

          {/* Replay button */}
          {replaysLeft > 0 && (
            <button
              onClick={() => { setStep('listen'); }}
              className="self-start px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400
                         text-sm hover:bg-amber-500/10 transition-all"
            >
              🔁 Replay ({replaysLeft} left)
            </button>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Your Transcription
              </label>
              <span className="text-xs text-slate-500">{wordCount} words</span>
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Type what you heard here…"
              rows={6}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3
                         text-slate-200 text-sm leading-relaxed placeholder-slate-600
                         focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20
                         resize-y transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${transcript.trim()
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 hover:-translate-y-0.5'
                : 'bg-surface-2 text-slate-600 cursor-not-allowed'}`}
          >
            ✨ Submit for AI Feedback
          </button>
        </div>
      )}

      {/* ── STEP: feedback ── */}
      {step === 'feedback' && (
        <div className="fade-in flex flex-col gap-5">
          {/* Accuracy score */}
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Transcription Accuracy</div>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold tabular-nums
                ${accuracy >= 85 ? 'text-emerald-400' : accuracy >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {Math.round(accuracy)}%
              </div>
              <div className="text-sm text-slate-400 leading-relaxed">
                {accuracy >= 85
                  ? 'Excellent listening! You caught almost everything.'
                  : accuracy >= 60
                    ? 'Good effort. Some words were tricky — review the AI feedback.'
                    : 'Keep practicing. The AI feedback will help you identify patterns.'}
              </div>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-surface rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400">🔑</span>
              <h3 className="text-sm font-semibold text-slate-200">Claude API Key</h3>
              <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer"
                 className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2">
                Get a key →
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => handleSaveKey(e.target.value)}
                placeholder="sk-ant-…"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 pr-10
                           text-sm text-slate-200 placeholder-slate-600
                           focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30
                           transition-colors"
              />
              <button onClick={() => setShowKey(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Get feedback / streaming result */}
          {!hasFeedback && !isStreaming && hasAsked && !error && (
            <div className="text-center text-slate-500 text-sm py-4">
              Waiting for AI response…
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-semibold text-sm mb-1">API Error</div>
              <div className="text-slate-400 text-sm">{error}</div>
              <button onClick={handleSubmit} className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {(hasFeedback || isStreaming) && (
            <div className="bg-surface rounded-2xl border border-white/10 p-5 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🤖</span>
                  <h3 className="text-sm font-semibold text-slate-200">AI Listening Feedback</h3>
                  {isStreaming && (
                    <span className="flex gap-0.5 ml-2">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </div>
                {isStreaming
                  ? <button onClick={cancel} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Stop</button>
                  : <button onClick={handleSubmit} className="text-xs text-slate-500 hover:text-amber-400 transition-colors">Regenerate</button>
                }
              </div>
              <div className="feedback-prose feedback-prose--listening text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm
                       hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
          >
            🎧 New Listening Session
          </button>
        </div>
      )}
    </div>
  );
}
