import { StepButton } from "./StepButton";

type TaskCardProps = {
  name: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function TaskCard({
  name,
  quantity,
  onIncrease,
  onDecrease,
}: TaskCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface-raised px-5 py-4">
      <span className="text-lg font-medium text-text">{name}</span>
      <div className="flex items-center gap-3">
        <StepButton
          label="↓"
          onClick={onDecrease}
          disabled={quantity <= 0}
        />
        <span
          className="w-8 text-center text-2xl font-medium tabular-nums text-text"
          aria-live="polite"
        >
          {quantity}
        </span>
        <StepButton label="↑" onClick={onIncrease} />
      </div>
    </div>
  );
}
