"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createBooking } from "@/actions/bookings";

type Props = {
  userId: string;
  userRole: string;
};

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export const CalendarView = ({ userId, userRole }: Props) => {
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [bookingTitle, setBookingTitle] = useState("");
  const [pending, startTransition] = useTransition();

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const handleBook = () => {
    if (!selectedSlot || !bookingTitle.trim()) return;

    const startTime = new Date(startOfWeek);
    startTime.setDate(startOfWeek.getDate() + selectedSlot.day);
    startTime.setHours(selectedSlot.hour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    startTransition(async () => {
      try {
        await createBooking({
          title: bookingTitle,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          teacherId: userRole === "teacher" ? userId : "",
        });
        toast.success("Zajęcia zarezerwowane!");
        setSelectedSlot(null);
        setBookingTitle("");
      } catch {
        toast.error("Nie udało się zarezerwować");
      }
    });
  };

  return (
    <div>
      {/* Booking form */}
      {selectedSlot && (
        <div className="mb-4 p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-center gap-3">
          <span className="text-sm font-medium text-teal-700">
            {DAYS[selectedSlot.day]} {selectedSlot.hour}:00
          </span>
          <input
            value={bookingTitle}
            onChange={(e) => setBookingTitle(e.target.value)}
            placeholder="Temat zajęć..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <Button
            onClick={handleBook}
            disabled={pending || !bookingTitle.trim()}
            size="sm"
            className="bg-teal-500 hover:bg-teal-600"
          >
            Zarezerwuj
          </Button>
          <Button
            onClick={() => setSelectedSlot(null)}
            size="sm"
            variant="ghost"
          >
            Anuluj
          </Button>
        </div>
      )}

      {/* Week grid */}
      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-8 bg-gray-50 border-b">
          <div className="p-3 text-xs font-medium text-gray-400 border-r" />
          {DAYS.map((day, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return (
              <div key={day} className="p-3 text-center border-r last:border-r-0">
                <p className="text-xs font-medium text-gray-500">{day}</p>
                <p className="text-lg font-bold text-gray-700">{date.getDate()}</p>
              </div>
            );
          })}
        </div>
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
            <div className="p-2 text-xs text-gray-400 text-right pr-3 border-r flex items-center justify-end">
              {hour}:00
            </div>
            {DAYS.map((_, dayIndex) => (
              <button
                key={dayIndex}
                onClick={() => setSelectedSlot({ day: dayIndex, hour })}
                className={`p-2 border-r last:border-r-0 min-h-[48px] transition hover:bg-teal-50 ${
                  selectedSlot?.day === dayIndex && selectedSlot?.hour === hour
                    ? "bg-teal-100"
                    : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
