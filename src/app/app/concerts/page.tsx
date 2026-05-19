import { ConcertList } from "@/components/ConcertList";
import { getUserConcerts } from "@/lib/concerts-data";

export default async function MyConcertsPage() {
  const concerts = await getUserConcerts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Concerts</h2>
        <p className="text-base-content/70 text-sm mt-1">
          Every show you have logged, newest first.
        </p>
      </div>
      <ConcertList concerts={concerts} />
    </div>
  );
}
