import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Plane, Clock, CheckCircle2, Filter, Star } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("SearchResults");
  const params = await searchParams;
  const departure = params.departure as string;
  const arrival = params.arrival as string;
  const date = params.date as string;
  const returnDate = params.returnDate as string;
  const type = params.type as string;
  const passengers = params.passengers as string;
  const cabinClass = (params.cabinClass as string) || "Economy";

  const supabase = await createClient();

  const fetchFlights = async (dep: string, arr: string, dateStr: string) => {
    let query = supabase
      .from("flights")
      .select(`
        *,
        airline:airlines(*),
        departure_airport:airports!departure_airport_id!inner(code, city, name),
        arrival_airport:airports!arrival_airport_id!inner(code, city, name)
      `)
      .eq("status", "scheduled");

    if (dep) {
      query = query.eq("departure_airport.code", dep);
    }
    if (arr) {
      query = query.eq("arrival_airport.code", arr);
    }
    if (dateStr) {
      const startDate = `${dateStr}T00:00:00`;
      const endDate = `${dateStr}T23:59:59`;
      query = query.gte("departure_time", startDate).lte("departure_time", endDate);
    }

    const { data, error } = await query;
    return { data, error };
  };

  const { data: outboundFlights, error: outboundError } = await fetchFlights(
    departure,
    arrival,
    date
  );

  let returnFlights: any[] = [];
  let returnError: any = null;
  if (type === "round-trip" && returnDate) {
    const { data, error } = await fetchFlights(arrival, departure, returnDate);
    returnFlights = data || [];
    returnError = error;
  }

  const getPriceMultiplier = (cls: string) => {
    switch (cls) {
      case "Business":
        return 2.5;
      case "First":
        return 4.0;
      default:
        return 1.0;
    }
  };

  const multiplier = getPriceMultiplier(cabinClass);

  const FlightCard = ({ flight }: { flight: any }) => {
    const price = Math.round(flight.base_price * multiplier);
    const depTime = new Date(flight.departure_time);
    const arrTime = new Date(flight.arrival_time);
    const durationMs = arrTime.getTime() - depTime.getTime();
    const durationHrs = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <Card className="w-full mb-6 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden group card-hover">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white">
              
              <div className="md:col-span-3 flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-2 shadow-sm">
                  {flight.airline?.logo_url ? (
                    <img
                      src={flight.airline.logo_url}
                      alt={flight.airline.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Plane className="w-7 h-7 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{flight.airline?.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">{flight.flight_number}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{cabinClass}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 flex items-center justify-between px-4">
                <div className="text-center min-w-[90px]">
                  <div className="text-3xl font-bold text-gray-900">
                    {depTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mt-1">
                    {flight.departure_airport?.code}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{flight.departure_airport?.city}</div>
                </div>

                <div className="flex-1 px-6 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {durationHrs}h {durationMins}m
                  </div>
                  <div className="w-full h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 relative flex items-center justify-center">
                     <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full left-0 shadow-md"></div>
                     <Plane className="w-5 h-5 text-blue-600 rotate-90 absolute" />
                     <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full right-0 shadow-md"></div>
                  </div>
                  <div className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3" /> {t("nonStop")}
                  </div>
                </div>

                <div className="text-center min-w-[90px]">
                  <div className="text-3xl font-bold text-gray-900">
                    {arrTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mt-1">
                    {flight.arrival_airport?.code}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{flight.arrival_airport?.city}</div>
                </div>
              </div>
              
              <div className="hidden md:flex md:col-span-3 flex-col gap-2 text-xs text-gray-500 border-l border-gray-100 pl-6">
                 <p className="flex items-center gap-2">
                   <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                   {t("nonStop")}
                 </p>
                 <p className="flex items-center gap-2">
                   <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">23</span>
                   行李 23kg
                 </p>
                 <p className="flex items-center gap-2">
                   <Star className="w-3.5 h-3.5 text-yellow-500" />
                   餐食包含
                 </p>
              </div>
            </div>

            <div className="w-full md:w-72 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-blue-100 gap-4 transition-colors group-hover:from-blue-100 group-hover:to-cyan-100">
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">{t("perPerson")}</div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  ¥{price.toLocaleString()}
                </div>
              </div>
              <Link href={`/booking/${flight.id}?class=${cabinClass}&passengers=${passengers}`} className="w-full">
                <Button size="lg" className="w-full font-bold shadow-lg hover:shadow-xl transition-all btn-primary h-12 text-base">
                  {t("book")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">FlightApp</span>
          </Link>
          <div className="flex items-center gap-4">
            <RegionSettingsDialog />
            <ThemeSwitcher />
            <Suspense fallback={<div>Loading...</div>}>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
               <Plane className="w-6 h-6 text-blue-600" />
               {t("title")}
             </h1>
             <p className="text-gray-600 flex items-center gap-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{departure}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{arrival}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{date}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{passengers} {t("passengers")}</span>
             </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
               <Filter className="w-4 h-4" /> 筛选
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
                 <Plane className="w-4 h-4" /> {t("modifySearch")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {outboundError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6 border border-red-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold">{t("errorOutbound")}</p>
            <p className="text-sm">{outboundError.message}</p>
          </div>
        </div>
      )}

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
               <Plane className="w-4 h-4 text-blue-600 rotate-45" />
             </div>
            {t("outboundTitle")}
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
             {date}
          </span>
        </div>
        {outboundFlights && outboundFlights.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 font-medium mb-2">{t("noOutbound")}</p>
            <Button variant="link" className="text-blue-600" asChild><Link href="/">{t("modifySearch")}</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {outboundFlights?.map((flight: any) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>

      {type === "round-trip" && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-green-600 rotate-45" />
            </div>
            {t("returnTitle")}: {arrival} → {departure} ({returnDate})
            <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-3 py-1 rounded-full">
              ({cabinClass})
            </span>
          </h2>
          {returnError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-4 border border-red-100">
              {t("errorReturn")} {returnError.message}
            </div>
          )}
          {returnFlights && returnFlights.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-600">{t("noReturn")}</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {returnFlights?.map((flight: any) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
    </main>
  );
}
