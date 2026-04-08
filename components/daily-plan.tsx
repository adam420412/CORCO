"use client";

import { Progress } from "@/components/ui/progress";

type Props = {
  points: number;
  streak: number;
  lessonsCompleted: number;
};

const DAILY_XP_GOAL = 20;

export const DailyPlan = ({ points, streak, lessonsCompleted }: Props) => {
  const dailyXpProgress = Math.min((points % DAILY_XP_GOAL / DAILY_XP_GOAL) * 100, 100);
  const hasCompletedLesson = lessonsCompleted > 0;

  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full">
        <h3 className="font-bold text-lg">Plan na dzisiaj</h3>
        {streak > 0 && (
          <span className="text-sm font-semibold text-orange-500">
            🔥 {streak} {streak === 1 ? "dzień" : streak < 5 ? "dni" : "dni"} z rzędu
          </span>
        )}
      </div>

      <ul className="space-y-3">
        {/* Goal 1: Complete 1 lesson */}
        <li className="flex items-center gap-x-3">
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
              hasCompletedLesson
                ? "bg-teal-500 border-teal-500 text-white"
                : "border-gray-300"
            }`}
          >
            {hasCompletedLesson && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span
            className={`text-sm ${
              hasCompletedLesson
                ? "text-gray-400 line-through"
                : "text-neutral-700 font-medium"
            }`}
          >
            Ukończ 1 lekcję
          </span>
        </li>

        {/* Goal 2: Earn 20 XP */}
        <li className="flex items-center gap-x-3">
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
            <span className="text-sm font-bold text-teal-600">XP</span>
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            <span className="text-sm text-neutral-700 font-medium">
              Zdobądź {DAILY_XP_GOAL} XP
            </span>
            <Progress value={dailyXpProgress} className="h-2" />
          </div>
        </li>

        {/* Goal 3: Review 2 tasks */}
        <li className="flex items-center gap-x-3">
          <div className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center flex-shrink-0" />
          <span className="text-sm text-neutral-700 font-medium">
            Powtórz 2 zadania
          </span>
        </li>
      </ul>

      {streak === 0 && (
        <p className="text-xs text-gray-400 text-center pt-1">
          Zacznij naukę, aby rozpocząć swoją serię!
        </p>
      )}
    </div>
  );
};
