export type Screen =
  | "welcome"
  | "pain"
  | "mood"
  | "energy"
  | "agenda"
  | "tasks"
  | "playlist"
  | "task"
  | "bioBreak"
  | "beginNext"
  | "agendaComplete"
  | "review";

export const BIO_BREAK_OPTIONS = [
  "Hydrate",
  "Stretch",
  "Bathroom",
  "Snack",
  "Rest",
  "Breathe deeply",
] as const;

export type BioBreakOption = (typeof BIO_BREAK_OPTIONS)[number];

export type BioBreakChecks = Record<BioBreakOption, boolean>;

export function initialBioBreakChecks(): BioBreakChecks {
  return Object.fromEntries(
    BIO_BREAK_OPTIONS.map((o) => [o, false]),
  ) as BioBreakChecks;
}

export type TaskId = "laundry" | "dishes" | "declutter" | "adulting";

export type PlaylistItem = {
  taskId: TaskId;
  label: string;
};

/** Round-robin pass order for playlist generation */
export const PLAYLIST_ORDER: TaskId[] = [
  "laundry",
  "adulting",
  "dishes",
  "declutter",
];

export type DayState = {
  pain: number;
  mood: number;
  energy: number;
};

export type TaskQuantities = Record<TaskId, number>;

export const TASK_IDS: TaskId[] = [
  "laundry",
  "dishes",
  "declutter",
  "adulting",
];

export const TASK_LABELS: Record<TaskId, string> = {
  laundry: "Laundry",
  dishes: "Dishes",
  declutter: "Declutter",
  adulting: "Adulting",
};

export const initialTaskQuantities: TaskQuantities = {
  laundry: 0,
  dishes: 0,
  declutter: 0,
  adulting: 0,
};
