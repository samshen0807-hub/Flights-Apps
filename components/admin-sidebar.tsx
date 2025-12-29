"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Plane,
  ShoppingBag,
  LogOut,
  Home,
} from "lucide-react";
import { LogoutButton } from "./logout-button";
import { useTranslations } from "next-intl";

export function AdminSidebar() {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: t("dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/flights",
      label: t("flights"),
      icon: Plane,
      active: pathname.startsWith("/admin/flights"),
    },
    {
      href: "/admin/orders",
      label: t("orders"),
      icon: ShoppingBag,
      active: pathname.startsWith("/admin/orders"),
    },
  ];

  return (
    <div className="w-64 border-r bg-muted/20 min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold tracking-tight">{t("panel")}</h2>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Button
            key={link.href}
            variant={link.active ? "default" : "ghost"}
            className={cn("w-full justify-start gap-2", {
              "bg-primary text-primary-foreground": link.active,
            })}
            asChild
          >
            <Link href={link.href}>
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/">
            <Home className="w-4 h-4" />
            {t("backToSite")}
          </Link>
        </Button>
        <div className="w-full">
            <LogoutButton />
        </div>
      </div>
    </div>
  );
}
