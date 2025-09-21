"use client";
import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState("counsellor-selection"); // counsellor-selection, time-selection, confirmation

  const toggleBooking = () => {
    setIsBookingOpen(!isBookingOpen);
  };

  const openBooking = () => {
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    // Reset booking state when closing
    setSelectedCounsellor(null);
    setSelectedTimeSlot(null);
    setBookingStep("counsellor-selection");
  };

  const selectCounsellor = (counsellor) => {
    setSelectedCounsellor(counsellor);
    setBookingStep("time-selection");
  };

  const selectTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setBookingStep("confirmation");
  };

  const goBackToStep = (step) => {
    setBookingStep(step);
    if (step === "counsellor-selection") {
      setSelectedCounsellor(null);
      setSelectedTimeSlot(null);
    } else if (step === "time-selection") {
      setSelectedTimeSlot(null);
    }
  };

  const confirmBooking = () => {
    // This would typically make an API call to save the booking
    console.log("Booking confirmed:", {
      counsellor: selectedCounsellor,
      timeSlot: selectedTimeSlot,
    });
    
    // For now, just close the booking widget
    closeBooking();
    
    // You could show a success message here
    alert("Booking confirmed! You will receive a confirmation email shortly.");
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        toggleBooking,
        openBooking,
        closeBooking,
        selectedCounsellor,
        selectedTimeSlot,
        bookingStep,
        selectCounsellor,
        selectTimeSlot,
        goBackToStep,
        confirmBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
