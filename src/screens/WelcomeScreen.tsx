import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <ScreenLayout
      title="Foghorn"
      titleClassName="text-5xl sm:text-6xl"
      showExit={false}
      centerHeaderAndContent
      footer={<PrimaryButton label="Start Day" onClick={onStart} />}
    />
  );
}
