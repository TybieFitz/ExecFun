import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type AgendaIntroScreenProps = {
  onChooseTasks: () => void;
};

export function AgendaIntroScreen({ onChooseTasks }: AgendaIntroScreenProps) {
  return (
    <ScreenLayout
      title="Your agenda"
      footer={<PrimaryButton label="Choose Tasks" onClick={onChooseTasks} />}
    >
      <p className="max-w-md text-lg leading-relaxed text-text-muted">
        Next you can pick tasks that fit how you feel today.
      </p>
    </ScreenLayout>
  );
}
