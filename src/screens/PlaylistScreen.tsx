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
        <ul className="flex flex-col divide-y divide-border/50">
          {items.map((item, index) => (
            <li
              key={`${item.taskId}-${index}`}
              className="flex items-baseline gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <span
                className="w-6 shrink-0 text-center text-sm text-text-muted"
                aria-hidden="true"
              >
                •
              </span>
              <span className="min-w-0 flex-1 text-left text-lg text-text">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ScreenLayout>
  );
}
