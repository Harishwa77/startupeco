"use client";

import { ScoreGrid } from "../ScoreGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Cpu, Map } from "lucide-react";

interface FounderResultsProps {
  data: any;
}

export function FounderResults({ data }: FounderResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-headline font-bold text-foreground">Strategic Analysis Report</h2>
        <ScoreGrid scores={data.scores} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Evaluation & Improved Concept</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 rounded border border-border/30">
              <p className="text-xs text-muted-foreground mb-1 font-headline uppercase tracking-wider">Evaluation</p>
              <p className="text-sm font-body">{data.evaluation}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded border border-primary/20">
              <p className="text-xs text-primary mb-1 font-headline uppercase tracking-wider">Refined Idea</p>
              <p className="text-sm font-body italic">"{data.improvedIdea}"</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Innovation Suggetions</h3>
          </div>
          <ul className="space-y-3">
            {data.innovationSuggestions.map((suggestion: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm font-body">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Revenue Optimization</h3>
          </div>
          <p className="text-sm font-body leading-relaxed">{data.revenueModelOptimization}</p>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Recommended Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.technicalStack.map((tech: string, i: number) => (
              <Badge key={i} variant="outline" className="bg-secondary/50 font-code text-[10px] py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Map className="w-5 h-5 text-accent" />
          <h3 className="font-headline font-semibold">3-Month Execution Roadmap</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block"></div>
          {data.roadmap_3_months.map((milestone: string, i: number) => (
            <div key={i} className="relative z-10 bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-2">
              <span className="text-[10px] font-headline font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded">Month {i+1}</span>
              <p className="text-sm font-body leading-tight">{milestone}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50">
          <h3 className="font-headline font-semibold mb-4 text-accent">Market Dynamics</h3>
          <p className="text-sm font-body leading-relaxed">{data.marketAnalysis}</p>
        </Card>
        <Card className="p-6 bg-[#1A1111] border-destructive/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-headline font-semibold text-destructive">Risk Assessment</h3>
          </div>
          <p className="text-sm font-body leading-relaxed text-destructive-foreground/80">{data.riskAnalysis}</p>
        </Card>
      </div>
    </div>
  );
}