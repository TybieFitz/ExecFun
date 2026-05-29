import { useState } from "react";
import { TaskChecklist } from "../components/TaskChecklist";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import {
  TASK_CHECKLISTS,
  initialChecklistState,
} from "../data/taskChecklists";
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
    window.setTimeout(() => onComplete(), 1000);
  }

  function toggleCheck(id: string) {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }

  let footer = null;
  if (!message) {
    if (skipConfirming) {
      footer = (
        <div className="flex flex-col gap-3">
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
      );
    } else {
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
        <p className="text-lg text-text-muted">{message}</p>
      ) : skipConfirming ? (
        <p className="max-w-sm py-2 text-lg leading-relaxed tracking-wide text-text/85">
          Skip this task?
        </p>
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
