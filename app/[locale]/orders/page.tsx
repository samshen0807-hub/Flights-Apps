import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export default async function OrdersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Orders");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login?next=/orders`);
    return null;
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      flight:flights(
        *,
        airline:airlines(*),
        departure_airport:airports!departure_airport_id(*),
        arrival_airport:airports!arrival_airport_id(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
        <div className="container mx-auto py-12 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {t("myOrders")}
              </h1>
              <p className="text-gray-600 text-lg mt-1">View your booking history</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking: any) => (
              <Card key={booking.id} className="shadow-lg border-0 overflow-hidden card-hover">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{t("reference")}</div>
                        <div className="text-lg font-bold text-gray-900">{booking.booking_reference}</div>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-2 shadow-sm">
                        {booking.flight.airline?.logo_url ? (
                          <img
                            src={booking.flight.airline.logo_url}
                            alt={booking.flight.airline.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Plane className="w-7 h-7 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xl text-gray-900 mb-1">
                          {booking.flight.departure_airport.city} →{" "}
                          {booking.flight.arrival_airport.city}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-mono font-semibold">{booking.flight.flight_number}</span>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(booking.flight.departure_time).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                        ¥{booking.total_price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {t("bookedOn")} {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full flex items-center justify-center">
                <Plane className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("noOrders")}</h3>
              <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
              <Link href="/">
                <Button className="btn-primary font-semibold">
                  Start Booking
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
      </main>
  );
}
