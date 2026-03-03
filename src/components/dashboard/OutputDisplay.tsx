"use client";

import React from "react";
import { EngineMode, EngineResult } from "./Dashboard";
import { FounderResults } from "./founder/FounderResults";
import { InvestorResults } from "./investor/InvestorResults";
import { InternResults } from "./intern/InternResults";
import { EvolutionResults } from "./evolution/EvolutionResults";
import { Loader2, Terminal, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface OutputDisplayProps {
  mode: EngineMode;
  results: EngineResult | null;
  isLoading: boolean;
}

export function OutputDisplay({ mode, results, isLoading }: OutputDisplayProps) {
  if (isLoading) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 bg-secondary/10 border border-border/30 rounded-xl">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <div className="text-center">
          <p className="text-xl font-headline font-bold text-foreground">Processing Analytical Engine</p>
          <p className="text-muted-foreground font-body">Generating multi-layered strategic insights...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 text-center p-8 bg-secondary/10 border border-border/30 rounded-xl border-dashed">
        <div className="p-4 bg-secondary rounded-full">
          <Terminal className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-headline font-semibold text-foreground">Ready for Input</h3>
          <p className="text-muted-foreground font-body max-w-md mx-auto mt-2">
            Configure your parameters on the left and run the analysis to generate data-driven reports for {mode} mode.
          </p>
        </div>
        <div className="flex gap-4 text-xs font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
          <div className="flex items-center gap-1"><Info className="w-3 h-3" /> Real-time Projections</div>
          <div className="flex items-center gap-1"><Info className="w-3 h-3" /> Risk Assessment</div>
          <div className="flex items-center gap-1"><Info className="w-3 h-3" /> Scalability Scoring</div>
        </div>
      </div>
    );
  }

  const { output, input } = results;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dynamic Results based on Mode */}
      {mode === "founder" && <FounderResults data={output} input={input} />}
      {mode === "investor" && <InvestorResults data={output} />}
      {mode === "intern" && <InternResults data={output} />}
      {mode === "evolution" && <EvolutionResults data={output} />}

      {/* Raw JSON viewer for structured output requirement */}
      <Card className="p-6 bg-[#0B0E14] border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-headline font-semibold uppercase tracking-widest text-muted-foreground">Structured Engine Output (JSON)</h3>
          <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded border border-accent/30 font-code">ECHELON_STREAMS_V1.0</span>
        </div>
        <pre className="font-code text-xs text-accent/80 overflow-x-auto p-4 rounded bg-black/40 border border-border/30 max-h-[400px]">
          {JSON.stringify(output, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
