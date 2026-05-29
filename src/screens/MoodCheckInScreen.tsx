import { CheckInScreen } from "../components/CheckInScreen";
import { MOOD_DESCRIPTIONS } from "../lib/scaleDescriptions";

type MoodCheckInScreenProps = {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
};

export function MoodCheckInScreen({
  value,
  onChange,
  onNext,
}: MoodCheckInScreenProps) {
  return (
    <CheckInScreen
      title="How is your mood right now?"
      value={value}
      onChange={onChange}
      description={MOOD_DESCRIPTIONS[value]}
      onNext={onNext}
    />
  );
}
