import { createClient } from "@/lib/supabase/server";

export type StoreBrand = {
  id: number;
  name: string;
  description: string | null;
};

export async function getBrands(): Promise<StoreBrand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase brands error:", error.message);
    return [];
  }

  return data ?? [];
}
