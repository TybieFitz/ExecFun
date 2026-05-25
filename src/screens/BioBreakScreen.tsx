import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import {
  BIO_BREAK_OPTIONS,
  type BioBreakChecks,
  type BioBreakOption,
} from "../types";

type BioBreakScreenProps = {
  checks: BioBreakChecks;
  onToggle: (option: BioBreakOption) => void;
  onNext: () => void;
};

export function BioBreakScreen({
  checks,
  onToggle,
  onNext,
}: BioBreakScreenProps) {
  return (
    <ScreenLayout
      title="Bio Break"
      align="start"
      footer={<PrimaryButton label="Next" onClick={onNext} />}
    >
      <ul className="flex flex-col gap-3">
        {BIO_BREAK_OPTIONS.map((option) => (
          <li key={option}>
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-surface-raised px-5 py-4">
              <input
                type="checkbox"
                checked={checks[option]}
                onChange={() => onToggle(option)}
                className="h-5 w-5 rounded border-border accent-accent"
              />
              <span className="text-lg text-text">{option}</span>
            </label>
          </li>
        ))}
      </ul>
    </ScreenLayout>
  );
}
