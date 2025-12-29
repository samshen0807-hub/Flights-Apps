import { createClient } from "@/lib/supabase/server";
import { CreateFlightForm } from "@/components/create-flight-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function CreateFlightPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  const { data: airlines } = await supabase.from("airlines").select("*").order("name");
  const { data: airports } = await supabase.from("airports").select("*").order("city");

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/flights">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t("addNewFlight")}</h1>
      </div>

      <CreateFlightForm airlines={airlines || []} airports={airports || []} />
    </div>
  );
}
