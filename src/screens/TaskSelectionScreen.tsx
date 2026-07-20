import { useState } from "react";
import type { ReactNode } from "react";
import { TaskCard } from "../components/TaskCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { ScreenLayout } from "../components/ScreenLayout";
import { StepButton } from "../components/StepButton";
import {
  TASK_LABELS,
  type AdultingSelection,
  type DirtiesOption,
  type HouseOption,
  type HouseSelection,
  type LaundryOption,
  type SelectableTaskId,
  type TaskQuantities,
} from "../types";

const LAUNDRY_OPTIONS: LaundryOption[] = ["Clothes", "Towels", "Sheets"];
const HOUSE_OPTIONS: HouseOption[] = ["Assemble", "Install", "Organize"];
const DIRTIES_OPTIONS: DirtiesOption[] = ["Empty Cans", "Catships", "Fridge"];

type TaskSelectionScreenProps = {
  quantities: TaskQuantities;
  onChange: <T extends SelectableTaskId>(
    id: T,
    value: TaskQuantities[T],
  ) => void;
  onNext: () => void;
};

export function TaskSelectionScreen({
  quantities,
  onChange,
  onNext,
}: TaskSelectionScreenProps) {
  const [openMenu, setOpenMenu] = useState<
    "laundry" | "house" | "dirties" | null
  >(null);
  const [housePrompt, setHousePrompt] = useState<HouseOption | null>(null);
  const [houseDetail, setHouseDetail] = useState("");
  const [adultingPromptOpen, setAdultingPromptOpen] = useState(false);
  const [adultingDetail, setAdultingDetail] = useState("");
  const hasSelectedTasks =
    quantities.laundry.length > 0 ||
    quantities.house.length > 0 ||
    quantities.dirties.length > 0 ||
    quantities.dishes > 0 ||
    quantities.declutter > 0 ||
    quantities.adulting.length > 0;

  function addLaundry(option: LaundryOption) {
    onChange("laundry", [...quantities.laundry, option]);
    setOpenMenu(null);
  }

  function addDirties(option: DirtiesOption) {
    onChange("dirties", [...quantities.dirties, option]);
    setOpenMenu(null);
  }

  function addHouse() {
    if (!housePrompt) return;
    const selection: HouseSelection = {
      option: housePrompt,
      detail: houseDetail.trim(),
    };
    onChange("house", [...quantities.house, selection]);
    setHousePrompt(null);
    setHouseDetail("");
    setOpenMenu(null);
  }

  function addAdulting() {
    const selection: AdultingSelection = {
      detail: adultingDetail.trim(),
    };
    onChange("adulting", [...quantities.adulting, selection]);
    setAdultingPromptOpen(false);
    setAdultingDetail("");
  }

  return (
    <ScreenLayout
      title="Create Agenda"
      centerMainContent
      footer={
        <PrimaryButton
          label="Next"
          onClick={onNext}
          disabled={!hasSelectedTasks}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <ExpandableAgendaCard
          name={TASK_LABELS.laundry}
          quantity={quantities.laundry.length}
          open={openMenu === "laundry"}
          onIncrease={() =>
            setOpenMenu((current) => current === "laundry" ? null : "laundry")
          }
          onDecrease={() => {
            onChange("laundry", quantities.laundry.slice(0, -1));
            if (quantities.laundry.length <= 1) setOpenMenu(null);
          }}
        >
          <OptionGrid
            options={LAUNDRY_OPTIONS}
            onSelect={(option) => addLaundry(option)}
          />
        </ExpandableAgendaCard>

        <ExpandableAgendaCard
          name={TASK_LABELS.house}
          quantity={quantities.house.length}
          open={openMenu === "house"}
          onIncrease={() =>
            setOpenMenu((current) => current === "house" ? null : "house")
          }
          onDecrease={() => {
            onChange("house", quantities.house.slice(0, -1));
            if (quantities.house.length <= 1) setOpenMenu(null);
          }}
        >
          <OptionGrid
            options={HOUSE_OPTIONS}
            onSelect={(option) => {
              setHousePrompt(option);
              setHouseDetail("");
            }}
          />
        </ExpandableAgendaCard>

        <TaskCard
          name={TASK_LABELS.dishes}
          quantity={quantities.dishes}
          onIncrease={() => onChange("dishes", quantities.dishes + 1)}
          onDecrease={() => onChange("dishes", Math.max(0, quantities.dishes - 1))}
        />
        <TaskCard
          name={TASK_LABELS.declutter}
          quantity={quantities.declutter}
          onIncrease={() => onChange("declutter", quantities.declutter + 1)}
          onDecrease={() =>
            onChange("declutter", Math.max(0, quantities.declutter - 1))
          }
        />
        <ExpandableAgendaCard
          name={TASK_LABELS.dirties}
          quantity={quantities.dirties.length}
          open={openMenu === "dirties"}
          onIncrease={() =>
            setOpenMenu((current) => current === "dirties" ? null : "dirties")
          }
          onDecrease={() => {
            onChange("dirties", quantities.dirties.slice(0, -1));
            if (quantities.dirties.length <= 1) setOpenMenu(null);
          }}
        >
          <OptionGrid
            options={DIRTIES_OPTIONS}
            onSelect={(option) => addDirties(option)}
          />
        </ExpandableAgendaCard>
        <ExpandableAgendaCard
          name={TASK_LABELS.adulting}
          quantity={quantities.adulting.length}
          open={false}
          onIncrease={() => setAdultingPromptOpen(true)}
          onDecrease={() => {
            onChange("adulting", quantities.adulting.slice(0, -1));
          }}
        >
          <div />
        </ExpandableAgendaCard>
      </div>

      {(housePrompt || adultingPromptOpen) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agenda-text-dialog-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface-raised p-6">
            <h2
              id="agenda-text-dialog-title"
              className="mb-4 text-xl font-medium text-text"
            >
              {housePrompt ?? "Adulting"}
            </h2>
            <input
              type="text"
              value={housePrompt ? houseDetail : adultingDetail}
              onChange={(event) =>
                housePrompt
                  ? setHouseDetail(event.target.value)
                  : setAdultingDetail(event.target.value)
              }
              autoFocus
              className="mb-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-lg text-text outline-none focus:border-accent"
            />
            <div className="flex flex-col gap-3">
              <SecondaryButton
                label="Back"
                onClick={() => {
                  setHousePrompt(null);
                  setHouseDetail("");
                  setAdultingPromptOpen(false);
                  setAdultingDetail("");
                }}
              />
              <PrimaryButton
                label="Add"
                onClick={housePrompt ? addHouse : addAdulting}
              />
            </div>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
}

function ExpandableAgendaCard({
  name,
  quantity,
  open,
  onIncrease,
  onDecrease,
  children,
}: {
  name: string;
  quantity: number;
  open: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised">
      <div className="flex min-h-28 w-full items-center justify-between px-6 py-6 text-left">
        <div className="flex items-center gap-4">
          <span
            className="w-10 text-center text-3xl font-medium tabular-nums text-text"
            aria-live="polite"
          >
            {quantity}
          </span>
          <span className="text-2xl font-medium text-text">{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <StepButton
            label="-"
            onClick={onDecrease}
            disabled={quantity <= 0}
            className="h-8 w-8 text-xl"
          />
          <StepButton label="+" onClick={onIncrease} className="h-8 w-8 text-xl" />
        </div>
      </div>
      {open && <div className="border-t border-border p-3">{children}</div>}
    </div>
  );
}

function OptionGrid<T extends string>({
  options,
  onSelect,
}: {
  options: T[];
  onSelect: (option: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-left text-lg font-medium text-text transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
