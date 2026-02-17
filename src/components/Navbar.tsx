"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            CosmicVoyager
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", href: "#dashboard" },
            { label: "Planety", href: "#planets" },
            { label: "Misje", href: "#missions" },
            { label: "Aplikuj", href: "#apply" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={
                "relative px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg " +
                "transition-all duration-200 " +
                "hover:text-foreground hover:bg-accent " +
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:text-foreground " +
                "active:scale-95 active:bg-accent/80"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex md:hidden">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
