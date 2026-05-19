"use client";

import { useEffect, useState } from "react";
import { DAISY_THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export function ThemeSelector({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <label className={`form-control w-full max-w-xs ${className}`}>
      <span className="label-text font-medium">Theme</span>
      {mounted ? (
        <select
          className="select select-bordered select-sm w-full capitalize"
          value={theme}
          onChange={(e) => setTheme(e.target.value as typeof theme)}
          aria-label="Choose app theme"
        >
          {DAISY_THEMES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      ) : (
        <select
          className="select select-bordered select-sm w-full"
          defaultValue="corporate"
          disabled
          aria-hidden
          tabIndex={-1}
        >
          <option value="corporate">corporate</option>
        </select>
      )}
    </label>
  );
}
