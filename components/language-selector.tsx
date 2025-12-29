"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const ICON_SIZE = 16;

  const handleLanguageChange = (newLocale: string) => {
    router.replace({ pathname }, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Globe size={ICON_SIZE} className="text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            {locale === "zh" ? "中文" : "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLanguageChange}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="zh">
            <span>中文</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="en">
            <span>English</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LanguageSelector };
