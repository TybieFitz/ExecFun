import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import type { PlaylistItem } from "../types";

type ReviewScreenProps = {
  items: PlaylistItem[];
  completedTasks: Set<number>;
  skippedTasks: Set<number>;
  onReturnToMainMenu: () => void;
};

function rowStatus(index: number, completed: Set<number>, skipped: Set<number>) {
  if (completed.has(index)) return "completed";
  if (skipped.has(index)) return "skipped";
  return "default";
}

export function ReviewScreen({
  items,
  completedTasks,
  skippedTasks,
  onReturnToMainMenu,
}: ReviewScreenProps) {
  return (
    <ScreenLayout
      title="Agenda Review"
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
          {items.map((item, index) => {
            const status = rowStatus(index, completedTasks, skippedTasks);

            return (
              <li
                key={`${item.taskId}-${index}`}
                className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-lg ${
                  status === "completed"
                    ? "border-emerald-800/50 bg-emerald-950/25 text-emerald-100"
                    : status === "skipped"
                      ? "border-border bg-surface-raised text-text-muted opacity-60 grayscale"
                      : "border-border bg-surface-raised text-text"
                }`}
              >
                <span
                  className="w-8 shrink-0 text-center text-xl leading-none"
                  aria-hidden="true"
                >
                  {status === "completed" ? "✔" : status === "skipped" ? "—" : ""}
                </span>
                <span className="min-w-0 flex-1 text-left">{item.label}</span>
              </li>
            );
          })}
        </ol>
      )}
    </ScreenLayout>
  );
}
