import type { SupabaseClient } from "@supabase/supabase-js";

export const CONCERT_PHOTOS_BUCKET = "concert-photos";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function getConcertPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${CONCERT_PHOTOS_BUCKET}/${photoPath}`;
}

export function buildPhotoPath(
  userId: string,
  concertId: string,
  file: File,
): string {
  const ext =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  return `${userId}/${concertId}.${ext}`;
}

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Please choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_BYTES) {
    return "Photo must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadConcertPhoto(
  supabase: SupabaseClient,
  userId: string,
  concertId: string,
  file: File,
): Promise<{ path: string | null; error: string | null }> {
  const validation = validatePhotoFile(file);
  if (validation) return { path: null, error: validation };

  const path = buildPhotoPath(userId, concertId, file);

  const { error: uploadError } = await supabase.storage
    .from(CONCERT_PHOTOS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { path: null, error: uploadError.message };
  }

  const { error: updateError } = await supabase
    .from("concerts")
    .update({ photo_path: path })
    .eq("id", concertId);

  if (updateError) {
    return { path: null, error: updateError.message };
  }

  return { path, error: null };
}

export async function removeConcertPhoto(
  supabase: SupabaseClient,
  concertId: string,
  photoPath: string,
): Promise<{ error: string | null }> {
  const { error: storageError } = await supabase.storage
    .from(CONCERT_PHOTOS_BUCKET)
    .remove([photoPath]);

  if (storageError) {
    return { error: storageError.message };
  }

  const { error: updateError } = await supabase
    .from("concerts")
    .update({ photo_path: null })
    .eq("id", concertId);

  return { error: updateError?.message ?? null };
}
