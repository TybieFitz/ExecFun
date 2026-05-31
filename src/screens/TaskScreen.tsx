import { useState } from "react";
import { TaskChecklist } from "../components/TaskChecklist";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
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
  onComplete: () => void;
};

export function TaskScreen({
  title,
  taskId,
  onDone,
  onSkip,
  onComplete,
}: TaskScreenProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [skipConfirming, setSkipConfirming] = useState(false);
  const [checks, setChecks] = useState(() => initialChecklistState(taskId));

  function finish(action: () => void, text: string) {
    action();
    setSkipConfirming(false);
    setMessage(text);
    window.setTimeout(() => onComplete(), TRANSITION_MS);
  }

  function toggleCheck(id: string) {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }

  let footer = null;
  if (!message && !skipConfirming) {
    footer = (
      <div className="flex flex-col gap-3">
        <SecondaryButton label="Skip" onClick={() => setSkipConfirming(true)} />
        <PrimaryButton
          label="Done"
          onClick={() => finish(onDone, "Completed.")}
        />
      </div>
    );
  }

  const confirmTone =
    skipConfirming && !message
      ? "bg-[#11151c] brightness-[0.98] saturate-[0.88] transition-[filter,background-color] duration-500 ease-out"
      : "";

  return (
    <ScreenLayout
      title={title}
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
            Skip this task?
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <SecondaryButton
              label="Cancel"
              onClick={() => setSkipConfirming(false)}
            />
            <button
              type="button"
              onClick={() => finish(onSkip, "Event skipped")}
              className="w-full rounded-xl border border-stone-500/35 bg-stone-950/40 px-6 py-4 text-lg font-medium text-stone-200 transition-colors duration-200 hover:border-stone-400/40 hover:bg-stone-950/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500/60"
            >
              Skip Task
            </button>
          </div>
        </div>
      ) : (
        <TaskChecklist
          root={TASK_CHECKLISTS[taskId]}
          checks={checks}
          onToggle={toggleCheck}
        />
      )}
    </ScreenLayout>
  );
}
