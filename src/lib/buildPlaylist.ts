import {
  PLAYLIST_ORDER,
  PLAYLIST_TASK_LABELS,
  type AdultingSelection,
  type DirtiesOption,
  type HouseSelection,
  type LaundryOption,
  type PlaylistItem,
  type SelectableTaskId,
  type TaskId,
  type TaskQuantities,
} from "../types";

type SelectionCount = Partial<Record<SelectableTaskId, number>>;

export function buildPlaylist(quantities: TaskQuantities): PlaylistItem[] {
  const counts: SelectionCount = {
    laundry: quantities.laundry.length,
    house: quantities.house.length,
    dirties: quantities.dirties.length,
    dishes: quantities.dishes,
    declutter: quantities.declutter,
    adulting: quantities.adulting.length,
  };

  const active = PLAYLIST_ORDER.filter((id) => (counts[id] ?? 0) > 0);
  if (active.length === 0) return [];

  const maxPasses = Math.max(...active.map((id) => counts[id] ?? 0));
  const instanceCount: Partial<Record<SelectableTaskId, number>> = {};
  const result: PlaylistItem[] = [];
  const laundryTotals = countLaundryOptions(quantities.laundry);
  const laundrySeen: Partial<Record<LaundryOption, number>> = {};
  const housePlainTotals = countPlainHouseOptions(quantities.house);
  const housePlainSeen: Partial<Record<HouseSelection["option"], number>> = {};
  const dirtiesTotals = countDirtiesOptions(quantities.dirties);
  const dirtiesSeen: Partial<Record<DirtiesOption, number>> = {};
  const plainAdultingTotal = countPlainAdulting(quantities.adulting);
  let plainAdultingSeen = 0;

  for (let pass = 0; pass < maxPasses; pass++) {
    for (const id of PLAYLIST_ORDER) {
      const qty = counts[id] ?? 0;
      if (qty <= 0 || pass >= qty) continue;

      const index = (instanceCount[id] ?? 0) + 1;
      instanceCount[id] = index;

      if (id === "laundry") {
        const option = quantities.laundry[pass];
        const optionIndex = (laundrySeen[option] ?? 0) + 1;
        laundrySeen[option] = optionIndex;
        const suffix = laundryTotals[option] > 1 ? ` ${optionIndex}` : "";
        addPlaylistItem(
          result,
          "laundryWash",
          `Wash ${option}${suffix}`,
          `laundryWash-${option}-${optionIndex}`,
          pass + 1,
        );
        addPlaylistItem(
          result,
          "laundryDry",
          `Dry ${option}${suffix}`,
          `laundryDry-${option}-${optionIndex}`,
          pass + 1,
        );
      } else if (id === "house") {
        const selection = quantities.house[pass];
        const label = buildHouseLabel(
          selection,
          housePlainTotals,
          housePlainSeen,
        );
        addPlaylistItem(result, "house", label, `house-${pass + 1}`, pass + 1);
      } else if (id === "dirties") {
        const option = quantities.dirties[pass];
        const optionIndex = (dirtiesSeen[option] ?? 0) + 1;
        dirtiesSeen[option] = optionIndex;
        const label =
          dirtiesTotals[option] > 1 ? `${option} ${optionIndex}` : option;
        addPlaylistItem(
          result,
          "dirties",
          label,
          `dirties-${option}-${optionIndex}`,
          pass + 1,
        );
      } else if (id === "adulting") {
        const selection = quantities.adulting[pass];
        const detail = selection.detail.trim();
        let label = "Adulting";
        if (detail) {
          label = `Adulting ${detail}`;
        } else if (plainAdultingTotal > 1) {
          plainAdultingSeen += 1;
          label = `Adulting ${plainAdultingSeen}`;
        }
        addPlaylistItem(result, "adulting", label, `adulting-${pass + 1}`, pass + 1);
      } else {
        addNumberedPlaylistItem(result, id, index, qty, pass + 1);
      }
    }
  }

  return result;
}

function addPlaylistItem(
  result: PlaylistItem[],
  taskId: TaskId,
  label: string,
  id: string,
  round: number,
) {
  result.push({ id, taskId, label, round });
}

function addNumberedPlaylistItem(
  result: PlaylistItem[],
  taskId: TaskId,
  index: number,
  quantity: number,
  round: number,
) {
  const base = PLAYLIST_TASK_LABELS[taskId];
  const label = quantity > 1 ? `${base} ${index}` : base;
  addPlaylistItem(result, taskId, label, `${taskId}-${index}`, round);
}

function countLaundryOptions(options: LaundryOption[]) {
  return options.reduce<Record<LaundryOption, number>>(
    (counts, option) => ({ ...counts, [option]: counts[option] + 1 }),
    { Clothes: 0, Towels: 0, Sheets: 0 },
  );
}

function countDirtiesOptions(options: DirtiesOption[]) {
  return options.reduce<Record<DirtiesOption, number>>(
    (counts, option) => ({ ...counts, [option]: counts[option] + 1 }),
    { "Empty Cans": 0, Catships: 0, Fridge: 0 },
  );
}

function countPlainHouseOptions(selections: HouseSelection[]) {
  return selections.reduce<Record<HouseSelection["option"], number>>(
    (counts, selection) => {
      if (selection.detail.trim()) return counts;
      return {
        ...counts,
        [selection.option]: counts[selection.option] + 1,
      };
    },
    { Assemble: 0, Install: 0, Organize: 0 },
  );
}

function countPlainAdulting(selections: AdultingSelection[]) {
  return selections.filter((selection) => !selection.detail.trim()).length;
}

function buildHouseLabel(
  selection: HouseSelection,
  plainTotals: Record<HouseSelection["option"], number>,
  plainSeen: Partial<Record<HouseSelection["option"], number>>,
) {
  const detail = selection.detail.trim();
  if (detail) return `${selection.option} ${detail}`;

  const index = (plainSeen[selection.option] ?? 0) + 1;
  plainSeen[selection.option] = index;
  return plainTotals[selection.option] > 1
    ? `${selection.option} ${index}`
    : selection.option;
}
