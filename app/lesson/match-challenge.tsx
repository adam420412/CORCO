"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MatchPair = {
  left: string;
  right: string;
};

type Props = {
  pairs: MatchPair[];
  disabled?: boolean;
  status: "correct" | "wrong" | "none";
  onComplete: (allMatched: boolean) => void;
};

export const MatchChallenge = ({
  pairs,
  disabled,
  status,
  onComplete,
}: Props) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);

  // Shuffle right side
  const [shuffledRight] = useState(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const handleRightClick = (originalIndex: number) => {
    if (selectedLeft === null || disabled || matched.has(selectedLeft)) return;

    if (selectedLeft === originalIndex) {
      // Correct match
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      setMatched(newMatched);
      setSelectedLeft(null);
      setWrongPair(null);

      if (newMatched.size === pairs.length) {
        onComplete(true);
      }
    } else {
      // Wrong match
      setWrongPair({ left: selectedLeft, right: originalIndex });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 800);
    }
  };

  return (
    <div className="flex gap-8 justify-center">
      {/* Left column */}
      <div className="flex flex-col gap-3">
        {pairs.map((pair, index) => (
          <button
            key={`left-${index}`}
            onClick={() => !matched.has(index) && !disabled && setSelectedLeft(index)}
            disabled={disabled || matched.has(index)}
            className={cn(
              "px-6 py-3 rounded-xl border-2 text-sm font-medium transition min-w-[140px]",
              matched.has(index) && "bg-green-100 border-green-400 text-green-700 opacity-60",
              selectedLeft === index && !matched.has(index) && "bg-teal-100 border-teal-500 text-teal-700",
              wrongPair?.left === index && "bg-rose-100 border-rose-400 text-rose-700 animate-pulse",
              !matched.has(index) && selectedLeft !== index && !wrongPair && "hover:bg-gray-50 border-gray-300",
            )}
          >
            {pair.left}
          </button>
        ))}
      </div>

      {/* Right column (shuffled) */}
      <div className="flex flex-col gap-3">
        {shuffledRight.map((originalIndex) => (
          <button
            key={`right-${originalIndex}`}
            onClick={() => handleRightClick(originalIndex)}
            disabled={disabled || matched.has(originalIndex)}
            className={cn(
              "px-6 py-3 rounded-xl border-2 text-sm font-medium transition min-w-[140px]",
              matched.has(originalIndex) && "bg-green-100 border-green-400 text-green-700 opacity-60",
              wrongPair?.right === originalIndex && "bg-rose-100 border-rose-400 text-rose-700 animate-pulse",
              !matched.has(originalIndex) && "hover:bg-gray-50 border-gray-300",
            )}
          >
            {pairs[originalIndex].right}
          </button>
        ))}
      </div>
    </div>
  );
};
