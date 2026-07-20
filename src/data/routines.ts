import type { RoutineId, RoutineTask } from "../types";

export const ROUTINE_LABELS: Record<RoutineId, string> = {
  morning: "Morning Routine",
  evening: "Evening Routine",
};

export const ROUTINE_COMPLETE_MESSAGES: Record<RoutineId, string> = {
  morning: "Enjoy the day",
  evening: "Sleep well",
};

export const ROUTINE_TASKS: Record<RoutineId, RoutineTask[]> = {
  morning: [
    {
      id: "morning.personalCare",
      label: "Personal Care",
      checklist: [
        "Water",
        "Wash face",
        "Sunscreen",
        "Sun",
        "BP",
        "Meds",
        "Protein + Social",
        "Brush",
      ],
    },
    { id: "morning.email", label: "Check email" },
    { id: "morning.hamper", label: "Load hamper" },
    { id: "morning.trills", label: "Trills" },
    { id: "morning.video", label: "Pick video" },
    { id: "morning.agenda", label: "Agenda" },
  ],
  evening: [
    { id: "evening.clothes", label: "Pick clothes" },
    { id: "evening.tafaLunchie", label: "Tafa Lunchie" },
    { id: "evening.agendaPlan", label: "Agenda Plan" },
    { id: "evening.videos", label: "Choose evening videos" },
    {
      id: "evening.personalCare",
      label: "Personal Care",
      checklist: [
        "Meds",
        "Magnesium",
        "Brush + Floss",
        "Wash Face",
        "Derma Roller",
        "Moisturize",
      ],
    },
    { id: "evening.nightmares", label: "Write nightmares" },
    { id: "evening.sortingCraft", label: "Sorting / Craft" },
  ],
};
