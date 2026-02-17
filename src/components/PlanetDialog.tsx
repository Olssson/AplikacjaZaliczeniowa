"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { ExplorablePlanet } from "@/types/types";
import { formatCelestialData } from "@/types/types";

interface PlanetDialogProps {
  planet: ExplorablePlanet | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  planned: "Planowana",
  "in-progress": "W trakcie",
  completed: "Zakończona",
  failed: "Niepowodzenie",
};

export function PlanetDialog({ planet, isOpen, onClose }: PlanetDialogProps) {
  if (!planet) return null;

  const stats = [
    { label: "Typ", value: planet.type, tooltip: "Klasyfikacja planety" },
    { label: "Średnica", value: `${planet.diameter.toLocaleString()} km`, tooltip: "Średnica równikowa" },
    { label: "Odległość", value: formatCelestialData(planet.distanceFromSun, "distance"), tooltip: "Odległość od Słońca" },
    { label: "Grawitacja", value: formatCelestialData(planet.gravity, "gravity"), tooltip: "Przyspieszenie grawitacyjne względem Ziemi" },
    { label: "Temperatura", value: formatCelestialData(planet.temperature, "temperature"), tooltip: "Średnia temperatura powierzchni" },
    { label: "Misje", value: planet.missionsCount.toString(), tooltip: "Liczba przeprowadzonych misji" },
    { label: "Zagrożenie", value: `${planet.dangerLevel}/10`, tooltip: "Poziom zagrożenia eksploracji" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0">
              <Image
                src={planet.image}
                alt={planet.name}
                width={64}
                height={64}
                className="w-full h-full drop-shadow-lg"
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{planet.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {planet.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {statusLabels[planet.explorationStatus]}
            </Badge>
            {planet.lastExplored && (
              <Badge variant="secondary" className="text-xs">
                Ostatnia eksploracja: {planet.lastExplored}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <Tooltip key={stat.label}>
                <TooltipTrigger asChild>
                  <div className="rounded-lg border bg-muted/30 p-3 cursor-help transition-colors hover:bg-muted/50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{stat.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Poziom zagrożenia</span>
              <span className="font-mono">{planet.dangerLevel}/10</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${planet.dangerLevel * 10}%`,
                  background: `linear-gradient(90deg, #22c55e, #eab308, #ef4444)`,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
