export type Screen =
  | "welcome"
  | "tasks"
  | "playlist"
  | "task"
  | "checkIn"
  | "agendaComplete"
  | "review";

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
