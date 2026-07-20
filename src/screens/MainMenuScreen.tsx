import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type MainMenuScreenProps = {
  morningComplete: boolean;
  morningProgress: number;
  agendaComplete: boolean;
  agendaReady: boolean;
  agendaProgress: number;
  eveningComplete: boolean;
  eveningProgress: number;
  onMorning: () => void;
  onAgenda: () => void;
  onEvening: () => void;
  onNewDay: () => void;
};

function MenuButton({
  label,
  complete,
  ready,
  progress,
  onClick,
}: {
  label: string;
  complete?: boolean;
  ready?: boolean;
  progress: number;
  onClick: () => void;
}) {
  const progressWidth = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[4.75rem] w-full items-center justify-between overflow-hidden rounded-xl border px-6 py-5 text-left text-xl font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        complete
          ? "border-emerald-800/60 bg-emerald-950/35 text-emerald-100"
          : ready
            ? "border-yellow-300 bg-surface-raised text-yellow-200 hover:border-yellow-200"
          : "border-border bg-surface-raised text-text hover:border-accent/50"
      }`}
    >
      <span>{label}</span>
      {complete && (
        <span className="text-lg font-semibold" aria-hidden="true">
          ✓
        </span>
      )}
      {!complete && !ready && (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-border/60">
          <span
            className="block h-full bg-sky-300 transition-[width] duration-300 ease-out"
            style={{ width: progressWidth }}
          />
        </span>
      )}
    </button>
  );
}

export function MainMenuScreen({
  morningComplete,
  morningProgress,
  agendaComplete,
  agendaReady,
  agendaProgress,
  eveningComplete,
  eveningProgress,
  onMorning,
  onAgenda,
  onEvening,
  onNewDay,
}: MainMenuScreenProps) {
  return (
    <ScreenLayout
      title="Foghorn"
      showExit={false}
      centerMainContent
      footer={<SecondaryButton label="New Day" onClick={onNewDay} />}
    >
      <div className="flex flex-col gap-3">
        <MenuButton
          label="Morning Routine"
          complete={morningComplete}
          progress={morningProgress}
          onClick={onMorning}
        />
        <MenuButton
          label="Agenda"
          complete={agendaComplete}
          ready={agendaReady}
          progress={agendaProgress}
          onClick={onAgenda}
        />
        <MenuButton
          label="Evening Routine"
          complete={eveningComplete}
          progress={eveningProgress}
          onClick={onEvening}
        />
      </div>
    </ScreenLayout>
  );
}
