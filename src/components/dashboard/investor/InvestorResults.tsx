"use client";

import { ScoreGrid } from "../ScoreGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, TrendingUp, BarChart4, Gavel, HandCoins, Users, LineChart as ChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface InvestorResultsProps {
  data: any;
}

export function InvestorResults({ data }: InvestorResultsProps) {
  const { toast } = useToast();

  const getRecommendationColor = (rec: string) => {
    const r = rec.toLowerCase();
    if (r.includes("invest")) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (r.includes("avoid")) return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  };

  const handleInvest = () => {
    toast({
      title: "Investment Committed",
      description: "Your investment interest has been logged for this startup.",
    });
  };

  const chartData = data.valuationData || [
    { year: 'Y1', valuation: 500, revenue: 100 },
    { year: 'Y2', valuation: 1200, revenue: 300 },
    { year: 'Y3', valuation: 2500, revenue: 800 },
    { year: 'Y4', valuation: 4800, revenue: 1500 },
    { year: 'Y5', valuation: 8500, revenue: 3200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Investment Attractiveness Memo</h2>
          <p className="text-sm text-muted-foreground font-body">Deep-dive financial and risk benchmarking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getRecommendationColor(data.recommendation)}>
            {data.recommendation}
          </Badge>
          <Button onClick={handleInvest} className="bg-accent hover:bg-accent/90 text-accent-foreground font-headline font-bold uppercase tracking-wider text-xs h-10 px-6 shadow-lg shadow-accent/20">
            <HandCoins className="w-4 h-4 mr-2" />
            Commit Capital
          </Button>
        </div>
      </div>

      <ScoreGrid scores={data.scores} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="p-6 bg-card border-border/50 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-accent" />
              <h3 className="font-headline font-semibold">5-Year Growth Trajectory</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Valuation ($K)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Revenue ($K)</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  tickFormatter={(val) => `$${val/1000}M`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-3 rounded-lg shadow-2xl">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">{payload[0].payload.year} Projection</p>
                          <div className="space-y-1">
                            <p className="text-sm font-headline font-bold text-primary">Valuation: ${payload[0].value?.toLocaleString()}K</p>
                            <p className="text-sm font-headline font-bold text-accent">Revenue: ${payload[1].value?.toLocaleString()}K</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="valuation" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50 lg:col-span-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="font-headline font-semibold">Strategic Position</h3>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Market Context</p>
              <p className="text-xs font-body leading-relaxed text-foreground/80 italic">
                {data.poolSaturationAnalysis}
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-6">
            <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Estimated ROI</span>
                <span className="text-xl font-headline font-bold text-accent">{data.estimatedROI}</span>
              </div>
            </div>
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <span className="text-[10px] text-destructive uppercase font-bold block mb-1">Recession Survival</span>
              <p className="text-lg font-headline font-bold text-foreground">{data.recessionSurvivalProbability}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50">
          <h3 className="font-headline font-semibold mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-accent" />
            Executive Summary
          </h3>
          <p className="text-sm font-body leading-relaxed text-foreground/80 bg-secondary/10 p-4 rounded-xl border border-border/30">
            {data.investmentSummary}
          </p>
        </Card>

        <Card className="p-6 bg-[#1A1111] border-destructive/20">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            <h3 className="font-headline font-semibold text-destructive uppercase tracking-widest text-xs">High-Priority Risks</h3>
          </div>
          <ul className="grid grid-cols-1 gap-3">
            {data.majorRisks.map((risk: string, i: number) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10 text-xs font-body text-foreground/80">
                <span className="w-2 h-2 rounded-full bg-destructive mt-1 flex-shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
