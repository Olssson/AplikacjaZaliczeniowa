"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ExplorablePlanet } from "@/types/types";
import { formatCelestialData, isExplorablePlanet } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanetCardProps {
  planet: ExplorablePlanet;
  onSelect: (planet: ExplorablePlanet) => void;
}

const statusLabels: Record<string, string> = {
  planned: "Planowana",
  "in-progress": "W trakcie",
  completed: "Zakończona",
  failed: "Niepowodzenie",
};

const statusColors: Record<string, string> = {
  planned: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function PlanetCard({ planet, onSelect }: PlanetCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const explorable = isExplorablePlanet(planet);

  return (
    <div className="@container" ref={cardRef}>
      <div
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all duration-500",
          "hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          "active:scale-[0.97] active:shadow-md",
          isHovered && "border-primary/40"
        )}
        tabIndex={0}
        role="button"
        onClick={() => onSelect(planet)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect(planet);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${planet.color}22, transparent 70%)`,
          }}
        />

        <div className="flex flex-col @[400px]:flex-row @[400px]:items-center gap-4 p-5">
          <div className="relative mx-auto @[400px]:mx-0 w-20 h-20 @[400px]:w-24 @[400px]:h-24 flex-shrink-0">
            <div className="animate-orbit-slow absolute inset-0">
              <Image
                src={planet.image}
                alt={planet.name}
                width={96}
                height={96}
                className="w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center @[400px]:text-left">
            <div className="flex items-center justify-center @[400px]:justify-start gap-2 mb-1">
              <h3 className="text-lg font-bold tracking-tight truncate">
                {planet.name}
              </h3>
              {explorable && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase tracking-wider",
                    statusColors[planet.explorationStatus]
                  )}
                >
                  {statusLabels[planet.explorationStatus]}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {planet.description}
            </p>

            <div
              className={cn(
                "flex items-center gap-3 text-xs transition-all duration-300",
                "opacity-70 group-hover:opacity-100"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help">
                    🌡️ {formatCelestialData(planet.temperature, "temperature")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Średnia temperatura</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help">
                    ⚖️ {formatCelestialData(planet.gravity, "gravity")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Grawitacja (względem Ziemi)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help">
                    📏 {formatCelestialData(planet.distanceFromSun, "distance")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Odległość od Słońca</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {explorable && (
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>Poziom zagrożenia</span>
              <span className="font-mono">{planet.dangerLevel}/10</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 group-hover:animate-pulse"
                style={{
                  width: `${planet.dangerLevel * 10}%`,
                  background: `linear-gradient(90deg, ${planet.color}88, ${planet.color})`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
