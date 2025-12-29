import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminFlightsPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  const { data: flights } = await supabase
    .from("flights")
    .select(`
      *,
      airline:airlines(name),
      departure_airport:airports!departure_airport_id(code),
      arrival_airport:airports!arrival_airport_id(code)
    `)
    .order("departure_time", { ascending: true });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("manageFlights")}</h1>
          <Link href="/admin/flights/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> {t("addFlight")}
            </Button>
          </Link>
        </div>

        <div className="border rounded-lg">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("flightNumber")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("airline")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("route")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("departure")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("price")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {flights?.map((flight: any) => (
                <tr key={flight.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{flight.flight_number}</td>
                  <td className="p-4 align-middle">{flight.airline?.name}</td>
                  <td className="p-4 align-middle">
                    {flight.departure_airport?.code} → {flight.arrival_airport?.code}
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(flight.departure_time).toLocaleString()}
                  </td>
                  <td className="p-4 align-middle">¥{flight.base_price}</td>
                  <td className="p-4 align-middle capitalize">{flight.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
