import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import type { PlaylistItem } from "../types";

type PlaylistScreenProps = {
  items: PlaylistItem[];
  onBack: () => void;
  onStart: () => void;
};

export function PlaylistScreen({ items, onBack, onStart }: PlaylistScreenProps) {
  return (
    <ScreenLayout
      title="Playlist"
      align="start"
      footer={
        <div className="flex flex-col gap-3">
          <SecondaryButton label="Back" onClick={onBack} />
          <PrimaryButton
            label="Start"
            onClick={onStart}
            disabled={items.length === 0}
          />
        </div>
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
