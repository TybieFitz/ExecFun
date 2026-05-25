import { useState } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type TaskScreenProps = {
  title: string;
  onDone: () => void;
  onSkip: () => void;
  onComplete: () => void;
};

export function TaskScreen({
  title,
  onDone,
  onSkip,
  onComplete,
}: TaskScreenProps) {
  const [message, setMessage] = useState<string | null>(null);

  function finish(action: () => void, text: string) {
    action();
    setMessage(text);
    window.setTimeout(() => onComplete(), 1000);
  }

  return (
    <ScreenLayout
      title={title}
      footer={
        message ? null : (
          <div className="flex flex-col gap-3">
            <SecondaryButton
              label="Skip"
              onClick={() => finish(onSkip, "Event skipped")}
            />
            <PrimaryButton
              label="Done"
              onClick={() => finish(onDone, "Completed.")}
            />
          </div>
        )
      }
    >
      {message ? (
        <p className="text-lg text-text-muted">{message}</p>
      ) : (
        <p className="text-lg text-text-muted">Task flow will go here.</p>
      )}
    </ScreenLayout>
  );
}
