import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type AgendaCompleteScreenProps = {
  onReview: () => void;
};

export function AgendaCompleteScreen({ onReview }: AgendaCompleteScreenProps) {
  return (
    <ScreenLayout
      title="Agenda complete"
      footer={<PrimaryButton label="Review" onClick={onReview} />}
    />
  );
}
