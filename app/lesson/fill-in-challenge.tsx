"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  disabled?: boolean;
  status: "correct" | "wrong" | "none";
  onSubmit: (answer: string) => void;
};

export const FillInChallenge = ({
  question,
  disabled,
  status,
  onSubmit,
}: Props) => {
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-lg font-medium text-neutral-700">{question}</p>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && answer.trim()) {
            onSubmit(answer.trim());
          }
        }}
        disabled={disabled}
        placeholder="Wpisz odpowiedź..."
        className={cn(
          "w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 transition",
          status === "correct" && "border-green-500 bg-green-50 focus:ring-green-400",
          status === "wrong" && "border-rose-500 bg-rose-50 focus:ring-rose-400",
          status === "none" && "border-gray-300 focus:ring-teal-400",
        )}
      />
      {status === "none" && (
        <button
          onClick={() => answer.trim() && onSubmit(answer.trim())}
          disabled={disabled || !answer.trim()}
          className="self-end bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-xl disabled:opacity-50 transition"
        >
          Sprawdź
        </button>
      )}
    </div>
  );
};
