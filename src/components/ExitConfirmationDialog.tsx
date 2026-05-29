import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

type ExitConfirmationDialogProps = {
  onCancel: () => void;
  onReset: () => void;
};

export function ExitConfirmationDialog({
  onCancel,
  onReset,
}: ExitConfirmationDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface-raised p-6">
        <h2
          id="exit-dialog-title"
          className="mb-6 text-xl font-medium text-text"
        >
          Restart at Home?
        </h2>
        <div className="flex flex-col gap-3">
          <SecondaryButton label="Cancel" onClick={onCancel} />
          <PrimaryButton label="Reset" onClick={onReset} />
        </div>
      </div>
    </div>
  );
}
