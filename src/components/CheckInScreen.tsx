import { NumberStepper } from "./NumberStepper";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenLayout } from "./ScreenLayout";

type CheckInScreenProps = {
  title: string;
  value: number;
  onChange: (value: number) => void;
  description: string;
  onNext: () => void;
};

export function CheckInScreen({
  title,
  value,
  onChange,
  description,
  onNext,
}: CheckInScreenProps) {
  return (
    <ScreenLayout
      title={title}
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
