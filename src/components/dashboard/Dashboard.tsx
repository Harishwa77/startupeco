"use client";

import React, { useState } from "react";
import { ModeSelector } from "./ModeSelector";
import { InputForm } from "./InputForm";
import { OutputDisplay } from "./OutputDisplay";
import { Card } from "@/components/ui/card";
import { Zap, Shield, TrendingUp, Users, BrainCircuit } from "lucide-react";

export type EngineMode = "founder" | "investor" | "intern" | "evolution";

export function Dashboard() {
  const [mode, setMode] = useState<EngineMode>("founder");
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-foreground">
              ECHELON<span className="text-accent">AI</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-body max-w-xl">
            Advanced AI Startup Ecosystem Engine. Strategic intelligence for founders, investors, and talent.
          </p>
        </div>
        <div className="flex gap-4">
          <ModeSelector currentMode={mode} onModeChange={(m) => {
            setMode(m);
            setResults(null);
          }} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Card className="p-6 bg-card border-border/50 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-headline font-semibold">Engine Configuration</h2>
            </div>
            <InputForm 
              mode={mode} 
              onResultsReceived={setResults} 
              onLoading={setIsLoading}
              isLoading={isLoading}
            />
          </Card>

          {/* Sidebar Stats / Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 flex items-center gap-4">
              <Shield className="w-8 h-8 text-primary opacity-80" />
              <div>
                <p className="text-xs font-headline uppercase tracking-wider text-muted-foreground">Compliance</p>
                <p className="text-sm font-medium">Data-Driven Security</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-accent opacity-80" />
              <div>
                <p className="text-xs font-headline uppercase tracking-wider text-muted-foreground">Analysis</p>
                <p className="text-sm font-medium">Real-time Market Metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <OutputDisplay 
            mode={mode} 
            data={results} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}