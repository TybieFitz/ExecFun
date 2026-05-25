type StepButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function StepButton({ label, onClick, disabled }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface-raised text-xl text-text transition-colors duration-200 hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
