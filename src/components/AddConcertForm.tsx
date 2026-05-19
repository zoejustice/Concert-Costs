"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getTotalCost } from "@/lib/concert-math";
import { FormField } from "./FormField";

const emptyCosts = {
  ticket_cost: 0,
  ticket_fees: 0,
  parking_cost: 0,
  food_drink_cost: 0,
  merchandise_cost: 0,
  lodging_cost: 0,
  travel_cost: 0,
  other_cost: 0,
};

type FormState = {
  concert_name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  concert_date: string;
  distance_from_home: string;
  hours_at_event: string;
  notes: string;
  fun_rating: number;
  ticket_cost: string;
  ticket_fees: string;
  parking_cost: string;
  food_drink_cost: string;
  merchandise_cost: string;
  lodging_cost: string;
  travel_cost: string;
  other_cost: string;
};

const initialForm: FormState = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "",
  hours_at_event: "",
  notes: "",
  fun_rating: 7,
  ticket_cost: "",
  ticket_fees: "",
  parking_cost: "",
  food_drink_cost: "",
  merchandise_cost: "",
  lodging_cost: "",
  travel_cost: "",
  other_cost: "",
};

export function AddConcertForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveTotal = useMemo(() => {
    const costs = {
      ticket_cost: Number(form.ticket_cost) || 0,
      ticket_fees: Number(form.ticket_fees) || 0,
      parking_cost: Number(form.parking_cost) || 0,
      food_drink_cost: Number(form.food_drink_cost) || 0,
      merchandise_cost: Number(form.merchandise_cost) || 0,
      lodging_cost: Number(form.lodging_cost) || 0,
      travel_cost: Number(form.travel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
    };
    return getTotalCost(costs);
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      user_id: userId,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: Number(form.distance_from_home) || 0,
      hours_at_event: Number(form.hours_at_event) || 0,
      ticket_cost: Number(form.ticket_cost) || 0,
      ticket_fees: Number(form.ticket_fees) || 0,
      parking_cost: Number(form.parking_cost) || 0,
      food_drink_cost: Number(form.food_drink_cost) || 0,
      merchandise_cost: Number(form.merchandise_cost) || 0,
      lodging_cost: Number(form.lodging_cost) || 0,
      travel_cost: Number(form.travel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
      fun_rating: Number(form.fun_rating),
      notes: form.notes.trim() || null,
    };

    const supabase = createClient();
    const { error: insertError } = await supabase.from("concerts").insert(payload);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setForm(initialForm);
    router.refresh();
  }

  const costFields: { key: keyof typeof emptyCosts; label: string }[] = [
    { key: "ticket_cost", label: "Ticket cost" },
    { key: "ticket_fees", label: "Ticket fees" },
    { key: "parking_cost", label: "Parking cost" },
    { key: "food_drink_cost", label: "Food and drink cost" },
    { key: "merchandise_cost", label: "Merchandise cost" },
    { key: "lodging_cost", label: "Hotel or lodging cost" },
    { key: "travel_cost", label: "Travel or gas cost" },
    { key: "other_cost", label: "Other cost" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success ? (
        <div className="alert alert-success">
          <span>Concert saved! Add another or check your dashboard.</span>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      <section className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body gap-6">
          <div>
            <h2 className="card-title text-lg">Concert details</h2>
            <p className="text-sm text-base-content/70">
              Tell us where you went and how long you were there.
            </p>
          </div>

          <div className="space-y-4">
            <FormField label="Concert name" htmlFor="concert_name">
              <input
                id="concert_name"
                className="input input-bordered w-full"
                value={form.concert_name}
                onChange={(e) => updateField("concert_name", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Artist or band" htmlFor="artist">
              <input
                id="artist"
                className="input input-bordered w-full"
                value={form.artist}
                onChange={(e) => updateField("artist", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Venue" htmlFor="venue">
              <input
                id="venue"
                className="input input-bordered w-full"
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                required
              />
            </FormField>
            <FormField label="City" htmlFor="city">
              <input
                id="city"
                className="input input-bordered w-full"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                required
              />
            </FormField>
            <FormField label="State" htmlFor="state">
              <input
                id="state"
                className="input input-bordered w-full"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Concert date" htmlFor="concert_date">
              <input
                id="concert_date"
                type="date"
                className="input input-bordered w-full"
                value={form.concert_date}
                onChange={(e) => updateField("concert_date", e.target.value)}
                required
              />
            </FormField>
            <FormField
              label="Distance from home"
              htmlFor="distance_from_home"
              helper="Miles"
            >
              <input
                id="distance_from_home"
                type="number"
                min={0}
                step="0.1"
                className="input input-bordered w-full"
                value={form.distance_from_home}
                onChange={(e) =>
                  updateField("distance_from_home", e.target.value)
                }
                required
              />
            </FormField>
            <FormField
              label="Hours at event"
              htmlFor="hours_at_event"
              helper="Approximate time at the show"
            >
              <input
                id="hours_at_event"
                type="number"
                min={0.5}
                step="0.5"
                className="input input-bordered w-full"
                value={form.hours_at_event}
                onChange={(e) => updateField("hours_at_event", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Notes" htmlFor="notes" helper="Optional">
              <textarea
                id="notes"
                className="textarea textarea-bordered w-full min-h-24"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Memorable moments, who you went with, etc."
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body gap-6">
          <div>
            <h2 className="card-title text-lg">Costs</h2>
            <p className="text-sm text-base-content/70">
              Enter what you spent. Leave blank fields as zero.
            </p>
          </div>

          <div className="space-y-4">
            {costFields.map(({ key, label }) => (
              <FormField key={key} label={label} htmlFor={key}>
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <span className="text-base-content/50">$</span>
                  <input
                    id={key}
                    type="number"
                    min={0}
                    step="0.01"
                    className="grow min-w-0"
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                  />
                </label>
              </FormField>
            ))}
          </div>

          <div className="stats shadow bg-primary/10 border border-primary/20">
            <div className="stat">
              <div className="stat-title">Total concert cost</div>
              <div className="stat-value text-primary">
                {formatCurrency(liveTotal)}
              </div>
              <div className="stat-desc">
                Updates automatically as you type
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body gap-6">
          <div>
            <h2 className="card-title text-lg">How fun was it?</h2>
            <p className="text-sm text-base-content/70">
              Rate the experience from 1 (Terrible Time) to 10 (Best Time Ever).
            </p>
          </div>

          <FormField label="Fun rating" htmlFor="fun_rating">
            <div className="space-y-3">
              <input
                id="fun_rating"
                type="range"
                min={1}
                max={10}
                step={1}
                className="range range-primary w-full"
                value={form.fun_rating}
                onChange={(e) =>
                  updateField("fun_rating", Number(e.target.value))
                }
              />
              <div className="flex justify-between text-xs px-1 text-base-content/70">
                <span>1 — Terrible Time</span>
                <span className="font-semibold text-base-content text-sm">
                  {form.fun_rating} / 10
                </span>
                <span>10 — Best Time Ever</span>
              </div>
            </div>
          </FormField>
        </div>
      </section>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? "Saving…" : "Save concert"}
      </button>
    </form>
  );
}
