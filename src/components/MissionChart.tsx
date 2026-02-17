"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { MissionChartData } from "@/types/types";

interface MissionChartProps {
  data: MissionChartData[];
}

const chartConfig = {
  missions: {
    label: "Misje",
    color: "oklch(0.65 0.2 260)",
  },
  discoveries: {
    label: "Odkrycia",
    color: "oklch(0.7 0.18 160)",
  },
} satisfies ChartConfig;

export function MissionChart({ data }: MissionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillMissions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-missions)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-missions)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillDiscoveries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-discoveries)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-discoveries)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/30" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-muted-foreground"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="missions"
          stroke="var(--color-missions)"
          fill="url(#fillMissions)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="discoveries"
          stroke="var(--color-discoveries)"
          fill="url(#fillDiscoveries)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
