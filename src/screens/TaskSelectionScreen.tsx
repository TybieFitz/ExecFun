import { TaskCard } from "../components/TaskCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import {
  TASK_IDS,
  TASK_LABELS,
  type TaskId,
  type TaskQuantities,
} from "../types";

type TaskSelectionScreenProps = {
  quantities: TaskQuantities;
  onChange: (id: TaskId, quantity: number) => void;
  onNext: () => void;
};

export function TaskSelectionScreen({
  quantities,
  onChange,
  onNext,
}: TaskSelectionScreenProps) {
  const hasSelectedTasks = TASK_IDS.some((id) => quantities[id] > 0);

  return (
    <ScreenLayout
      title="Choose tasks"
      align="center"
      footer={
        <PrimaryButton
          label="Next"
          onClick={onNext}
          disabled={!hasSelectedTasks}
        />
      }
    >
      <div className="flex flex-col gap-3">
        {TASK_IDS.map((id) => (
          <TaskCard
            key={id}
            name={TASK_LABELS[id]}
            quantity={quantities[id]}
            onIncrease={() => onChange(id, quantities[id] + 1)}
            onDecrease={() => onChange(id, Math.max(0, quantities[id] - 1))}
          />
        ))}
      </div>
    </ScreenLayout>
  );
}
