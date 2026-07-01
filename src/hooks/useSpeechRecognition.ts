import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  elapsedSeconds: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording]         = useState(false);
  const [transcript, setTranscript]           = useState('');
  const [interimTranscript, setInterim]       = useState('');
  const [elapsedSeconds, setElapsedSeconds]   = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalBufferRef = useRef<string>('');

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  /* ── Clean up on unmount ── */
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
  }, [stopTimer]);

  const start = useCallback(() => {
    if (!isSupported || isRecording) return;

    const SRConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SRConstructor();

    recognition.continuous      = true;
    recognition.interimResults  = true;
    recognition.lang            = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      startTimer();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let addedFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text   = result[0].transcript;
        if (result.isFinal) {
          addedFinal += text + ' ';
        } else {
          interim += text;
        }
      }

      if (addedFinal) {
        finalBufferRef.current += addedFinal;
        setTranscript(finalBufferRef.current.trim());
      }
      setInterim(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 'no-speech' is benign — just keep going
      if (event.error === 'no-speech') return;
      console.warn('SpeechRecognition error:', event.error);
      setIsRecording(false);
      stopTimer();
    };

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be recording
      // (browser ends the session after a silence period)
      if (recognitionRef.current && isRecording) {
        try { recognitionRef.current.start(); } catch (_) { /* ignore */ }
      } else {
        setIsRecording(false);
        stopTimer();
        setInterim('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, isRecording, startTimer, stopTimer]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.onend = null;   // prevent auto-restart
    recognitionRef.current.stop();
    recognitionRef.current = null;
    setIsRecording(false);
    setInterim('');
    stopTimer();
  }, [stopTimer]);

  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setInterim('');
    setElapsedSeconds(0);
    finalBufferRef.current = '';
  }, [stop]);

  return {
    isRecording,
    isSupported,
    transcript,
    interimTranscript,
    elapsedSeconds,
    start,
    stop,
    reset,
  };
}
