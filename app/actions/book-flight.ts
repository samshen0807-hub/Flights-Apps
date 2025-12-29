"use server";

import { createClient } from "@/lib/supabase/server";
import redis from "@/lib/redis";

export async function bookFlight(
  flightId: string,
  userId: string,
  passengers: any[],
  totalPrice: number,
  bookingReference: string
) {
  const lockKey = `flight_lock:${flightId}`;
  const lockValue = Math.random().toString(36).substring(2);
  const lockTTL = 5000; // 5 seconds

  // 1. Acquire Distributed Lock
  // NX: Only set if not exists
  // PX: Expiry in milliseconds
  const acquired = await redis.set(lockKey, lockValue, "PX", lockTTL, "NX");

  if (!acquired) {
    return { success: false, message: "System is busy processing other bookings. Please try again." };
  }

  try {
    const supabase = await createClient();

    // 2. Check Inventory (Double check inside lock)
    const { data: flight, error: flightError } = await supabase
      .from("flights")
      .select("total_seats")
      .eq("id", flightId)
      .single();

    if (flightError || !flight) {
      throw new Error("Flight not found");
    }

    if (flight.total_seats < passengers.length) {
      return { success: false, message: `Not enough seats available. Only ${flight.total_seats} left.` };
    }

    // 3. Deduct Inventory
    // We update the total_seats. In a real app, we might want to have a separate 'available_seats' column.
    // Here we assume total_seats acts as the available inventory.
    const { error: updateError } = await supabase
      .from("flights")
      .update({ total_seats: flight.total_seats - passengers.length })
      .eq("id", flightId);

    if (updateError) {
      throw new Error("Failed to update inventory");
    }

    // 4. Create Booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        flight_id: flightId,
        booking_reference: bookingReference,
        total_price: totalPrice,
        status: "confirmed",
        contact_info: { phone: passengers[0].phone },
      })
      .select()
      .single();

    if (bookingError) {
      // Rollback inventory (Compensation)
      await supabase
        .from("flights")
        .update({ total_seats: flight.total_seats }) // Reset to original
        .eq("id", flightId);
      throw new Error("Failed to create booking: " + bookingError.message);
    }

    // 5. Create Passengers
    const passengerData = passengers.map((p) => ({
      booking_id: booking.id,
      full_name: p.fullName,
      id_card: p.idCard,
      phone: p.phone,
      ticket_price: totalPrice / passengers.length,
    }));

    const { error: passengerError } = await supabase
      .from("passengers")
      .insert(passengerData);

    if (passengerError) {
      // Serious consistency issue here if we fail. 
      // In a real system, we might need a Saga or just manually cleanup the booking.
      // For this demo, we will throw.
      throw new Error("Failed to save passenger details: " + passengerError.message);
    }

    return { success: true, bookingReference };

  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, message: error.message };
  } finally {
    // 6. Release Lock (Lua script to ensure ownership)
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redis.eval(script, 1, lockKey, lockValue);
  }
}
