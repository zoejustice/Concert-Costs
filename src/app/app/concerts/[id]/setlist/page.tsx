import Link from "next/link";
import { ConcertPhotoUpload } from "@/components/ConcertPhotoUpload";
import { SetlistForm } from "@/components/SetlistForm";
import { formatDate } from "@/lib/concert-math";
import { getConcertById } from "@/lib/concerts-data";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditSetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const concert = await getConcertById(id);
  if (!concert || concert.user_id !== user.id) notFound();

  const hasSetlist = concert.setlist && concert.setlist.length > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/app/concerts" className="link link-hover text-sm">
          ← Back to My Concerts
        </Link>
        <h2 className="text-2xl font-bold mt-2">Concert details</h2>
        <p className="text-base-content/70 text-sm mt-1">
          {concert.concert_name} · {concert.artist} ·{" "}
          {formatDate(concert.concert_date)}
        </p>
      </div>

      <div
        id="photo"
        className="card bg-base-100 border border-base-300 shadow-sm scroll-mt-24"
      >
        <div className="card-body">
          <h3 className="font-semibold text-lg mb-2">Concert photo</h3>
          <ConcertPhotoUpload
            concertId={concert.id}
            userId={user.id}
            photoPath={concert.photo_path}
          />
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h3 className="font-semibold text-lg mb-2">
            {hasSetlist ? "Edit setlist" : "Add setlist"}
          </h3>
          <SetlistForm concert={concert} />
        </div>
      </div>
    </div>
  );
}
