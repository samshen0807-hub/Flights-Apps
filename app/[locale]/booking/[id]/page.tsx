import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/booking-form";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{
    passengers?: string;
    cabinClass?: string;
    price?: string;
  }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations("Booking");
  const { passengers, cabinClass, price } = await searchParams;
  const passengerCount = passengers ? parseInt(passengers) : 1;
  const selectedClass = cabinClass || "Economy";
  // Fallback price logic if not provided in URL (though it should be)
  // Ideally, re-calculate on server side for security, but for now trusting param/re-fetching
  const providedPrice = price ? parseFloat(price) : null;

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login?next=/booking/${id}?passengers=${passengerCount}&cabinClass=${selectedClass}&price=${price}`);
  }

  // Get flight details
  const { data: flight, error } = await supabase
    .from("flights")
    .select(`
      *,
      airline:airlines(*),
      departure_airport:airports!departure_airport_id(code, city, name),
      arrival_airport:airports!arrival_airport_id(code, city, name)
    `)
    .eq("id", id)
    .single();

  if (error || !flight) {
    notFound();
  }

  // Security check: re-calculate price to ensure it matches server logic
  // (Simplified version of logic in SearchPage)
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
  const multiplier = getPriceMultiplier(selectedClass);
  const calculatedPrice = Math.round(flight.base_price * multiplier);

  // Use calculated price for display and form
  const finalPrice = calculatedPrice;

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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            {t("completeBooking")}
          </h1>
          <p className="text-gray-600 text-lg">Fill in passenger details to complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BookingForm
              flight={flight}
              passengerCount={passengerCount}
              userId={user.id}
              cabinClass={selectedClass}
              pricePerPassenger={finalPrice}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-xl border-0 overflow-hidden card-hover">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Plane className="w-5 h-5" />
                    {t("flightDetails")}
                  </CardTitle>
                </div>
                <CardContent className="pt-6 space-y-4 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-2 shadow-sm">
                      {flight.airline?.logo_url ? (
                        <img src={flight.airline.logo_url} alt={flight.airline.name} className="w-full h-full object-contain" />
                      ) : (
                        <Plane className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{flight.airline.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-mono font-semibold">{flight.flight_number}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{selectedClass}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-6 border-l-2 border-dashed border-blue-200 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-3 border-white shadow-md"></div>
                      <div className="text-2xl font-bold text-gray-900">{new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="text-sm text-gray-500 mt-1">{new Date(flight.departure_time).toLocaleDateString()}</div>
                      <div className="font-semibold text-gray-800 mt-1">{flight.departure_airport.city} ({flight.departure_airport.code})</div>
                      <div className="text-xs text-gray-400 mt-0.5">{flight.departure_airport.name}</div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-3 border-white shadow-md"></div>
                      <div className="text-2xl font-bold text-gray-900">{new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="text-sm text-gray-500 mt-1">{new Date(flight.arrival_time).toLocaleDateString()}</div>
                      <div className="font-semibold text-gray-800 mt-1">{flight.arrival_airport.city} ({flight.arrival_airport.code})</div>
                      <div className="text-xs text-gray-400 mt-0.5">{flight.arrival_airport.name}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600">
                <CardContent className="p-6">
                   <div className="text-sm text-white/80 mb-2 font-medium">{t("totalPrice")}</div>
                   <div className="text-4xl font-extrabold text-white mb-2">¥{(finalPrice * passengerCount).toLocaleString()}</div>
                   <div className="text-sm text-white/80 flex items-center gap-2">
                     <span>{passengerCount} {t("passengerUnit")}</span>
                     <span className="text-white/60">x</span>
                     <span>¥{finalPrice.toLocaleString()}</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
      </main>
  );
}
