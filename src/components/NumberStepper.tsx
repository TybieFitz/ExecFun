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
    <div className="flex w-full flex-col items-center gap-8">
      <div className="grid w-full max-w-md grid-cols-[1fr_auto] items-center gap-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="text-8xl font-medium leading-none tabular-nums text-text sm:text-9xl"
            aria-live="polite"
          >
            {value}
          </span>

          <p className="mt-4 min-h-[3rem] text-center text-3xl leading-tight text-text-muted">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <StepButton
            label="+"
            onClick={() => onChange(Math.min(MAX, value + 1))}
            disabled={value >= MAX}
            className="h-28 w-28 text-5xl"
          />

          <StepButton
            label="−"
            onClick={() => onChange(Math.max(MIN, value - 1))}
            disabled={value <= MIN}
            className="h-28 w-28 text-5xl"
          />
        </div>
      </div>
    </div>
  );
}