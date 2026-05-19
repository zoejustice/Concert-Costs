/** Turn form lines into a clean setlist for the database. */
export function normalizeSetlist(songs: string[]): string[] {
  return songs.map((s) => s.trim()).filter(Boolean);
}

export function setlistFromDb(value: string[] | null | undefined): string[] {
  if (!value || value.length === 0) return [""];
  return value;
}
