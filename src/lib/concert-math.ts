import type { Concert } from "./types";

export function getTotalCost(concert: Pick<
  Concert,
  | "ticket_cost"
  | "ticket_fees"
  | "parking_cost"
  | "food_drink_cost"
  | "merchandise_cost"
  | "lodging_cost"
  | "travel_cost"
  | "other_cost"
>): number {
  return (
    Number(concert.ticket_cost) +
    Number(concert.ticket_fees) +
    Number(concert.parking_cost) +
    Number(concert.food_drink_cost) +
    Number(concert.merchandise_cost) +
    Number(concert.lodging_cost) +
    Number(concert.travel_cost) +
    Number(concert.other_cost)
  );
}

export function getCostPerHour(
  concert: Pick<Concert, "hours_at_event"> & Parameters<typeof getTotalCost>[0],
): number {
  const hours = Number(concert.hours_at_event);
  if (hours <= 0) return 0;
  return getTotalCost(concert) / hours;
}

export function getFunPointsPer100(
  concert: Pick<Concert, "fun_rating"> & Parameters<typeof getTotalCost>[0],
): number {
  const total = getTotalCost(concert);
  if (total <= 0) return 0;
  return (Number(concert.fun_rating) / total) * 100;
}

export const COST_FIELDS = [
  { key: "ticket_cost" as const, label: "Tickets" },
  { key: "ticket_fees" as const, label: "Ticket fees" },
  { key: "parking_cost" as const, label: "Parking" },
  { key: "food_drink_cost" as const, label: "Food & drink" },
  { key: "merchandise_cost" as const, label: "Merchandise" },
  { key: "lodging_cost" as const, label: "Hotel / lodging" },
  { key: "travel_cost" as const, label: "Travel / gas" },
  { key: "other_cost" as const, label: "Other" },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
