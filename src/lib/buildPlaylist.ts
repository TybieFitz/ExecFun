import {
  PLAYLIST_ORDER,
  TASK_LABELS,
  type PlaylistItem,
  type TaskId,
  type TaskQuantities,
} from "../types";

export function buildPlaylist(quantities: TaskQuantities): PlaylistItem[] {
  const active = PLAYLIST_ORDER.filter((id) => quantities[id] > 0);
  if (active.length === 0) return [];

  const maxPasses = Math.max(...active.map((id) => quantities[id]));
  const instanceCount: Partial<Record<TaskId, number>> = {};
  const result: PlaylistItem[] = [];

  for (let pass = 0; pass < maxPasses; pass++) {
    for (const id of PLAYLIST_ORDER) {
      const qty = quantities[id];
      if (qty <= 0 || pass >= qty) continue;

      const index = (instanceCount[id] ?? 0) + 1;
      instanceCount[id] = index;

      const base = TASK_LABELS[id];
      const label = qty > 1 ? `${base} ${index}` : base;
      result.push({ taskId: id, label });
    }
  }

  return result;
}
