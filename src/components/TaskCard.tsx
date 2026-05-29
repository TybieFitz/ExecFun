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
    //<div className="flex items-center justify-between rounded-xl border border-border bg-surface-raised px-5 py-4">
    <div className="flex min-h-28 items-center justify-between rounded-xl border border-border bg-surface-raised px-6 py-6">
      <div className="flex items-center gap-4">
        <span
          className="w-10 text-center text-3xl font-medium tabular-nums text-text"
          aria-live="polite"
        >
          {quantity}
        </span>

        <span className="text-2xl font-medium text-text">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <StepButton
          label="−"
          onClick={onDecrease}
          disabled={quantity <= 0}
          className="h-8 w-8 text-xl"
          //className="h-12 w-12 text-lg"
        />

        <StepButton
          label="+"
          onClick={onIncrease}
          className="h-8 w-8 text-xl"
        />
      </div>
    </div>
  );
}