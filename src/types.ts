export type Screen =
  | "menu"
  | "agendaPrompt"
  | "welcome"
  | "tasks"
  | "playlist"
  | "task"
  | "checkIn"
  | "agendaComplete"
  | "review"
  | "routine";

export type AgendaScreen =
  | "tasks"
  | "playlist"
  | "task"
  | "checkIn"
  | "agendaComplete"
  | "review";

export type RoutineId = "morning" | "evening";

export type RoutineTask = {
  id: string;
  label: string;
  checklist?: string[];
};

export type TaskId =
  | "laundryWash"
  | "laundryDry"
  | "house"
  | "dirties"
  | "dishes"
  | "declutter"
  | "adulting";

export type SelectableTaskId =
  | "laundry"
  | "house"
  | "dirties"
  | "dishes"
  | "declutter"
  | "adulting";

export type LaundryOption = "Clothes" | "Towels" | "Sheets";
export type HouseOption = "Assemble" | "Install" | "Organize";
export type DirtiesOption = "Empty Cans" | "Catships" | "Fridge";

export type HouseSelection = {
  option: HouseOption;
  detail: string;
};

export type AdultingSelection = {
  detail: string;
};

export type PlaylistItem = {
  id: string;
  taskId: TaskId;
  label: string;
  round: number;
};

/** Round-robin pass order for playlist generation */
export const PLAYLIST_ORDER: SelectableTaskId[] = [
  "laundry",
  "house",
  "dishes",
  "declutter",
  "dirties",
  "adulting",
];

export type TaskQuantities = {
  laundry: LaundryOption[];
  house: HouseSelection[];
  dirties: DirtiesOption[];
  dishes: number;
  declutter: number;
  adulting: AdultingSelection[];
};

export const TASK_IDS: SelectableTaskId[] = [
  "laundry",
  "house",
  "dishes",
  "declutter",
  "dirties",
  "adulting",
];

export const TASK_LABELS: Record<SelectableTaskId, string> = {
  laundry: "Laundry",
  house: "House",
  dirties: "Dirties",
  dishes: "Dishes",
  declutter: "Declutter",
  adulting: "Adulting",
};

export const PLAYLIST_TASK_LABELS: Record<TaskId, string> = {
  laundryWash: "Laundry Wash",
  laundryDry: "Laundry Dry",
  house: "House",
  dirties: "Dirties",
  dishes: "Dishes",
  declutter: "Declutter",
  adulting: "Adulting",
};

export const initialTaskQuantities: TaskQuantities = {
  laundry: [],
  house: [],
  dirties: [],
  dishes: 0,
  declutter: 0,
  adulting: [],
};
