"use client";

import { ScoreGrid } from "../ScoreGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, TrendingUp, BarChart4, Gavel } from "lucide-react";

interface InvestorResultsProps {
  data: any;
}

export function InvestorResults({ data }: InvestorResultsProps) {
  const growthData = [
    { name: '1 Year', value: 10 }, // Dummy values for chart since the API returns strings
    { name: '3 Year', value: 35 },
    { name: '5 Year', value: 85 },
  ];

  const getRecommendationColor = (rec: string) => {
    const r = rec.toLowerCase();
    if (r.includes("invest")) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (r.includes("avoid")) return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-headline font-bold text-foreground">Investment Attractiveness Memo</h2>
        <Badge className={getRecommendationColor(data.recommendation)}>
          Recommendation: {data.recommendation}
        </Badge>
      </div>

      <ScoreGrid scores={data.scores} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50 space-y-6">
          <div className="flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Growth Projections</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-secondary/50 rounded border border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Year 1</p>
                <p className="text-xs font-medium">{data.growthProjection['1_year']}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded border border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Year 3</p>
                <p className="text-xs font-medium">{data.growthProjection['3_year']}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded border border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Year 5</p>
                <p className="text-xs font-medium">{data.growthProjection['5_year']}</p>
              </div>
            </div>
            
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-headline">Estimated ROI</span>
                <span className="text-lg font-bold text-accent">{data.estimatedROI}</span>
              </div>
              <Progress value={65} className="h-2 bg-background" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Resilience & Risks</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase mb-2">Recession Survival Probability</p>
              <p className="text-lg font-bold text-foreground">{data.recessionSurvivalProbability}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Key Risk Factors</p>
              <ul className="grid grid-cols-1 gap-2">
                {data.majorRisks.map((risk: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-body text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border/50">
        <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-accent" />
          Investment Summary
        </h3>
        <p className="text-sm font-body leading-relaxed text-foreground/90 bg-secondary/20 p-4 rounded border border-border/30">
          {data.investmentSummary}
        </p>
      </Card>
    </div>
  );
}