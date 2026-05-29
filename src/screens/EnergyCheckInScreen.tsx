import { CheckInScreen } from "../components/CheckInScreen";
import { ENERGY_DESCRIPTIONS } from "../lib/scaleDescriptions";

type EnergyCheckInScreenProps = {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
};

export function EnergyCheckInScreen({
  value,
  onChange,
  onNext,
}: EnergyCheckInScreenProps) {
  return (
    <CheckInScreen
      title="How is your energy right now?"
      step={3}
      value={value}
      onChange={onChange}
      description={ENERGY_DESCRIPTIONS[value]}
      onNext={onNext}
    />
  );
}
