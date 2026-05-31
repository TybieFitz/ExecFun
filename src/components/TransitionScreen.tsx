import { useEffect } from "react";
import { ScreenLayout } from "./ScreenLayout";
import { TRANSITION_MS } from "../lib/transition";

type TransitionScreenProps = {
  message: string;
  onComplete: () => void;
  durationMs?: number;
};

export function TransitionScreen({
  message,
  onComplete,
  durationMs = TRANSITION_MS,
}: TransitionScreenProps) {
  useEffect(() => {
    const id = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(id);
  }, [onComplete, durationMs]);

  return (
    <ScreenLayout title=" " align="start">
      <div className="flex flex-1 items-center justify-center">
        <p className="w-full text-center text-2xl text-text-muted sm:text-3xl">
          {message}
        </p>
      </div>
    </ScreenLayout>
  );
}
