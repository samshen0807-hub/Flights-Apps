import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plane } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Profile");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login?next=/profile`);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

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
        <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4" /> {t("backToHome")}
            </Button>
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            {t("myProfile")}
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information</p>
        </div>
        <ProfileForm user={profile || { id: user.id, email: user.email }} />
      </div>
      </div>
      </main>
  );
}
