import { StepButton } from "./StepButton";

const MIN = 1;
const MAX = 10;

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  description: string;
};

export function NumberStepper({
  value,
  onChange,
  description,
}: NumberStepperProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <StepButton
          label="↑"
          onClick={() => onChange(Math.min(MAX, value + 1))}
          disabled={value >= MAX}
        />
        <span
          className="text-7xl font-medium tabular-nums text-text sm:text-8xl"
          aria-live="polite"
        >
          {value}
        </span>
        <StepButton
          label="↓"
          onClick={() => onChange(Math.max(MIN, value - 1))}
          disabled={value <= MIN}
        />
      </div>
      <p className="min-h-[3rem] text-center text-lg text-text-muted">
        {description}
      </p>
    </div>
  );
}
