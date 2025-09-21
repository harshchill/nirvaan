"use client";
import { useBooking } from "./BookingContext";
import BookingWidget from "./BookingWidget";

export default function GlobalBookingWidget() {
  const { isBookingOpen, toggleBooking } = useBooking();

  return (
    <BookingWidget
      isOpen={isBookingOpen}
      onToggle={toggleBooking}
    />
  );
}
