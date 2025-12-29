"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookFlight } from "@/app/actions/book-flight";
import { useTranslations } from "next-intl";
import { User, CreditCard, Phone, ShieldCheck } from "lucide-react";

type Passenger = {
  fullName: string;
  idCard: string;
  phone: string;
};

export function BookingForm({
  flight,
  passengerCount,
  userId,
  cabinClass = "Economy",
  pricePerPassenger,
}: {
  flight: any;
  passengerCount: number;
  userId?: string;
  cabinClass?: string;
  pricePerPassenger?: number;
}) {
  const t = useTranslations("Booking");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: passengerCount }).map(() => ({
      fullName: "",
      idCard: "",
      phone: "",
    }))
  );

  const finalPricePerPassenger = pricePerPassenger || flight.base_price;

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        // Redirect to login or show error
        // For now, let's assume we require login
        router.push(
          `/auth/login?next=/booking/${flight.id}?passengers=${passengerCount}&cabinClass=${cabinClass}&price=${finalPricePerPassenger}`
        );
        return;
      }

      const totalPrice = finalPricePerPassenger * passengers.length;
      const bookingReference = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

      // Call Server Action
      const result = await bookFlight(
        flight.id,
        userId,
        passengers,
        totalPrice,
        bookingReference
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      router.push(`/booking/confirm?ref=${result.bookingReference}`);
    } catch (error: any) {
      console.error("Booking error:", error);
      alert("Booking failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {passengers.map((passenger, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-lg card-hover">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <CardTitle className="flex items-center gap-3 text-lg text-white">
                <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                   <User className="w-5 h-5" />
                </div>
                {t("passenger", { index: index + 1 })}
              </CardTitle>
            </div>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6 px-6 pb-6 bg-white">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{t("fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={passenger.fullName}
                    onChange={(e) =>
                      handlePassengerChange(index, "fullName", e.target.value)
                    }
                    placeholder="e.g. Zhang San"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{t("idCard")}</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={passenger.idCard}
                    onChange={(e) =>
                      handlePassengerChange(index, "idCard", e.target.value)
                    }
                    placeholder="ID Number"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{t("phone")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={passenger.phone}
                    onChange={(e) =>
                      handlePassengerChange(index, "phone", e.target.value)
                    }
                    placeholder="Mobile Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
         <div className="flex items-start gap-4">
            <div className="bg-green-50 p-2.5 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">
               <p className="font-semibold text-gray-900 mb-1">Secure Booking</p>
               <p>Your data is protected. By clicking "Confirm Booking", you agree to our terms and conditions.</p>
            </div>
         </div>
         
         <Button type="submit" size="lg" disabled={loading} className="w-full text-lg font-bold h-14 shadow-lg btn-primary">
          {loading ? t("processing") : t("confirmBooking")}
        </Button>
      </div>
    </form>
  );
}
