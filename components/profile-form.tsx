"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function ProfileForm({ user }: { user: any }) {
  const t = useTranslations("Profile");
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || "");
  const [phone, setPhone] = useState(user.phone || "");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      router.refresh();
      alert(t("successMessage"));
    } catch (error: any) {
      alert(t("errorMessage") + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
        <CardTitle className="text-white text-xl">{t("editProfile")}</CardTitle>
      </div>
      <CardContent className="pt-6 px-6 pb-6 bg-white">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Email</Label>
            <Input 
              id="email" 
              value={user.email} 
              disabled 
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{t("fullName")}</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{t("phone")}</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg btn-primary" disabled={loading}>
            {loading ? t("updating") : t("updateProfile")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
