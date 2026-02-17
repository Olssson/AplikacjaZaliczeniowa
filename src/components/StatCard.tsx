"use client";

import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface StatCardContextValue {
  variant?: "default" | "highlight";
}

const StatCardContext = createContext<StatCardContextValue>({ variant: "default" });

interface StatCardRootProps {
  children: React.ReactNode;
  variant?: "default" | "highlight";
  className?: string;
}

function StatCardRoot({ children, variant = "default", className }: StatCardRootProps) {
  return (
    <StatCardContext.Provider value={{ variant }}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
          "active:scale-[0.98]",
          "focus-within:ring-2 focus-within:ring-primary/20",
          variant === "highlight" && "border-primary/40 bg-primary/5",
          className
        )}
      >
        {children}
      </div>
    </StatCardContext.Provider>
  );
}

interface StatCardIconProps {
  children: React.ReactNode;
  className?: string;
}

function StatCardIcon({ children, className }: StatCardIconProps) {
  const { variant } = useContext(StatCardContext);
  return (
    <div
      className={cn(
        "mb-3 inline-flex items-center justify-center rounded-lg p-2.5",
        variant === "highlight"
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardValueProps {
  children: React.ReactNode;
  className?: string;
}

function StatCardValue({ children, className }: StatCardValueProps) {
  return (
    <p className={cn("text-3xl font-bold tracking-tight", className)}>
      {children}
    </p>
  );
}

interface StatCardLabelProps {
  children: React.ReactNode;
  className?: string;
}

function StatCardLabel({ children, className }: StatCardLabelProps) {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Icon: StatCardIcon,
  Value: StatCardValue,
  Label: StatCardLabel,
});
