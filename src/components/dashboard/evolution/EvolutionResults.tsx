"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dna, Sparkles, Trophy, Cpu, DollarSign } from "lucide-react";

interface EvolutionResultsProps {
  data: any;
}

export function EvolutionResults({ data }: EvolutionResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold text-foreground flex items-center gap-2">
          <Dna className="w-6 h-6 text-accent" />
          Startup Mutation Pool
        </h2>
        <Badge className="bg-accent/20 text-accent border-accent/30 font-headline uppercase">
          Evolution Mode Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.mutations.map((mutation: any, i: number) => (
          <Card key={i} className="p-6 bg-card border-border/50 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-muted-foreground uppercase border border-border/50 px-2 py-0.5 rounded">Variant 0{i+1}</span>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase">Fitness</p>
                  <p className="text-lg font-bold text-accent">{mutation.fitnessScore}</p>
                </div>
              </div>
              <p className="text-sm font-body font-medium leading-relaxed italic">"{mutation.idea}"</p>
              
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <Cpu className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Innovation Added</p>
                    <p className="text-xs">{mutation.innovationAdded}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DollarSign className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Pricing Strategy</p>
                    <p className="text-xs">{mutation.pricingStrategy}</p>
                  </div>
                </div>
              </div>
            </div>
            <Progress value={mutation.fitnessScore} className="h-1 bg-background mt-4" />
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-8 opacity-5">
           <Trophy className="w-64 h-64 text-accent" />
        </div>
        <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground font-headline font-bold text-xs uppercase shadow-xl">
            <Sparkles className="w-4 h-4" />
            Selected Best Variant
          </div>
          <h3 className="text-2xl font-headline font-bold text-foreground">"{data.bestVariant.idea}"</h3>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="bg-secondary/50 px-6 py-3 rounded-2xl border border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase font-headline">Overall Fitness Score</p>
              <p className="text-3xl font-bold text-accent">{data.bestVariant.fitnessScore}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}