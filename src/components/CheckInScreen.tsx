import { CheckInProgress } from "./CheckInProgress";
import { NumberStepper } from "./NumberStepper";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenLayout } from "./ScreenLayout";

type CheckInScreenProps = {
  title: string;
  step: 1 | 2 | 3;
  value: number;
  onChange: (value: number) => void;
  description: string;
  onNext: () => void;
};

export function CheckInScreen({
  title,
  step,
  value,
  onChange,
  description,
  onNext,
}: CheckInScreenProps) {
  return (
    <ScreenLayout
      title={title}
      headerBelow={<CheckInProgress step={step} />}
      footer={<PrimaryButton label="Next" onClick={onNext} />}
    >
      <NumberStepper
        value={value}
        onChange={onChange}
        description={description}
      />
    </ScreenLayout>
  );
}
