"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  front: string;
  back: string;
  disabled?: boolean;
  onComplete: () => void;
};

export const FlashcardChallenge = ({
  front,
  back,
  disabled,
  onComplete,
}: Props) => {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col items-center gap-y-6">
      {/* Card */}
      <button
        onClick={() => !disabled && setFlipped(!flipped)}
        className={cn(
          "w-[320px] h-[200px] rounded-2xl border-2 flex items-center justify-center p-6 transition-all duration-300 cursor-pointer",
          "shadow-lg hover:shadow-xl",
          !flipped && "bg-white border-teal-300",
          flipped && "bg-teal-50 border-teal-500",
        )}
      >
        <p className={cn(
          "text-xl font-bold text-center",
          !flipped && "text-neutral-700",
          flipped && "text-teal-700",
        )}>
          {flipped ? back : front}
        </p>
      </button>

      <p className="text-sm text-gray-400">
        {flipped ? "Odpowiedź" : "Kliknij aby odwrócić"}
      </p>

      {/* Actions after flip */}
      {flipped && known === null && (
        <div className="flex gap-4">
          <button
            onClick={() => {
              setKnown(false);
              onComplete();
            }}
            className="px-6 py-3 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition"
          >
            Nie wiem
          </button>
          <button
            onClick={() => {
              setKnown(true);
              onComplete();
            }}
            className="px-6 py-3 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 transition"
          >
            Wiem!
          </button>
        </div>
      )}

      {known !== null && (
        <p className={cn(
          "text-lg font-bold",
          known ? "text-green-600" : "text-rose-600",
        )}>
          {known ? "Świetnie!" : "Powtórz to zagadnienie!"}
        </p>
      )}
    </div>
  );
};
