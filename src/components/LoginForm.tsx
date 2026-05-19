"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "./FormField";

type Mode = "login" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Account created! You can log in now.",
        });
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        window.location.href = "/app";
      }
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <FormField label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          className="input input-bordered w-full"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        helper="At least 6 characters"
      >
        <input
          id="password"
          type="password"
          className="input input-bordered w-full"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={
            mode === "signup" ? "new-password" : "current-password"
          }
        />
      </FormField>

      {message ? (
        <div
          className={`alert ${message.type === "error" ? "alert-error" : "alert-success"} text-sm`}
        >
          <span>{message.text}</span>
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading
          ? "Please wait…"
          : mode === "login"
            ? "Log in"
            : "Create account"}
      </button>

      <p className="text-center text-sm text-base-content/70">
        {mode === "login" ? (
          <>
            New here?{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={() => {
                setMode("signup");
                setMessage(null);
              }}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={() => {
                setMode("login");
                setMessage(null);
              }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
