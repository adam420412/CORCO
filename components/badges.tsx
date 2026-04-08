"use client";

type Props = {
  points: number;
  streak: number;
  lessonsCompleted: number;
};

type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  isUnlocked: (props: Props) => boolean;
};

const BADGES: Badge[] = [
  {
    id: "first-step",
    icon: "👣",
    title: "Pierwszy krok",
    description: "Ukończ pierwszą lekcję",
    isUnlocked: ({ points }) => points > 0,
  },
  {
    id: "week-with-corco",
    icon: "📅",
    title: "Tydzień z CORCO",
    description: "7 dni streak",
    isUnlocked: ({ streak }) => streak >= 7,
  },
  {
    id: "algebra-master",
    icon: "🧮",
    title: "Mistrz algebry",
    description: "Ukończ rozdział Matematyki",
    isUnlocked: () => false,
  },
  {
    id: "polyglot",
    icon: "🌍",
    title: "Poliglota",
    description: "Rozpocznij 2 kursy",
    isUnlocked: () => false,
  },
  {
    id: "diligent-student",
    icon: "⭐",
    title: "Pilny uczeń",
    description: "Zdobądź 100 XP",
    isUnlocked: ({ points }) => points >= 100,
  },
  {
    id: "undefeated",
    icon: "🏆",
    title: "Niepokonany",
    description: "30 dni streak",
    isUnlocked: ({ streak }) => streak >= 30,
  },
];

export const Badges = ({ points, streak, lessonsCompleted }: Props) => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-lg">Odznaki</h3>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const unlocked = badge.isUnlocked({ points, streak, lessonsCompleted });

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-y-1 p-3 rounded-lg border text-center transition-colors ${
                unlocked
                  ? "border-teal-200 bg-teal-50"
                  : "border-gray-200 bg-gray-50 opacity-50"
              }`}
            >
              <div className="text-2xl">
                {unlocked ? badge.icon : "🔒"}
              </div>
              <span
                className={`text-xs font-semibold leading-tight ${
                  unlocked ? "text-teal-700" : "text-gray-400"
                }`}
              >
                {badge.title}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">
                {badge.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
