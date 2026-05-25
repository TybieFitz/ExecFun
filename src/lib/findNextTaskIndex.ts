export function findNextTaskIndex(
  playlistLength: number,
  completed: Set<number>,
  skipped: Set<number>,
): number | null {
  for (let i = 0; i < playlistLength; i++) {
    if (!completed.has(i) && !skipped.has(i)) return i;
  }
  return null;
}
