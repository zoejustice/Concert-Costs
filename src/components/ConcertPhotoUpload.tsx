"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import {
  getConcertPhotoUrl,
  removeConcertPhoto,
  uploadConcertPhoto,
} from "@/lib/concert-photo";

type Props = {
  concertId: string;
  userId: string;
  photoPath: string | null;
};

export function ConcertPhotoUpload({ concertId, userId, photoPath }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(photoPath);
  const [cacheBust, setCacheBust] = useState<number>(() => Date.now());

  useEffect(() => {
    setSavedPath(photoPath);
  }, [photoPath]);

  const displayPath = savedPath ?? photoPath;
  const displayUrl =
    preview ?? getConcertPhotoUrl(displayPath, cacheBust);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const supabase = createClient();
    const { path, error: uploadErr } = await uploadConcertPhoto(
      supabase,
      userId,
      concertId,
      file,
      displayPath,
    );

    setLoading(false);

    if (uploadErr) {
      setError(uploadErr);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (path) {
      setSavedPath(path);
      setCacheBust(Date.now());
    }
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    setSuccess("Photo saved!");
    router.refresh();
  }

  async function handleRemove() {
    if (!displayPath && !preview) return;

    if (displayPath && !confirm("Remove this concert photo?")) return;

    if (!displayPath) {
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { error: removeErr } = await removeConcertPhoto(
      supabase,
      concertId,
      displayPath,
    );

    setLoading(false);

    if (removeErr) {
      setError(removeErr);
      return;
    }

    setSavedPath(null);
    setPreview(null);
    setCacheBust(Date.now());
    if (inputRef.current) inputRef.current.value = "";
    setSuccess("Photo removed.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      ) : null}
      {success ? (
        <div className="alert alert-success text-sm">
          <span>{success}</span>
        </div>
      ) : null}

      {displayUrl ? (
        <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-lg overflow-hidden border border-base-300 bg-base-200">
          <Image
            key={displayUrl}
            src={displayUrl}
            alt="Concert"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-lg border border-dashed border-base-300 bg-base-200/50 max-w-md mx-auto w-full aspect-[4/3]">
          <PhotoIcon className="h-12 w-12 text-base-content/40" />
          <p className="text-sm text-base-content/60">No photo yet</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        className="file-input file-input-bordered w-full max-w-md"
        onChange={handleFileChange}
        disabled={loading}
      />

      <p className="text-xs text-base-content/60 max-w-md">
        {loading
          ? "Uploading…"
          : "One photo per concert. JPEG, PNG, WebP, or GIF — max 5 MB."}
      </p>

      {(displayPath || preview) && !loading ? (
        <button
          type="button"
          className="btn btn-outline btn-sm btn-error"
          onClick={handleRemove}
        >
          Remove photo
        </button>
      ) : null}
    </div>
  );
}
