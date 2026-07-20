import type { PlaylistItem } from "../types";

type FindNextTaskOptions = {
  deferredLaundryUntil: Record<string, number>;
  nonLaundryProgressCount: number;
};

export function findNextTaskIndex(
  playlist: PlaylistItem[],
  completed: Set<number>,
  skipped: Set<number>,
  options: FindNextTaskOptions = {
    deferredLaundryUntil: {},
    nonLaundryProgressCount: 0,
  },
): number | null {
  const unresolvedIndexes = playlist
    .map((_item, index) => index)
    .filter((index) => !completed.has(index) && !skipped.has(index));

  if (unresolvedIndexes.length === 0) return null;

  const hasUnresolvedNonLaundry = unresolvedIndexes.some(
    (index) => !isLaundryTask(playlist[index]),
  );

  const earliestLaundryOrder = unresolvedIndexes.reduce<number | null>(
    (earliest, index) => {
      const item = playlist[index];
      if (!isLaundryTask(item)) return earliest;

      const order = laundryOrder(item);
      return earliest === null ? order : Math.min(earliest, order);
    },
    null,
  );

  const sequenceEligibleIndexes = unresolvedIndexes.filter((index) => {
    const item = playlist[index];
    return (
      !isLaundryTask(item) ||
      laundryOrder(item) === earliestLaundryOrder
    );
  });

  const eligibleIndexes = sequenceEligibleIndexes.filter((index) => {
    const item = playlist[index];
    const deferredUntil = options.deferredLaundryUntil[item.id] ?? 0;
    return (
      !hasUnresolvedNonLaundry ||
      !isLaundryTask(item) ||
      deferredUntil <= options.nonLaundryProgressCount
    );
  });

  const candidates =
    eligibleIndexes.length > 0 ? eligibleIndexes : sequenceEligibleIndexes;

  let nextRound: number | null = null;

  for (const i of candidates) {
    const round = playlist[i].round;
    nextRound = nextRound === null ? round : Math.min(nextRound, round);
  }

  for (let i = 0; i < playlist.length; i++) {
    if (
      candidates.includes(i) &&
      playlist[i].round === nextRound &&
      !completed.has(i) &&
      !skipped.has(i)
    ) {
      return i;
    }
  }

  return null;
}

function isLaundryTask(item: PlaylistItem) {
  return item.taskId === "laundryWash" || item.taskId === "laundryDry";
}

function laundryOrder(item: PlaylistItem) {
  return (item.round - 1) * 2 + (item.taskId === "laundryDry" ? 1 : 0);
}
