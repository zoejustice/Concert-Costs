"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeSetlist, setlistFromDb } from "@/lib/setlist";
import type { Concert } from "@/lib/types";
import { SetlistEditor } from "./SetlistEditor";

export function SetlistForm({ concert }: { concert: Concert }) {
  const router = useRouter();
  const [songs, setSongs] = useState(() => setlistFromDb(concert.setlist));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const setlist = normalizeSetlist(songs);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("concerts")
      .update({ setlist })
      .eq("id", concert.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success ? (
        <div className="alert alert-success text-sm">
          <span>Setlist saved!</span>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      ) : null}

      <SetlistEditor songs={songs} onChange={setSongs} idPrefix="edit-song" />

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Save setlist"}
        </button>
      </div>
    </form>
  );
}
