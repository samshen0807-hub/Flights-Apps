import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

export default async function AdminOrdersPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      user:users(email, full_name),
      flight:flights(flight_number, departure_time)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("manageOrders")}</h1>

      <div className="border rounded-lg">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("reference")}</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("user")}</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("flight")}</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("date")}</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("amount")}</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {bookings?.map((booking: any) => (
              <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">{booking.booking_reference}</td>
                <td className="p-4 align-middle">
                  <div className="font-medium">{booking.user?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                </td>
                <td className="p-4 align-middle">
                  <div>{booking.flight?.flight_number}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(booking.flight?.departure_time).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  {new Date(booking.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 align-middle">¥{booking.total_price}</td>
                <td className="p-4 align-middle">
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "default"
                        : booking.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
