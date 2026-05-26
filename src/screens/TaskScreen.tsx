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
  const [checks, setChecks] = useState(() => initialChecklistState(taskId));

  function finish(action: () => void, text: string) {
    action();
    setMessage(text);
    window.setTimeout(() => onComplete(), 1000);
  }

  function toggleCheck(id: string) {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }

  return (
    <ScreenLayout
      title={title}
      align="start"
      footer={
        message ? null : (
          <div className="flex flex-col gap-3">
            <SecondaryButton
              label="Skip"
              onClick={() => finish(onSkip, "Event skipped")}
            />
            <PrimaryButton
              label="Done"
              onClick={() => finish(onDone, "Completed.")}
            />
          </div>
        )
      }
    >
      {message ? (
        <p className="text-lg text-text-muted">{message}</p>
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
