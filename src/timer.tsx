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
const SECOND = 1;
const MAX_TIME = MINUTE * 99;
const MIN_TIME = 0;
const initialSeconds = 5 * MINUTE;

const notificationSound = new Audio("notification.wav");

export default function Timer() {
  const [showDone, setShowDone] = useState(false);
  const { seconds, start, pause, setSeconds, reset, isRunning } = useCountdown(
    initialSeconds,
    {
      onEnd: () => {
        setShowDone(true);
        setTimeout(() => setShowDone(false), 2 * 1000);
        notificationSound.play();
      },
    }
  );

  const minutes = Math.floor(seconds / MINUTE)
    .toString()
    .padStart(2, "0");
  const secondsLeft = (seconds % MINUTE).toString().padStart(2, "0");

  function addTime(secondsToAdd: number) {
    if (isRunning) return;

    setSeconds((seconds) => {
      const newSeconds = seconds + secondsToAdd;
      return newSeconds >= MAX_TIME ? MAX_TIME : newSeconds;
    });
  }

  function reduceTime(secondsToSubtract: number) {
    if (isRunning) return;

    setSeconds((seconds) => {
      const newSeconds = seconds - secondsToSubtract;
      return newSeconds <= MIN_TIME ? MIN_TIME : newSeconds;
    });
  }

  function startStop() {
    if (isRunning) return pause();
    start();
  }

  useEffect(() => {
    const commands = {
      start: {
        keys: ["Enter", " "],
        handler: startStop,
      },
      reset: {
        keys: ["Escape", "r", "Backspace", "Delete"],
        handler: reset,
      },
      addMinute: {
        keys: ["ArrowUp", "+"],
        handler: () => addTime(MINUTE),
      },
      removeMinute: {
        keys: ["ArrowDown", "-"],
        handler: () => reduceTime(MINUTE),
      },
      playSound: {
        keys: ["b"],
        handler: () => notificationSound.play(),
      },
      zero: {
        keys: ["0"],
        handler: () => setSeconds(0),
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
      addFiveMinutes: {
        keys: ["5"],
        handler: () => addTime(MINUTE * 5),
      },
      addSecond: {
        keys: [".", "ArrowRight"],
        handler: () => addTime(SECOND),
      },
      removeSecond: {
        keys: [",", "ArrowLeft"],
        handler: () => reduceTime(SECOND),
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
  }, [isRunning]);

  useEffect(() => {
    document.title = `Timer: ${minutes}:${secondsLeft}`;
  }, [minutes, secondsLeft]);

  return (
    <main className="min-h-dvh flex flex-col justify-between antialiased pt-10">
      <header
        className={clsx(
          "flex flex-row flex-wrap gap-4 mx-auto text-sm justify-around",
          { invisible: isRunning }
        )}
      >
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
            onClick={() => reduceTime(MINUTE)}
            className={clsx("btn btn-ghost btn-lg cursor-pointer", {
              invisible: isRunning,
            })}
          >
            <MinusIcon className="w-6 h-6" />
          </div>

          <div
            onClick={() => addTime(MINUTE)}
            className={clsx("btn btn-ghost btn-lg cursor-pointer", {
              invisible: isRunning,
            })}
          >
            <PlusIcon className="w-6 h-6" />
          </div>
        </div>

        <div
          className={clsx(
            "grid grid-flow-col gap-5 auto-cols-max select-none",
            "text-5xl",
            { "animate-ping": showDone }
          )}
        >
          {minutes}:{secondsLeft}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div
            className={clsx("btn btn-ghost btn-lg cursor-pointer", {
              hidden: isRunning,
            })}
            onClick={reset}
          >
            <UndoIcon className="w-6 h-6" />
          </div>

          <div
            className={clsx("btn btn-ghost btn-lg cursor-pointer mx-auto", {
              "col-span-2": isRunning,
            })}
            onClick={startStop}
          >
            {isRunning && <PauseIcon className="w-6 h-6" />}
            {!isRunning && <PlayIcon className="w-6 h-6" />}
          </div>
        </div>
      </section>

      <footer className="flex flex-col text-center gap-5">
        <section
          className={clsx(
            "flex flex-row flex-wrap gap-4 mx-auto p-4",
            "hidden md:flex",
            { invisible: isRunning }
          )}
        >
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">▲ ▼</kbd>
            <span className="text-xs">±1 min</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">enter</kbd>
            <span className="text-xs">start/stop</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">esc</kbd>
            <span className="text-xs">reset</span>
          </div>
        </section>

        <section className="text-xs flex flex-row items-center justify-center border-t border-secondary p-4">
          <a
            href="https://kodemia.mx"
            target="__blank"
            className="flex flex-col sm:flex-row justify-center items-center gap-2"
          >
            Una herramienta creada por
            <img
              src="https://cdn.kodemia.mx/images/brand/white-imagotipo.svg"
              className="h-6"
              alt=""
            />
          </a>
        </section>
      </footer>
    </main>
  );
}
