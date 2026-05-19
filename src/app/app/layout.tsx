import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeSelector } from "@/components/ThemeSelector";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Concert Cost Tracker</h1>
              <p className="text-sm text-base-content/70 mt-1 max-w-xl">
                Track what you spend on live music, rate the fun, and spot your
                best-value shows.
              </p>
              <p className="text-xs text-base-content/60 mt-2">
                Signed in as{" "}
                <span className="font-medium text-base-content">
                  {user.email}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <ThemeSelector />
              <LogoutButton />
            </div>
          </div>
          <AppNav />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
