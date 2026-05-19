import { MyConcertsView } from "@/components/MyConcertsView";
import { getUserConcerts } from "@/lib/concerts-data";

export default async function MyConcertsPage() {
  const concerts = await getUserConcerts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Concerts</h2>
        <p className="text-base-content/70 text-sm mt-1">
          Search and filter your shows, or sort by date, cost, or fun rating.
        </p>
      </div>
      <MyConcertsView concerts={concerts} />
    </div>
  );
}
