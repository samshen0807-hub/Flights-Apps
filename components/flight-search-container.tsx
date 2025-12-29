import { createClient } from "@/lib/supabase/server";
import { FlightSearchForm } from "@/components/flight-search-form";

export async function FlightSearchContainer() {
  const supabase = await createClient();
  const { data: airports } = await supabase
    .from("airports")
    .select("id, code, city, name")
    .order("city");

  return <FlightSearchForm airports={airports || []} />;
}
