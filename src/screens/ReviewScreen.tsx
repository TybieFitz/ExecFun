import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import type { PlaylistItem } from "../types";

type ReviewScreenProps = {
  items: PlaylistItem[];
  onReturnToMainMenu: () => void;
};

export function ReviewScreen({ items, onReturnToMainMenu }: ReviewScreenProps) {
  return (
    <ScreenLayout
      title="Review"
      align="start"
      footer={
        <PrimaryButton
          label="Return to Main Menu"
          onClick={onReturnToMainMenu}
        />
      }
    >
      {items.length === 0 ? (
        <p className="text-lg text-text-muted">No tasks selected.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={`${item.taskId}-${index}`}
              className="rounded-xl border border-border bg-surface-raised px-5 py-4 text-lg text-text"
            >
              {item.label}
            </li>
          ))}
        </ol>
      )}
    </ScreenLayout>
  );
}
