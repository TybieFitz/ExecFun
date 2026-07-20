import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

type ConfirmationDialogProps = {
  title: string;
  cancelLabel?: string;
  confirmLabel: string;
  buttonLayout?: "column" | "row";
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  title,
  cancelLabel = "Cancel",
  confirmLabel,
  buttonLayout = "column",
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface-raised p-6">
        <h2
          id="confirmation-dialog-title"
          className="mb-6 text-xl font-medium text-text"
        >
          {title}
        </h2>
        <div
          className={
            buttonLayout === "row" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"
          }
        >
          <SecondaryButton label={cancelLabel} onClick={onCancel} />
          <PrimaryButton label={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
