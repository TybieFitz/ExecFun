import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <ScreenLayout
      title="Adaptive Task Companion"
      showExit={false}
      centerHeaderAndContent
      footer={<PrimaryButton label="Start Day" onClick={onStart} />}
    >
      <p className="mx-auto max-w-md text-center text-lg leading-relaxed text-text-muted">
        A short check-in before you choose what to work on today.
      </p>
    </ScreenLayout>
  );
}
