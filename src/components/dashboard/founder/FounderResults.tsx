"use client";

import { useState } from "react";
import { ScoreGrid } from "../ScoreGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Cpu, Map, Globe, Loader2, ShieldCheck, Link2 } from "lucide-react";
import { useFirestore, useUser, useAuth } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface FounderResultsProps {
  data: any;
  input: any;
}

export function FounderResults({ data, input }: FounderResultsProps) {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!user) {
      initiateAnonymousSignIn(auth);
      toast({
        title: "Establishing Connection",
        description: "We are creating a secure session for you. Please click 'Register' again once connected.",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const startupData = {
        founderId: user.uid,
        name: `${input.industry || 'Unnamed'} Venture - ${Math.floor(Math.random() * 1000)}`,
        ideaDescription: data.improvedIdea || input.startupIdea,
        industry: input.industry || "General",
        targetMarket: input.targetMarket || "Global",
        region: input.region || "Online",
        initialBudget: parseFloat(input.budget?.replace(/[^0-9.]/g, '')) || 0,
        currentRevenue: 0,
        teamSize: parseInt(input.teamSize) || 1,
        createdAt: serverTimestamp(),
      };

      addDocumentNonBlocking(collection(db, "startups_for_investment"), startupData);
      
      toast({
        title: "Success: Startup Registered",
        description: "Your venture has been added to the investment pool.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not register your startup idea.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Strategic Analysis Report</h2>
          <p className="text-sm text-muted-foreground font-body">Multivariate startup viability and execution assessment.</p>
        </div>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-bold uppercase tracking-wider text-xs gap-2 min-w-[220px] shadow-lg shadow-primary/20"
        >
          {isPublishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : user ? (
            <Globe className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          {user ? "Publish to Investment Pool" : "Connect & Register"}
        </Button>
      </header>

      <ScoreGrid scores={data.scores} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Evaluation & Improved Concept</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 rounded border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1 font-headline uppercase tracking-wider font-bold">Original Evaluation</p>
              <p className="text-sm font-body text-foreground/90 leading-relaxed">{data.evaluation}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 shadow-inner">
              <p className="text-[10px] text-primary mb-1 font-headline uppercase tracking-wider font-bold">Optimized Concept</p>
              <p className="text-sm font-body italic text-primary-foreground/90 leading-relaxed">"{data.improvedIdea}"</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Strategic API Integrations</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {data.apiRecommendations?.map((api: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/30 flex items-start gap-3">
                <div className="bg-accent/20 text-accent p-1.5 rounded-md mt-0.5">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-headline font-bold">{api.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{api.purpose}</p>
                </div>
              </div>
            ))}
            {!data.apiRecommendations && <p className="text-xs text-muted-foreground italic">Generating strategic API layer...</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Revenue Optimization</h3>
          </div>
          <p className="text-sm font-body leading-relaxed text-muted-foreground">{data.revenueModelOptimization}</p>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Innovation Boosters</h3>
          </div>
          <ul className="space-y-2">
            {data.innovationSuggestions.map((suggestion: string, i: number) => (
              <li key={i} className="flex gap-2 text-[13px] font-body text-muted-foreground">
                <span className="text-accent font-bold">•</span> {suggestion}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 bg-card border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <h3 className="font-headline font-semibold">Technical Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.technicalStack.map((tech: string, i: number) => (
              <Badge key={i} variant="outline" className="bg-secondary/50 font-code text-[10px] py-1 border-border/50">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Map className="w-5 h-5 text-accent" />
          <h3 className="font-headline font-semibold uppercase tracking-widest text-xs">3-Month Execution Roadmap</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.roadmap_3_months.map((milestone: string, i: number) => (
            <div key={i} className="relative p-5 bg-secondary/20 rounded-xl border border-border/50 group hover:border-accent/30 transition-colors">
              <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-xs font-bold text-accent shadow-lg">M{i+1}</span>
              <p className="text-sm font-body leading-tight mt-2">{milestone}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50">
          <h3 className="font-headline font-semibold mb-4 text-accent uppercase tracking-tighter">Market Analysis</h3>
          <p className="text-sm font-body leading-relaxed text-muted-foreground">{data.marketAnalysis}</p>
        </Card>
        <Card className="p-6 bg-[#1A1111] border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-headline font-semibold text-destructive uppercase tracking-tighter">Risk Assessment</h3>
          </div>
          <p className="text-sm font-body leading-relaxed text-destructive-foreground/80">{data.riskAnalysis}</p>
        </Card>
      </div>
    </div>
  );
}
