"use client";

import { EngineMode } from "./Dashboard";
import { cn } from "@/lib/utils";
import { User, Briefcase, GraduationCap, Dna } from "lucide-react";

interface ModeSelectorProps {
  currentMode: EngineMode;
  onModeChange: (mode: EngineMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes: { id: EngineMode; label: string; icon: any }[] = [
    { id: "founder", label: "Founder", icon: User },
    { id: "investor", label: "Investor", icon: Briefcase },
    { id: "intern", label: "Talent", icon: GraduationCap },
    { id: "evolution", label: "Evolution", icon: Dna },
  ];

  return (
    <div className="inline-flex p-1 bg-secondary rounded-xl border border-border/50 shadow-inner">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-headline font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary-foreground/10"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}