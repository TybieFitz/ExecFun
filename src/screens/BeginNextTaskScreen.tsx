import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type BeginNextTaskScreenProps = {
  onStart: () => void;
};

export function BeginNextTaskScreen({ onStart }: BeginNextTaskScreenProps) {
  return (
    <ScreenLayout
      title="Begin next task?"
      footer={<PrimaryButton label="Start" onClick={onStart} />}
    />
  );
}
