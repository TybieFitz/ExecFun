import { useState } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import { TRANSITION_MS } from "../lib/transition";
import type { RoutineTask } from "../types";

type RoutineScreenProps = {
  title: string;
  task: RoutineTask;
  canSnooze: boolean;
  onDone: () => void;
  onSkip: () => void;
  onSnooze: () => void;
};

export function RoutineScreen({
  title,
  task,
  canSnooze,
  onDone,
  onSkip,
  onSnooze,
}: RoutineScreenProps) {
  const [displayTitle] = useState(title);
  const [displayTask] = useState(task);
  const [message, setMessage] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((task.checklist ?? []).map((item) => [item, false])),
  );

  function finish(action: () => void, text: string) {
    setMessage(text);
    window.setTimeout(() => {
      action();
    }, TRANSITION_MS);
  }

  const footer = !message && (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {canSnooze ? (
          <SecondaryButton
            label="Snooze"
            onClick={() => finish(onSnooze, "Snoozed")}
          />
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-dashed border-border/80 bg-transparent px-6 py-4 text-lg font-medium text-text-muted/70"
          >
            Last Task
          </button>
        )}
        <PrimaryButton label="Done" onClick={() => finish(onDone, "Complete")} />
      </div>
      <SecondaryButton label="Skip" onClick={() => finish(onSkip, "Skipped")} />
    </div>
  );

  return (
    <ScreenLayout title={displayTitle} align="start" footer={footer}>
      {message ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="w-full text-center text-2xl text-text-muted sm:text-3xl">
            {message}
          </p>
        </div>
      ) : (
        <RoutineTaskBody
          task={displayTask}
          checks={checks}
          onToggle={(item) =>
            setChecks((current) => ({ ...current, [item]: !current[item] }))
          }
        />
      )}
    </ScreenLayout>
  );
}

function RoutineTaskBody({
  task,
  checks,
  onToggle,
}: {
  task: RoutineTask;
  checks: Record<string, boolean>;
  onToggle: (item: string) => void;
}) {
  if (!task.checklist || task.checklist.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="w-full text-center text-3xl font-medium text-text">
          {task.label}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {task.checklist.map((item) => (
        <label
          key={item}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-surface-raised px-5 py-4"
        >
          <input
            type="checkbox"
            checked={checks[item] ?? false}
            onChange={() => onToggle(item)}
            className="h-5 w-5 shrink-0 rounded border-border accent-accent"
          />
          <span className="text-lg text-text">{item}</span>
        </label>
      ))}
    </div>
  );
}
