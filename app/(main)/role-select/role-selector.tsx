"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { setUserRole } from "@/actions/user-progress";

const roles = [
  {
    id: "student" as const,
    title: "Uczeń",
    description: "Chcę się uczyć i rozwiązywać zadania",
    icon: "🎓",
  },
  {
    id: "teacher" as const,
    title: "Nauczyciel",
    description: "Chcę prowadzić korepetycje i tworzyć zadania",
    icon: "👨‍🏫",
  },
  {
    id: "parent" as const,
    title: "Rodzic",
    description: "Chcę śledzić postępy mojego dziecka",
    icon: "👨‍👩‍👧",
  },
];

export const RoleSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleContinue = () => {
    if (!selected) return;

    startTransition(async () => {
      try {
        await setUserRole(selected as "student" | "teacher" | "parent");
        router.push("/courses");
      } catch {
        toast.error("Coś poszło nie tak");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelected(role.id)}
            disabled={pending}
            className={cn(
              "flex flex-col items-center gap-3 p-8 rounded-2xl border-2 transition w-[200px]",
              "hover:bg-teal-50 hover:border-teal-300",
              selected === role.id
                ? "bg-teal-100 border-teal-500 shadow-md"
                : "bg-white border-gray-200",
            )}
          >
            <span className="text-4xl">{role.icon}</span>
            <h3 className="font-bold text-lg text-neutral-700">{role.title}</h3>
            <p className="text-sm text-center text-muted-foreground">
              {role.description}
            </p>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected || pending}
        className={cn(
          "mt-4 px-8 py-3 rounded-xl font-bold text-white transition",
          "bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {pending ? "Zapisywanie..." : "Kontynuuj"}
      </button>
    </div>
  );
};
