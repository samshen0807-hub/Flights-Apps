"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function CreateFlightForm({
  airlines,
  airports,
}: {
  airlines: any[];
  airports: any[];
}) {
  const t = useTranslations("Admin");
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from("flights").insert({
        flight_number: data.flight_number,
        airline_id: data.airline_id,
        departure_airport_id: data.departure_airport_id,
        arrival_airport_id: data.arrival_airport_id,
        departure_time: data.departure_time,
        arrival_time: data.arrival_time,
        base_price: data.base_price,
        total_seats: data.total_seats,
        aircraft_type: data.aircraft_type,
        status: "scheduled",
      });

      if (error) throw error;

      router.push("/admin/flights");
      router.refresh();
    } catch (error: any) {
      alert(t("errorCreating") + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flight_number">{t("flightNumber")}</Label>
              <Input id="flight_number" name="flight_number" required placeholder="e.g. CA1234" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airline_id">{t("airline")}</Label>
              <select
                id="airline_id"
                name="airline_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">{t("selectAirline")}</option>
                {airlines.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure_airport_id">{t("departureAirport")}</Label>
              <select
                id="departure_airport_id"
                name="departure_airport_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">{t("selectOrigin")}</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.city} - {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival_airport_id">{t("arrivalAirport")}</Label>
              <select
                id="arrival_airport_id"
                name="arrival_airport_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">{t("selectDestination")}</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.city} - {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure_time">{t("departureTime")}</Label>
              <Input id="departure_time" name="departure_time" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival_time">{t("arrivalTime")}</Label>
              <Input id="arrival_time" name="arrival_time" type="datetime-local" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">{t("price")} (¥)</Label>
              <Input id="base_price" name="base_price" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_seats">{t("totalSeats")}</Label>
              <Input id="total_seats" name="total_seats" type="number" defaultValue="180" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aircraft_type">{t("aircraftType")}</Label>
              <Input id="aircraft_type" name="aircraft_type" placeholder="e.g. Boeing 737" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("creating") : t("createFlight")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
