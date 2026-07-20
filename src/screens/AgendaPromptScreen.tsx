import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type AgendaPromptScreenProps = {
  onResume: () => void;
  onNewAgenda: () => void;
  onBack: () => void;
};

export function AgendaPromptScreen({
  onResume,
  onNewAgenda,
  onBack,
}: AgendaPromptScreenProps) {
  return (
    <ScreenLayout
      title="Agenda"
      showExit={false}
      centerMainContent
      footer={
        <div className="flex flex-col gap-3">
          <SecondaryButton label="Back" onClick={onBack} />
          <SecondaryButton label="Resume Agenda" onClick={onResume} />
          <PrimaryButton label="New Agenda" onClick={onNewAgenda} />
        </div>
      }
    >
      <div />
    </ScreenLayout>
  );
}
