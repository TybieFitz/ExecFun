type StepButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export function StepButton({
  label,
  onClick,
  disabled,
  className = "",
}: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-xl border border-border bg-surface-raised text-text transition-colors duration-200 hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      >{label}
    </button>
  );
}