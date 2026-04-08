"use client";

import { useState } from "react";

type Props = {
  parentId: string;
};

// === PLACEHOLDER DATA (MVP) ===

const mockChild = {
  name: "Kasia Kowalska",
  points: 1240,
  hearts: 4,
  streak: 7,
  activeCourse: "Angielski A2",
};

const mockRecentActivity = [
  { id: 1, lesson: "Present Simple - ćwiczenia", date: "2026-04-07", score: "8/10" },
  { id: 2, lesson: "Słownictwo: Zwierzęta", date: "2026-04-06", score: "10/10" },
  { id: 3, lesson: "Past Simple - wprowadzenie", date: "2026-04-05", score: "6/10" },
  { id: 4, lesson: "Czytanie ze zrozumieniem", date: "2026-04-04", score: "9/10" },
];

const mockBookings = [
  { id: 1, title: "Lekcja z p. Nowak", date: "2026-04-10", time: "16:00 - 16:45", status: "confirmed" as const },
  { id: 2, title: "Konwersacje angielskie", date: "2026-04-14", time: "17:00 - 17:45", status: "pending" as const },
];

const mockMessages = [
  {
    id: 1,
    from: "Anna Nowak (nauczyciel)",
    content: "Kasia robi świetne postępy w Present Simple! Proszę poćwiczyć w domu odmianę czasowników.",
    date: "2026-04-06",
    read: true,
  },
  {
    id: 2,
    from: "Anna Nowak (nauczyciel)",
    content: "Przypominam o zadaniu domowym na poniedziałek - ćwiczenia ze strony 34.",
    date: "2026-04-04",
    read: false,
  },
];

const mockAssignments = [
  { id: 1, lesson: "Present Simple - ćwiczenia dodatkowe", dueDate: "2026-04-09", completed: false, note: "Skupić się na 3. osobie liczby pojedynczej" },
  { id: 2, lesson: "Słownictwo: Dom i rodzina", dueDate: "2026-04-12", completed: false, note: null },
  { id: 3, lesson: "Zaimki osobowe - powtórka", dueDate: "2026-04-03", completed: true, note: "Doskonała praca!" },
];

// === COMPONENT ===

export const ParentDashboard = ({ parentId }: Props) => {
  const [activeTab, setActiveTab] = useState<"overview" | "messages">("overview");

  const statusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Potwierdzona";
      case "pending": return "Oczekująca";
      case "cancelled": return "Anulowana";
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-teal-100 text-teal-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "overview"
              ? "bg-teal-500 text-white"
              : "bg-white border text-gray-600 hover:bg-teal-50"
          }`}
        >
          Przegląd
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
            activeTab === "messages"
              ? "bg-teal-500 text-white"
              : "bg-white border text-gray-600 hover:bg-teal-50"
          }`}
        >
          Wiadomości
          {mockMessages.some((m) => !m.read) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Child progress overview */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-700">
                Postępy dziecka
              </h2>
              <span className="text-sm text-gray-500">{mockChild.activeCourse}</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                {mockChild.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-neutral-700">{mockChild.name}</p>
                <p className="text-sm text-gray-500">Aktywny kurs: {mockChild.activeCourse}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-teal-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-teal-600">{mockChild.points}</p>
                <p className="text-xs text-gray-500 mt-1">Punkty</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{mockChild.hearts}</p>
                <p className="text-xs text-gray-500 mt-1">Serduszka</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">{mockChild.streak} dni</p>
                <p className="text-xs text-gray-500 mt-1">Seria</p>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-700 mb-4">
              Ostatnia aktywność
            </h2>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{activity.lesson}</p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-teal-600">{activity.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming bookings */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-700 mb-4">
              Nadchodzące zajęcia
            </h2>
            {mockBookings.length === 0 ? (
              <p className="text-sm text-gray-400">Brak zaplanowanych zajęć.</p>
            ) : (
              <div className="space-y-3">
                {mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-700">{booking.title}</p>
                      <p className="text-xs text-gray-400">
                        {booking.date} &middot; {booking.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(booking.status)}`}
                    >
                      {statusLabel(booking.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-700 mb-4">
              Zadania domowe
            </h2>
            <div className="space-y-3">
              {mockAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          assignment.completed ? "bg-teal-500" : "bg-yellow-400"
                        }`}
                      />
                      <p className="text-sm font-medium text-neutral-700">{assignment.lesson}</p>
                    </div>
                    {assignment.note && (
                      <p className="text-xs text-gray-400 mt-1 ml-4">{assignment.note}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 ml-4">
                      Termin: {assignment.dueDate}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                      assignment.completed
                        ? "bg-teal-100 text-teal-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {assignment.completed ? "Ukończone" : "Do zrobienia"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "messages" && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-700 mb-4">
            Wiadomości od nauczyciela
          </h2>
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`border rounded-xl p-4 ${
                  msg.read ? "bg-white" : "bg-teal-50 border-teal-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-neutral-700">{msg.from}</p>
                  <div className="flex items-center gap-2">
                    {!msg.read && (
                      <span className="text-xs font-medium text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                        Nowa
                      </span>
                    )}
                    <p className="text-xs text-gray-400">{msg.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
