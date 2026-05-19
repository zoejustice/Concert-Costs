"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { normalizeSetlist } from "@/lib/setlist";

type Props = {
  songs: string[];
  onChange: (songs: string[]) => void;
  idPrefix?: string;
};

export function SetlistEditor({ songs, onChange, idPrefix = "song" }: Props) {
  const rows = songs.length > 0 ? songs : [""];

  function updateRow(index: number, value: string) {
    const next = [...rows];
    next[index] = value;
    onChange(next);
  }

  function addRow() {
    onChange([...rows, ""]);
  }

  function removeRow(index: number) {
    if (rows.length <= 1) {
      onChange([""]);
      return;
    }
    onChange(rows.filter((_, i) => i !== index));
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  const songCount = normalizeSetlist(rows).length;

  return (
    <div className="space-y-3">
      <p className="text-xs text-base-content/60">
        Enter songs in the order they were played. Leave blank rows out —{" "}
        {songCount} song{songCount === 1 ? "" : "s"} listed.
      </p>

      <ol className="space-y-2 list-none">
        {rows.map((song, index) => (
          <li key={index} className="flex gap-2 items-center">
            <span className="text-sm font-medium text-base-content/50 w-6 shrink-0 text-right">
              {index + 1}.
            </span>
            <input
              id={`${idPrefix}-${index}`}
              type="text"
              className="input input-bordered input-sm grow min-w-0"
              placeholder="Song title"
              value={song}
              onChange={(e) => updateRow(index, e.target.value)}
            />
            <div className="flex shrink-0 gap-0.5">
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square"
                onClick={() => moveRow(index, -1)}
                disabled={index === 0}
                aria-label="Move song up"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square"
                onClick={() => moveRow(index, 1)}
                disabled={index === rows.length - 1}
                aria-label="Move song down"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square text-error"
                onClick={() => removeRow(index)}
                aria-label="Remove song"
                title="Remove"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="btn btn-outline btn-sm gap-1"
        onClick={addRow}
      >
        <PlusIcon className="h-4 w-4" />
        Add song
      </button>
    </div>
  );
}
