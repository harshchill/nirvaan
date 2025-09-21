"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBooking } from "./BookingContext";
import { useState, useEffect } from "react";

// Helper to generate time slots in the near future (local time)
function generateAvailability(dayOffsets = [0, 1, 2], times = ["10:00", "14:00", "16:00"]) {
  const slots = [];
  const now = new Date();
  dayOffsets.forEach((offset) => {
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    times.forEach((t) => {
      const [hh, mm] = t.split(":" ).map(Number);
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm, 0, 0);
      if (d > now) {
        // toISOString without timezone shifting for display; store as ISO
        slots.push(d.toISOString());
      }
    });
  });
  return slots;
}

// Mock data for counsellors - in a real app, this would come from an API
const mockCounsellors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Depression",
    experience: "8 years",
    rating: 4.9,
    image: "👩‍⚕️",
    availability: generateAvailability([0, 1, 2], ["10:00", "14:00"]) 
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Academic Stress",
    experience: "6 years",
    rating: 4.8,
    image: "👨‍⚕️",
    availability: generateAvailability([1, 2, 3], ["11:00", "16:00"]) 
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Relationship Issues",
    experience: "10 years",
    rating: 4.9,
    image: "👩‍⚕️",
    availability: generateAvailability([2, 3, 4], ["09:00", "13:00", "17:00"]) 
  }
];

export default function BookingWidget({ className = "" }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    isBookingOpen,
    toggleBooking,
    closeBooking,
    bookingStep,
    selectedCounsellor,
    selectedTimeSlot,
    selectCounsellor,
    selectTimeSlot,
    goBackToStep,
    confirmBooking,
  } = useBooking();

  const handleToggle = () => {
    if (status === "loading") return;
    
    if (!session) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }
    
    toggleBooking();
  };

  const formatTimeSlot = (timeSlot) => {
    const date = new Date(timeSlot);
    return {
      date: date.toLocaleDateString("en-US", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }),
      time: date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    };
  };

  return (
    <div className={`fixed bottom-20 right-4 z-50 ${className}`}>
      {/* Booking Toggle Button */}
      {!isBookingOpen && (
        <button
          onClick={handleToggle}
          className="w-14 h-14 bg-[#b6d2c8] hover:bg-[#a5c7bd] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label="Book counselling session"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* Booking Widget */}
      {isBookingOpen && (
        <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#b6d2c8] flex items-center justify-center">
                📅
              </div>
              <h3 className="font-semibold text-gray-800">Book Counselling</h3>
            </div>
            <button
              onClick={closeBooking}
              className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close booking"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {bookingStep === "counsellor-selection" && (
              <CounsellorSelection 
                counsellors={mockCounsellors} 
                onSelect={selectCounsellor} 
              />
            )}
            
            {bookingStep === "time-selection" && (
              <TimeSelection 
                counsellor={selectedCounsellor}
                onSelect={selectTimeSlot}
                onBack={() => goBackToStep("counsellor-selection")}
                formatTimeSlot={formatTimeSlot}
              />
            )}
            
            {bookingStep === "confirmation" && (
              <BookingConfirmation 
                counsellor={selectedCounsellor}
                timeSlot={selectedTimeSlot}
                onConfirm={confirmBooking}
                onBack={() => goBackToStep("time-selection")}
                formatTimeSlot={formatTimeSlot}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CounsellorSelection({ counsellors, onSelect }) {
  return (
    <div className="p-4 space-y-4">
      <h4 className="font-medium text-gray-800 mb-3">Choose a Counsellor</h4>
      {counsellors.map((counsellor) => (
        <div
          key={counsellor.id}
          onClick={() => onSelect(counsellor)}
          className="p-3 border border-gray-200 rounded-lg hover:border-[#b6d2c8] hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{counsellor.image}</div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-800">{counsellor.name}</h5>
              <p className="text-sm text-gray-600">{counsellor.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{counsellor.experience}</span>
                <span className="text-xs text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xs text-gray-500">{counsellor.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimeSelection({ counsellor, onSelect, onBack, formatTimeSlot }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="font-medium text-gray-800">Available Times</h4>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{counsellor.image}</span>
          <div>
            <p className="font-medium text-sm">{counsellor.name}</p>
            <p className="text-xs text-gray-600">{counsellor.specialization}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {counsellor.availability.map((timeSlot, index) => {
          const formatted = formatTimeSlot(timeSlot);
          return (
            <button
              key={index}
              onClick={() => onSelect(timeSlot)}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-[#b6d2c8] hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-800">{formatted.date}</div>
              <div className="text-sm text-gray-600">{formatted.time}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingConfirmation({ counsellor, timeSlot, onConfirm, onBack, formatTimeSlot }) {
  const formatted = formatTimeSlot(timeSlot);
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="font-medium text-gray-800">Confirm Booking</h4>
      </div>

      <div className="bg-[#f7f9fc] p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{counsellor.image}</span>
          <div>
            <p className="font-medium text-gray-800">{counsellor.name}</p>
            <p className="text-sm text-gray-600">{counsellor.specialization}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">📅</span>
            <span className="text-gray-800">{formatted.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-gray-600">🕐</span>
            <span className="text-gray-800">{formatted.time}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You will receive a confirmation email with the session link 15 minutes before your appointment.
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full bg-[#b6d2c8] hover:bg-[#a5c7bd] text-white font-medium py-3 rounded-lg transition-colors"
      >
        Confirm Booking
      </button>
    </div>
  );
}
