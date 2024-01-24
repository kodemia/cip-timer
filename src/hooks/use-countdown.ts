import { useState, useRef, Dispatch, SetStateAction } from "react";

interface Countdown {
  seconds: number;
  pause: () => void;
  start: () => void;
  reset: () => void;
  setSeconds: Dispatch<SetStateAction<number>>;
  isRunning: boolean;
}

interface CountdownConfig {
  interval?: number;
  onEnd?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onTick?: (prev: number, next: number) => void;
  onStart?: () => void;
}

export function useCountdown(
  initialCountdown: number,
  config: CountdownConfig
): Countdown {
  const { interval = 1000, onEnd, onPause, onReset, onTick, onStart } = config;
  const [seconds, setSeconds] = useState(initialCountdown);
  const [initialSeconds, setInitialSeconds] = useState(initialCountdown);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>();

  function pause() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      onPause && onPause();
    }
  }

  function start() {
    if (intervalRef.current) return;

    setInitialSeconds(seconds);
    setIsRunning(true);

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          intervalRef.current = null;
          setIsRunning(false);
          onEnd && onEnd();
          return 0;
        }

        const next = prev - 1;
        onTick && onTick(prev, next);
        return next;
      });

      intervalRef.current = id;
      onStart && onStart();
    }, interval);
  }

  function reset() {
    setSeconds(initialSeconds);
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onReset && onReset();
  }

  return { seconds, pause, start, setSeconds, reset, isRunning };
}
