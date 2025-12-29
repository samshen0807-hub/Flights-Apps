import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Plane } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export default async function BookingConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ ref: string }>;
}) {
  const t = await getTranslations("Booking");
  const { ref } = await searchParams;

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
      <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-4xl font-bold">{t("bookingConfirmed")}</h1>
        <p className="text-xl text-muted-foreground">
          {t("referenceIs")} <span className="font-mono font-bold text-primary">{ref}</span>
        </p>
        <div className="pt-8">
          <Link href="/">
            <Button size="lg">{t("returnHome")}</Button>
          </Link>
        </div>
      </div>
      </div>
    </main>
  );
}
