"use client";

import React, { useState } from "react";
import { Rocket, Globe, Users, Star, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PlanetCard } from "@/components/PlanetCard";
import { PlanetDialog } from "@/components/PlanetDialog";
import { MissionChart } from "@/components/MissionChart";
import { MissionApplicationForm } from "@/components/MissionApplicationForm";
import { DataList } from "@/components/DataList";
import { PLANETS, MISSION_CHART_DATA, RECENT_MISSIONS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExplorablePlanet, Mission, MissionStatus } from "@/types/types";

const statusLabels: Record<MissionStatus, string> = {
  planned: "Planowana",
  "in-progress": "W trakcie",
  completed: "Zakończona",
  failed: "Niepowodzenie",
};

const statusColors: Record<MissionStatus, string> = {
  planned: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function HomePage() {
  const [selectedPlanet, setSelectedPlanet] = useState<ExplorablePlanet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function handlePlanetSelect(planet: ExplorablePlanet) {
    setSelectedPlanet(planet);
    setIsDialogOpen(true);
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-32" id="dashboard">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Rocket className="w-4 h-4 text-primary" />
              <span>Eksploracja Kosmosu 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              Odkrywaj Kosmos
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                z CosmicVoyager
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
              Monitoruj misje kosmiczne, eksploruj planety i dołącz do załogi
              następnej wielkiej wyprawy w głąb Układu Słonecznego.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="#planets"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <Globe className="w-4 h-4" />
                Eksploruj planety
              </a>
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-lg border bg-card/50 backdrop-blur-sm px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:border-primary/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Aplikuj na misję
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard variant="highlight">
            <StatCard.Icon>
              <Rocket className="w-5 h-5" />
            </StatCard.Icon>
            <StatCard.Value>33</StatCard.Value>
            <StatCard.Label>Wykonanych misji</StatCard.Label>
          </StatCard>
          <StatCard>
            <StatCard.Icon>
              <Globe className="w-5 h-5" />
            </StatCard.Icon>
            <StatCard.Value>6</StatCard.Value>
            <StatCard.Label>Zbadanych planet</StatCard.Label>
          </StatCard>
          <StatCard>
            <StatCard.Icon>
              <Users className="w-5 h-5" />
            </StatCard.Icon>
            <StatCard.Value>128</StatCard.Value>
            <StatCard.Label>Kosmonautów</StatCard.Label>
          </StatCard>
          <StatCard>
            <StatCard.Icon>
              <Star className="w-5 h-5" />
            </StatCard.Icon>
            <StatCard.Value>47</StatCard.Value>
            <StatCard.Label>Odkryć naukowych</StatCard.Label>
          </StatCard>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24" id="planets">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Eksploruj planety
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Wybierz planetę, aby zobaczyć szczegóły misji eksploracyjnych i dane naukowe.
          </p>
        </div>

        <DataList<ExplorablePlanet>
          items={PLANETS}
          keyExtractor={(planet) => planet.id}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          renderItem={(planet) => (
            <PlanetCard
              planet={planet}
              onSelect={handlePlanetSelect}
            />
          )}
        />
      </section>

      <section className="container mx-auto px-4 py-10" id="missions">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Aktywność misji
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <MissionChart data={MISSION_CHART_DATA} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Ostatnie misje</CardTitle>
            </CardHeader>
            <CardContent>
              <DataList<Mission>
                items={RECENT_MISSIONS}
                keyExtractor={(mission) => mission.id}
                className="space-y-3"
                renderItem={(mission) => (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
                    <div className="min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm font-medium truncate cursor-help">
                            {mission.name}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          Cel: {mission.destination} · Załoga: {mission.crewSize}
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground">
                        {mission.destination}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] flex-shrink-0 ${statusColors[mission.status]}`}
                    >
                      {statusLabels[mission.status]}
                    </Badge>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24" id="apply">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Dołącz do załogi
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Wypełnij formularz aplikacyjny, aby zostać członkiem następnej misji kosmicznej.
          </p>
        </div>
        <MissionApplicationForm />
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 CosmicVoyager. Projekt zaliczeniowy.
        </div>
      </footer>

      <PlanetDialog
        planet={selectedPlanet}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
