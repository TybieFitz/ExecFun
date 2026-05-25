import { CheckInScreen } from "../components/CheckInScreen";
import { PAIN_DESCRIPTIONS } from "../lib/scaleDescriptions";

type PainCheckInScreenProps = {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
};

export function PainCheckInScreen({
  value,
  onChange,
  onNext,
}: PainCheckInScreenProps) {
  return (
    <CheckInScreen
      title="How is your pain right now?"
      value={value}
      onChange={onChange}
      description={PAIN_DESCRIPTIONS[value]}
      onNext={onNext}
    />
  );
}
