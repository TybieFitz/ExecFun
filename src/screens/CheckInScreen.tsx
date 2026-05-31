import checkInImage from "../assets/check-in.png";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";

type CheckInScreenProps = {
  onStartNextTask: () => void;
};

export function CheckInScreen({ onStartNextTask }: CheckInScreenProps) {
  return (
    <ScreenLayout
      title="Check-In"
      align="start"
      footer={
        <PrimaryButton label="Start Next Task" onClick={onStartNextTask} />
      }
    >
      <img
        src={checkInImage}
        alt="Check-in reminder"
        className="mx-auto w-full max-w-md object-contain"
      />
    </ScreenLayout>
  );
}
