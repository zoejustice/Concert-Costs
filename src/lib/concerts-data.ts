import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export async function getUserConcerts(): Promise<Concert[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  if (error) {
    console.error("Failed to load concerts:", error.message);
    return [];
  }

  return (data ?? []) as Concert[];
}

export async function getConcertById(id: string): Promise<Concert | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Concert;
}
