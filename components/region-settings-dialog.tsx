"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

export function RegionSettingsDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("RegionSettings");
  
  const [open, setOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const [selectedRegion, setSelectedRegion] = useState("CN");
  const [selectedCurrency, setSelectedCurrency] = useState("CNY");

  // Sync state when dialog opens or locale changes
  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale, open]);

  const handleSave = () => {
    if (selectedLocale !== currentLocale) {
      router.replace({ pathname }, { locale: selectedLocale });
    }
    setOpen(false);
    // In a real app, you would also save region and currency preferences here
  };

  const handleQuickSwitch = () => {
    const targetLocale = currentLocale === "zh" ? "en" : "zh";
    router.replace({ pathname }, { locale: targetLocale });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLocale === "zh" ? "中文" : "English"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Language Section */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="font-bold flex items-center gap-2">
                <span className="text-lg">💬</span> {t("languageLabel")}
              </Label>
              <button
                onClick={handleQuickSwitch}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("quickSwitch", { lang: currentLocale === "zh" ? "English" : "中文" })}
              </button>
            </div>
            <Select value={selectedLocale} onValueChange={setSelectedLocale}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder={t("languagePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">简体中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region Section */}
          <div className="grid gap-2">
            <Label htmlFor="region" className="font-bold flex items-center gap-2">
              <span className="text-lg">🌐</span> {t("regionLabel")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("regionDescription")}
            </p>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger id="region" className="w-full">
                <SelectValue placeholder={t("regionPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CN">中国 (China)</SelectItem>
                <SelectItem value="US">美国 (United States)</SelectItem>
                <SelectItem value="UK">英国 (United Kingdom)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Section */}
          <div className="grid gap-2">
            <Label htmlFor="currency" className="font-bold flex items-center gap-2">
              <span className="text-lg">🪙</span> {t("currencyLabel")}
            </Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder={t("currencyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CNY">CNY - ¥</SelectItem>
                <SelectItem value="USD">USD - $</SelectItem>
                <SelectItem value="GBP">GBP - £</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleSave} className="w-full bg-slate-900 text-white hover:bg-slate-800">
            {t("save")}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              {t("cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
