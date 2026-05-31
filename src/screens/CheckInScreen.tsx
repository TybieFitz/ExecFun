import { checkInImage } from "../lib/checkInImage";
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
      <div className="mx-auto flex w-full max-w-md min-h-[min(50vh,28rem)] items-center justify-center">
        <img
          src={checkInImage}
          alt="Check-in reminder"
          className="w-full object-contain"
        />
      </div>
    </ScreenLayout>
  );
}
