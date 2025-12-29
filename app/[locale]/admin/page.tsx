import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, ShoppingBag, DollarSign, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboard() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  // Fetch stats
  const { count: flightCount } = await supabase
    .from("flights")
    .select("*", { count: "exact", head: true });

  const { count: orderCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });
    
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // For revenue, we need to sum. Supabase doesn't have a direct sum function in JS client easily without RPC or fetching all.
  // For now, let's just fetch confirmed bookings and sum in JS (not efficient for large scale but fine for MVP)
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price")
    .eq("status", "confirmed");

  const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("bookings")
    .select("*, user:users(email)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50 to-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            {t("dashboard")}
          </h1>
          <p className="text-gray-600 text-lg">Monitor your business performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg border-0 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{t("totalRevenue")}</CardTitle>
                <DollarSign className="h-5 w-5 text-white/80" />
              </div>
            </div>
            <CardContent className="pt-6 px-6 pb-6 bg-white">
              <div className="text-3xl font-extrabold text-gray-900">¥{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Total confirmed bookings</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{t("totalOrders")}</CardTitle>
                <ShoppingBag className="h-5 w-5 text-white/80" />
              </div>
            </div>
            <CardContent className="pt-6 px-6 pb-6 bg-white">
              <div className="text-3xl font-extrabold text-gray-900">{orderCount || 0}</div>
              <div className="text-sm text-gray-500 mt-1">All time bookings</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{t("activeFlights")}</CardTitle>
                <Plane className="h-5 w-5 text-white/80" />
              </div>
            </div>
            <CardContent className="pt-6 px-6 pb-6 bg-white">
              <div className="text-3xl font-extrabold text-gray-900">{flightCount || 0}</div>
              <div className="text-sm text-gray-500 mt-1">Available flights</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{t("totalUsers")}</CardTitle>
                <Users className="h-5 w-5 text-white/80" />
              </div>
            </div>
            <CardContent className="pt-6 px-6 pb-6 bg-white">
              <div className="text-3xl font-extrabold text-gray-900">{userCount || 0}</div>
              <div className="text-sm text-gray-500 mt-1">Registered users</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t("recentOrders")}</h2>
            <p className="text-gray-500">Latest booking activity</p>
          </div>
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <tr className="border-b border-blue-100">
                      <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 uppercase tracking-wider text-xs">{t("reference")}</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 uppercase tracking-wider text-xs">{t("user")}</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 uppercase tracking-wider text-xs">{t("status")}</th>
                      <th className="h-14 px-6 text-right align-middle font-semibold text-gray-700 uppercase tracking-wider text-xs">{t("amount")}</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                        <td className="p-4 align-middle font-semibold text-gray-900">{order.booking_reference}</td>
                        <td className="p-4 align-middle text-gray-600">{order.user?.email}</td>
                        <td className="p-4 align-middle">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right font-bold text-gray-900">¥{order.total_price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
