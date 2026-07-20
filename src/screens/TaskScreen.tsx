import { useState } from "react";
import { TaskChecklist } from "../components/TaskChecklist";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import { StepButton } from "../components/StepButton";
import {
  TASK_CHECKLISTS,
  initialChecklistState,
} from "../data/taskChecklists";
import { TRANSITION_MS } from "../lib/transition";
import type { TaskId } from "../types";

type TaskScreenProps = {
  title: string;
  taskId: TaskId;
  onDone: () => void;
  onSkip: () => void;
  canSnooze: boolean;
  snoozeDisabledLabel: string;
  houseProgress?: number;
  onHouseProgressChange?: (progress: number) => void;
  onSnooze: () => void;
  onComplete: () => void;
};

export function TaskScreen({
  title,
  taskId,
  onDone,
  onSkip,
  canSnooze,
  snoozeDisabledLabel,
  houseProgress = 0,
  onHouseProgressChange,
  onSnooze,
  onComplete,
}: TaskScreenProps) {
  const [displayTitle] = useState(title);
  const [displayTaskId] = useState(taskId);
  const [message, setMessage] = useState<string | null>(null);
  const [skipConfirming, setSkipConfirming] = useState(false);
  const [checks, setChecks] = useState(() => initialChecklistState(displayTaskId));

  function finish(action: () => void, text: string) {
    action();
    setSkipConfirming(false);
    setMessage(text);
    window.setTimeout(() => onComplete(), TRANSITION_MS);
  }

  function toggleCheck(id: string) {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }

  function adjustHouseProgress(delta: number) {
    onHouseProgressChange?.(Math.max(0, Math.min(100, houseProgress + delta)));
  }

  let footer = null;
  if (!message && !skipConfirming) {
    footer = (
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
              {snoozeDisabledLabel}
            </button>
          )}
          <PrimaryButton
            label="Done"
            onClick={() => finish(onDone, "Complete")}
          />
        </div>
        <SecondaryButton label="Skip" onClick={() => setSkipConfirming(true)} />
      </div>
    );
  }

  const confirmTone =
    skipConfirming && !message
      ? "bg-[#11151c] brightness-[0.98] saturate-[0.88] transition-[filter,background-color] duration-500 ease-out"
      : "";

  return (
    <ScreenLayout
      title={displayTitle}
      align="start"
      footer={footer}
      rootClassName={confirmTone}
    >
      {message ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="w-full text-center text-2xl text-text-muted sm:text-3xl">
            {message}
          </p>
        </div>
      ) : skipConfirming ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-2">
          <p className="max-w-sm text-center text-xl leading-relaxed text-text/90 sm:text-2xl">
            Skip task?
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <SecondaryButton
              label="Cancel"
              onClick={() => setSkipConfirming(false)}
            />
            <button
              type="button"
              onClick={() => finish(onSkip, "Skipped")}
              className="w-full rounded-xl border border-stone-500/35 bg-stone-950/40 px-6 py-4 text-lg font-medium text-stone-200 transition-colors duration-200 hover:border-stone-400/40 hover:bg-stone-950/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500/60"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <TaskBody
          taskId={displayTaskId}
          checks={checks}
          houseProgress={houseProgress}
          onAdjustHouseProgress={adjustHouseProgress}
          onToggle={toggleCheck}
        />
      )}
    </ScreenLayout>
  );
}

function TaskBody({
  taskId,
  checks,
  houseProgress,
  onAdjustHouseProgress,
  onToggle,
}: {
  taskId: TaskId;
  checks: Record<string, boolean>;
  houseProgress: number;
  onAdjustHouseProgress: (delta: number) => void;
  onToggle: (id: string) => void;
}) {
  if (taskId === "house") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-2">
        <div className="h-4 w-full max-w-sm overflow-hidden rounded-full bg-border/70">
          <div
            className="h-full rounded-full bg-emerald-400 transition-[width] duration-200 ease-out"
            style={{ width: `${houseProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-5">
          <StepButton
            label="-"
            onClick={() => onAdjustHouseProgress(-10)}
            disabled={houseProgress <= 0}
            className="h-12 w-12 text-2xl"
          />
          <span className="w-20 text-center text-2xl font-medium tabular-nums text-text">
            {houseProgress}%
          </span>
          <StepButton
            label="+"
            onClick={() => onAdjustHouseProgress(10)}
            disabled={houseProgress >= 100}
            className="h-12 w-12 text-2xl"
          />
        </div>
      </div>
    );
  }

  if (
    taskId === "laundryWash" ||
    taskId === "laundryDry" ||
    taskId === "dishes" ||
    taskId === "dirties"
  ) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <DopamineCircle />
      </div>
    );
  }

  return (
    <TaskChecklist
      root={TASK_CHECKLISTS[taskId]}
      checks={checks}
      onToggle={onToggle}
    />
  );
}

function DopamineCircle() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      type="button"
      aria-label="Toggle task marker"
      onClick={() => setChecked((current) => !current)}
      className={`flex h-28 w-28 items-center justify-center rounded-full border-4 text-5xl font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        checked
          ? "border-emerald-500 bg-emerald-950/35 text-emerald-300"
          : "border-text-muted/60 bg-transparent text-transparent"
      }`}
    >
      ✓
    </button>
  );
}
