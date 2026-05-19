import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { LoginForm } from "@/components/LoginForm";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function LoginPage() {
  return (
    <main className="min-h-screen hero-gradient flex flex-col">
      <header className="flex justify-end p-4 sm:p-6">
        <ThemeSelector />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left space-y-4">
            <div className="inline-flex items-center justify-center lg:justify-start gap-3">
              <div className="rounded-2xl bg-primary text-primary-content p-3 shadow-lg">
                <MusicalNoteIcon className="h-10 w-10" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wide">
                  Welcome
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Concert Cost Tracker
                </h1>
              </div>
            </div>
            <p className="text-lg text-base-content/80 max-w-md mx-auto lg:mx-0">
              Remember every show, what you spent, and how much fun you had —
              then see which concerts were worth every penny.
            </p>
            <ul className="text-sm text-base-content/70 space-y-2 max-w-md mx-auto lg:mx-0 text-left list-disc list-inside">
              <li>Log tickets, travel, food, merch, and more</li>
              <li>Rate the fun from 1 to 10</li>
              <li>See charts and stats on your dashboard</li>
            </ul>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title justify-center text-xl mb-1">
                Sign in to continue
              </h2>
              <p className="text-center text-sm text-base-content/60 mb-4">
                Create a free account or log in with your email.
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
