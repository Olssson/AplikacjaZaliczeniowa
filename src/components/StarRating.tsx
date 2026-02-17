"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  disabled?: boolean;
}

export function StarRating({
  value,
  onChange,
  maxStars = 5,
  disabled = false,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const displayValue = hoveredStar !== null ? hoveredStar : value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Ocena doświadczenia">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} ${starValue === 1 ? "gwiazdka" : "gwiazdek"}`}
            disabled={disabled}
            className={cn(
              "p-0.5 rounded transition-all duration-200",
              "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/30",
              "active:scale-90",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoveredStar(starValue)}
            onMouseLeave={() => setHoveredStar(null)}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors duration-200",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground tabular-nums">
        {value}/{maxStars}
      </span>
    </div>
  );
}
