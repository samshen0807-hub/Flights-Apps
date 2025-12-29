"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Plus, Trash2, Plane, Calendar, Users, Armchair } from "lucide-react";

type Airport = {
  id: string;
  code: string;
  city: string;
  name: string;
};

type TripType = "one-way" | "round-trip" | "multi-city";
type CabinClass = "Economy" | "Business" | "First";

interface FlightSegment {
  departure: string;
  arrival: string;
  date: string;
}

export function FlightSearchForm({ airports }: { airports: Airport[] }) {
  const t = useTranslations("FlightSearch");
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>("one-way");

  // Single/Round-trip state
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");

  // Multi-city state
  const [multiCityFlights, setMultiCityFlights] = useState<FlightSegment[]>([
    { departure: "", arrival: "", date: "" },
    { departure: "", arrival: "", date: "" },
  ]);

  const swapAirports = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("type", tripType);
    params.append("passengers", passengers.toString());
    params.append("cabinClass", cabinClass);

    if (tripType === "multi-city") {
      // Serialize multi-city data
      params.append("flights", JSON.stringify(multiCityFlights));
      // Also set the first flight as main params for backward compatibility
      if (multiCityFlights.length > 0) {
        params.append("departure", multiCityFlights[0].departure);
        params.append("arrival", multiCityFlights[0].arrival);
        params.append("date", multiCityFlights[0].date);
      }
    } else {
      params.append("departure", departure);
      params.append("arrival", arrival);
      params.append("date", date);
      if (tripType === "round-trip") {
        params.append("returnDate", returnDate);
      }
    }

    router.push(`/search?${params.toString()}`);
  };

  const addFlightSegment = () => {
    setMultiCityFlights([
      ...multiCityFlights,
      { departure: "", arrival: "", date: "" },
    ]);
  };

  const removeFlightSegment = (index: number) => {
    if (multiCityFlights.length > 1) {
      const newFlights = [...multiCityFlights];
      newFlights.splice(index, 1);
      setMultiCityFlights(newFlights);
    }
  };

  const updateFlightSegment = (
    index: number,
    field: keyof FlightSegment,
    value: string
  ) => {
    const newFlights = [...multiCityFlights];
    newFlights[index] = { ...newFlights[index], [field]: value };
    setMultiCityFlights(newFlights);
  };

  return (
    <div className="w-full bg-card rounded-xl shadow-2xl border-0 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b bg-muted/30">
        <button
          type="button"
          onClick={() => setTripType("one-way")}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
            tripType === "one-way"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:bg-muted/50"
          }`}
        >
          {t("oneWay")}
        </button>
        <button
          type="button"
          onClick={() => setTripType("round-trip")}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
            tripType === "round-trip"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:bg-muted/50"
          }`}
        >
          {t("roundTrip")}
        </button>
        <button
          type="button"
          onClick={() => setTripType("multi-city")}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
            tripType === "multi-city"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:bg-muted/50"
          }`}
        >
          {t("multiCity")}
        </button>
      </div>

      <form onSubmit={handleSearch} className="p-6 md:p-8 flex flex-col gap-8">
        {tripType === "multi-city" ? (
          <div className="flex flex-col gap-6">
            {multiCityFlights.map((segment, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-dashed pb-6 last:border-0 last:pb-0"
              >
                <div className="md:col-span-4 space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("from")}</Label>
                  <Select
                    value={segment.departure}
                    onValueChange={(value) =>
                      updateFlightSegment(index, "departure", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20">
                      <SelectValue placeholder={t("selectAirport")} />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.id} value={airport.code}>
                          <span className="font-bold w-8 inline-block">{airport.code}</span> {airport.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-4 space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("to")}</Label>
                  <Select
                    value={segment.arrival}
                    onValueChange={(value) =>
                      updateFlightSegment(index, "arrival", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20">
                      <SelectValue placeholder={t("selectAirport")} />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.id} value={airport.code}>
                          <span className="font-bold w-8 inline-block">{airport.code}</span> {airport.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("departureDate")}</Label>
                  <Input
                    type="date"
                    className="h-12 bg-muted/30 border-muted-foreground/20"
                    value={segment.date}
                    onChange={(e) =>
                      updateFlightSegment(index, "date", e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-1 flex justify-end pb-2">
                {index > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFlightSegment(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFlightSegment}
              className="w-full md:w-auto self-start gap-2 border-dashed"
            >
              <Plus className="w-4 h-4" /> {t("addFlight")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                  <Plane className="w-3.5 h-3.5" /> {t("from")}
                </Label>
                <Select value={departure} onValueChange={setDeparture}>
                  <SelectTrigger className="h-12 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4">
                    <SelectValue placeholder={t("selectAirport")} />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.id} value={airport.code}>
                        <span className="font-bold w-8 inline-block">{airport.code}</span> {airport.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white shadow-md border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-110 transition-all w-7 h-7"
                  onClick={swapAirports}
                >
                  <ArrowRightLeft className="w-3 h-3 text-gray-600" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                  <Plane className="w-3.5 h-3.5 rotate-90" /> {t("to")}
                </Label>
                <Select value={arrival} onValueChange={setArrival}>
                  <SelectTrigger className="h-12 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4">
                    <SelectValue placeholder={t("selectAirport")} />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.id} value={airport.code}>
                        <span className="font-bold w-8 inline-block">{airport.code}</span> {airport.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> {t("departureDate")}
              </Label>
              <Input
                type="date"
                className="h-14 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            {tripType === "round-trip" && (
              <div className="md:col-span-3 space-y-2">
                 <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5" /> {t("returnDate")}
                 </Label>
                 <Input
                     type="date"
                     className="h-14 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4"
                     value={returnDate}
                     onChange={(e) => setReturnDate(e.target.value)}
                 />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-4 border-t border-gray-100">
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> {t("passengers")}
            </Label>
            <Select
              value={passengers.toString()}
              onValueChange={(val) => setPassengers(parseInt(val))}
            >
              <SelectTrigger className="h-12 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {t("passengers")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              <Armchair className="w-3.5 h-3.5" /> {t("cabinClass")}
            </Label>
            <Select
              value={cabinClass}
              onValueChange={(val) => setCabinClass(val as CabinClass)}
            >
              <SelectTrigger className="h-12 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-sm transition-all pl-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">{t("economy")}</SelectItem>
                <SelectItem value="Business">{t("business")}</SelectItem>
                <SelectItem value="First">{t("first")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-6">
            <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all hover:shadow-xl hover:scale-[1.02]">
              {t("search")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
