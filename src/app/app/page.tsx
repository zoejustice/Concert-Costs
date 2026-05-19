import { DashboardView } from "@/components/DashboardView";
import { getUserConcerts } from "@/lib/concerts-data";

export default async function DashboardPage() {
  const concerts = await getUserConcerts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-base-content/70 text-sm mt-1">
          Your spending and fun at a glance.
        </p>
      </div>
      <DashboardView concerts={concerts} />
    </div>
  );
}
