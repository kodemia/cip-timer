import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCountdown } from "./hooks/use-countdown";
import {
  PlayIcon,
  PlusIcon,
  PauseIcon,
  UndoIcon,
  MinusIcon,
} from "lucide-react";

const MINUTE = 60;
const initialSeconds = 5 * MINUTE;

function beep() {
  const snd = new Audio("notification.wav");
  snd.play();
}

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const { seconds, start, pause, getIsRunning, setSeconds, reset } =
    useCountdown(initialSeconds, {
      onStart: () => setIsRunning(true),
      onPause: () => setIsRunning(false),
      onReset: () => setIsRunning(false),
      onEnd: () => {
        setIsRunning(false);
        setShowDone(true);
        setTimeout(() => setShowDone(false), 2 * 1000);
        beep();
      },
    });

  const minutes = Math.floor(seconds / MINUTE)
    .toString()
    .padStart(2, "0");
  const secondsLeft = (seconds % MINUTE).toString().padStart(2, "0");

  function addMinute() {
    setSeconds((seconds) => {
      if (seconds >= MINUTE * 99) return seconds;
      return seconds + MINUTE;
    });
  }

  function removeMinute() {
    setSeconds((seconds) => {
      if (seconds <= 0) return seconds;
      return seconds - MINUTE;
    });
  }

  useEffect(() => {
    const commands = {
      start: {
        keys: ["Enter", " "],
        handler: () => {
          if (getIsRunning()) return pause();
          start();
        },
      },
      reset: {
        keys: ["Escape"],
        handler: () => reset(),
      },
      addMinute: {
        keys: ["ArrowUp", "+"],
        handler: () => {
          if (!getIsRunning()) addMinute();
        },
      },
      removeMinute: {
        keys: ["ArrowDown", "-"],
        handler: () => {
          if (!getIsRunning()) removeMinute();
        },
      },
      playSound: {
        keys: ["b"],
        handler: () => beep(),
      },
      oneMinute: {
        keys: ["1"],
        handler: () => setSeconds(MINUTE),
      },
      fiveMinutes: {
        keys: ["2"],
        handler: () => setSeconds(MINUTE * 5),
      },
      tenMinutes: {
        keys: ["3"],
        handler: () => setSeconds(MINUTE * 10),
      },
      fifteenMinutes: {
        keys: ["4"],
        handler: () => setSeconds(MINUTE * 15),
      },
    };

    function commandHandler(event: KeyboardEvent) {
      const command = Object.values(commands).find(({ keys }) =>
        keys.includes(event.key)
      );

      if (command) command.handler();
    }

    window.addEventListener("keydown", commandHandler);

    return () => window.removeEventListener("keydown", commandHandler);
  }, []);

  useEffect(() => {
    document.title = `Timer: ${minutes}:${secondsLeft}`;
  }, [minutes, secondsLeft]);

  return (
    <main className="min-h-dvh flex flex-col justify-between antialiased">
      <header className="p-10 flex flex-row flex-wrap gap-4 mx-auto text-sm justify-around">
        <div className="btn btn-ghost" onClick={() => setSeconds(MINUTE)}>
          <kbd className="kbd kbd-xs mr-2">1</kbd>
          <span className="text-xs">1 min</span>
        </div>

        <div className="btn btn-ghost" onClick={() => setSeconds(MINUTE * 5)}>
          <kbd className="kbd kbd-xs mr-2">2</kbd>
          <span className="text-xs">5 min</span>
        </div>

        <div className="btn btn-ghost" onClick={() => setSeconds(MINUTE * 10)}>
          <kbd className="kbd kbd-xs mr-2">3</kbd>
          <span className="text-xs">10 min</span>
        </div>

        <div className="btn btn-ghost" onClick={() => setSeconds(MINUTE * 15)}>
          <kbd className="kbd kbd-xs mr-2">4</kbd>
          <span className="text-xs">15 min</span>
        </div>
      </header>

      <section className="flex flex-col gap-28 items-center justify-center">
        <div className="grid grid-cols-2 gap-8">
          <div
            onClick={() => removeMinute()}
            className={clsx("btn btn-ghost btn-lg cursor-pointer", {
              invisible: getIsRunning(),
            })}
          >
            <MinusIcon className="w-6 h-6" />
          </div>

          <div
            onClick={() => addMinute()}
            className={clsx("btn btn-ghost btn-lg cursor-pointer", {
              invisible: getIsRunning(),
            })}
          >
            <PlusIcon className="w-6 h-6" />
          </div>
        </div>

        <div
          className={clsx(
            "grid grid-flow-col gap-5 text-center auto-cols-max ",
            { "animate-ping": showDone }
          )}
        >
          <div className="flex flex-col">
            <span className="font-sans text-2xl">
              <span>{minutes}</span>
            </span>
          </div>
          <span className="text-2xl">:</span>
          <div className="flex flex-col">
            <span className="font-sans text-2xl">
              <span>{secondsLeft}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div
            className={clsx("btn btn-ghost btn-lg cursor-pointer")}
            onClick={() => reset()}
          >
            <UndoIcon className="w-6 h-6" />
          </div>

          <div
            className="btn btn-ghost btn-lg cursor-pointer"
            onClick={() => (getIsRunning() ? pause() : start())}
          >
            {isRunning ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </div>
        </div>
      </section>

      <footer
        // className="flex flex-row gap-10 w-full text-center text-xs *:flex *:flex-row *:gap-2 items-center justify-center lg:px-20 py-4"
        className="p-10 flex flex-row flex-wrap gap-4 mx-auto text-sm"
      >
        <div className="flex items-center gap-2">
          <kbd className="kbd kbd-xs">▲</kbd>
          <span className="text-xs">+1 min</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="kbd kbd-xs">▼</kbd>
          <span className="text-xs">-1 min</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="kbd kbd-xs">enter</kbd>
          <span className="text-xs">start/stop</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="kbd kbd-xs">esc</kbd>
          <span className="text-xs">reset</span>
        </div>
      </footer>
    </main>
  );
}
