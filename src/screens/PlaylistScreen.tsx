import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import type { PlaylistItem } from "../types";

type PlaylistScreenProps = {
  items: PlaylistItem[];
  onBack: () => void;
  onSet: () => void;
  onStart: () => void;
};

export function PlaylistScreen({
  items,
  onBack,
  onSet,
  onStart,
}: PlaylistScreenProps) {
  return (
    <ScreenLayout
      title="Agenda Preview"
      align="start"
      footer={
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <SecondaryButton label="Back" onClick={onBack} />
            <button
              type="button"
              onClick={onSet}
              disabled={items.length === 0}
              className="w-full rounded-xl bg-amber-300 px-6 py-4 text-lg font-medium text-surface transition-colors duration-200 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Set
            </button>
          </div>
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
                *
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
