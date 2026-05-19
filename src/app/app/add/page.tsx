import { AddConcertForm } from "@/components/AddConcertForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AddConcertPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Add Concert</h2>
        <p className="text-base-content/70 text-sm mt-1">
          Log a show you attended — costs and fun rating included.
        </p>
      </div>
      <AddConcertForm userId={user.id} />
    </div>
  );
}
