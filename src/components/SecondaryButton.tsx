type SecondaryButtonProps = {
  label: string;
  onClick: () => void;
};

export function SecondaryButton({ label, onClick }: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-surface-raised px-6 py-4 text-lg font-medium text-text transition-colors duration-200 hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </button>
  );
}
