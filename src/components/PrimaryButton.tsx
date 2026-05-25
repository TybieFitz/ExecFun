type PrimaryButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-accent px-6 py-4 text-lg font-medium text-surface transition-colors duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
