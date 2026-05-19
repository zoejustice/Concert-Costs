import type { Concert } from "@/lib/types";
import {
  COST_FIELDS,
  formatCurrency,
  formatDate,
  getCostPerHour,
  getFunPointsPer100,
  getTotalCost,
} from "@/lib/concert-math";
import {
  CalendarDaysIcon,
  MapPinIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function topCostCategories(concert: Concert, limit = 3) {
  return COST_FIELDS.map(({ key, label }) => ({
    label,
    amount: Number(concert[key]),
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function ConcertList({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) {
    return (
      <div className="card bg-base-100 border border-dashed border-base-300 shadow-sm">
        <div className="card-body items-center text-center py-16">
          <MusicalNoteIcon className="h-12 w-12 text-primary/60" />
          <h2 className="text-xl font-semibold mt-2">No concerts yet</h2>
          <p className="text-base-content/70 max-w-md">
            No concerts logged yet. Add your first concert to start seeing your
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...concerts].sort(
    (a, b) =>
      new Date(b.concert_date).getTime() - new Date(a.concert_date).getTime(),
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sorted.map((concert) => {
        const total = getTotalCost(concert);
        const costPerHour = getCostPerHour(concert);
        const funPer100 = getFunPointsPer100(concert);
        const categories = topCostCategories(concert);

        return (
          <article
            key={concert.id}
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body gap-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="card-title text-lg leading-tight">
                    {concert.concert_name}
                  </h2>
                  <p className="text-sm text-base-content/70 flex items-center gap-1">
                    <MusicalNoteIcon className="h-4 w-4 shrink-0" />
                    {concert.artist}
                  </p>
                </div>
                <div className="badge badge-primary badge-lg">
                  Fun {concert.fun_rating}/10
                </div>
              </div>

              <div className="text-sm space-y-1 text-base-content/80">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  {concert.venue} · {concert.city}, {concert.state}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 shrink-0" />
                  {formatDate(concert.concert_date)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-base-200/60 p-3">
                  <p className="text-base-content/60">Total cost</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(total)}
                  </p>
                </div>
                <div className="rounded-lg bg-base-200/60 p-3">
                  <p className="text-base-content/60">Cost per hour</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(costPerHour)}
                  </p>
                </div>
                <div className="rounded-lg bg-base-200/60 p-3 col-span-2">
                  <p className="text-base-content/60 flex items-center gap-1">
                    <SparklesIcon className="h-4 w-4" />
                    Fun Points per $100
                  </p>
                  <p className="font-semibold text-lg">
                    {funPer100.toFixed(2)}
                  </p>
                </div>
              </div>

              {categories.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-base-content/60 mb-2">
                    Main cost categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <span key={c.label} className="badge badge-outline">
                        {c.label}: {formatCurrency(c.amount)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {concert.notes ? (
                <p className="text-sm border-t border-base-300 pt-3 text-base-content/80">
                  <span className="font-medium">Notes: </span>
                  {concert.notes}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
