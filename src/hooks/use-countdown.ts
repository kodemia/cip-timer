import { useState, useRef, Dispatch, SetStateAction } from "react";

interface Countdown {
  seconds: number;
  pause: () => void;
  start: () => void;
  reset: () => void;
  getIsRunning: () => boolean;
  setSeconds: Dispatch<SetStateAction<number>>;
}

interface CountdownOptions {
  interval?: number;
  onEnd?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onTick?: (prev: number, next: number) => void;
  onStart?: () => void;
}

export function useCountdown(
  initialCountdown: number,
  {
    interval = 1000,
    onEnd,
    onPause,
    onReset,
    onTick,
    onStart,
  }: CountdownOptions = {}
): Countdown {
  const [seconds, setSeconds] = useState(initialCountdown);
  const intervalRef = useRef<number | null>();

  function pause() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      onPause && onPause();
    }
  }

  function start() {
    if (intervalRef.current) return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          intervalRef.current = null;
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
    setSeconds(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onReset && onReset();
  }

  function getIsRunning() {
    return !!intervalRef.current;
  }

  return { seconds, pause, start, getIsRunning, setSeconds, reset };
}
