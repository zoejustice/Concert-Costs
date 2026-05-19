import Image from "next/image";
import { getConcertPhotoUrl } from "@/lib/concert-photo";

export function ConcertPhotoDisplay({
  photoPath,
  alt,
}: {
  photoPath: string | null;
  alt: string;
}) {
  const url = getConcertPhotoUrl(photoPath);
  if (!url) return null;

  return (
    <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-base-300 bg-base-200 mb-2">
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
      />
    </div>
  );
}
