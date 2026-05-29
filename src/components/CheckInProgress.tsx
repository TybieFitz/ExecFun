type CheckInProgressProps = {
  step: 1 | 2 | 3;
};

const STEPS = 3;

export function CheckInProgress({ step }: CheckInProgressProps) {
  return (
    <div
      className="mt-4 flex gap-2"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={STEPS}
      aria-label={`Check-in step ${step} of ${STEPS}`}
    >
      {Array.from({ length: STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-sm ${
            i < step ? "bg-accent/70" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}
