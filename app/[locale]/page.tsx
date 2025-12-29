import { FlightSearchContainer } from "@/components/flight-search-container";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RegionSettingsDialog } from "@/components/region-settings-dialog";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Plane, MapPin, Calendar, Shield, Headphones, Clock } from "lucide-react";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">{t("brand")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <RegionSettingsDialog />
            <ThemeSwitcher />
            <Suspense fallback={<div>{t("loadingAuth")}</div>}>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col pt-8 pb-16 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjMCAwLTItMi0yLTRzMi00IDItNGMwIDAgMi0yIDItNHMtMi00LTItNGMwIDAtMi0yLTItNHMyLTQgMi00czItMiA0LTJjMCAwIDItMiAyLTRzLTItNC0yLTRjMCAwLTItMi0yLTRzMi00IDItNGMwIDAgMi0yIDItNHMtMi00LTItNGMwIDAtMi0yLTItNHMyLTQgMi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
              {t("description")}
            </p>
          </div>

          <div className="w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden glass-effect">
            <Suspense fallback={<div className="w-full h-64 bg-white animate-pulse" />}>
              <FlightSearchContainer />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white card-hover">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Plane className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">全球航线</h3>
              <p className="text-sm text-white/80">覆盖200+国家和地区</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white card-hover">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">安全保障</h3>
              <p className="text-sm text-white/80">100%出票保证</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white card-hover">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">24小时客服</h3>
              <p className="text-sm text-white/80">随时为您服务</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white card-hover">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">极速出票</h3>
              <p className="text-sm text-white/80">最快3分钟出票</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">热门目的地</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { city: "北京", price: "¥520", img: "bg-gradient-to-br from-red-400 to-red-600" },
              { city: "上海", price: "¥480", img: "bg-gradient-to-br from-blue-400 to-blue-600" },
              { city: "广州", price: "¥420", img: "bg-gradient-to-br from-green-400 to-green-600" },
              { city: "深圳", price: "¥450", img: "bg-gradient-to-br from-purple-400 to-purple-600" },
              { city: "成都", price: "¥580", img: "bg-gradient-to-br from-orange-400 to-orange-600" },
              { city: "杭州", price: "¥460", img: "bg-gradient-to-br from-cyan-400 to-cyan-600" },
              { city: "西安", price: "¥390", img: "bg-gradient-to-br from-yellow-400 to-yellow-600" },
              { city: "重庆", price: "¥520", img: "bg-gradient-to-br from-pink-400 to-pink-600" },
            ].map((dest, idx) => (
              <Link key={idx} href="/search" className="group">
                <div className={`rounded-2xl h-48 ${dest.img} relative overflow-hidden card-hover`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{dest.city}</h3>
                    <p className="text-sm opacity-90">起价 {dest.price}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                    热门
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
