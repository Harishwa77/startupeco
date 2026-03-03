"use client";

import React, { useState, useMemo } from "react";
import { EngineMode, EngineResult } from "./Dashboard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { evaluateFounderStartup } from "@/ai/flows/founder-startup-evaluation";
import { investorInvestmentAnalysis } from "@/ai/flows/investor-investment-analysis";
import { internStartupMatching } from "@/ai/flows/intern-startup-matching";
import { evolutionStartupMutation } from "@/ai/flows/evolution-startup-mutation";
import { Loader2, Play, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection } from "firebase/firestore";

interface InputFormProps {
  mode: EngineMode;
  onResultsReceived: (data: EngineResult) => void;
  onLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export function InputForm({ mode, onResultsReceived, onLoading, isLoading }: InputFormProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const startupsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, "startups_for_investment");
  }, [db, user]);

  const { data: startupPool, isLoading: isPoolLoading } = useCollection(startupsQuery);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");

  const [formData, setFormData] = useState({
    startupIdea: "",
    industry: "",
    targetMarket: "",
    region: "",
    budget: "",
    teamSize: "",
    founderData: "",
    startupData: "",
    internSkills: "",
    internExperience: "",
    availableStartups: "InnovateTech, GreenHarvest, CodeCrafters",
    marketData: "",
    competitionData: "",
    investmentAmount: "50000"
  });

  const selectedStartup = useMemo(() => {
    return startupPool?.find(s => s.id === selectedStartupId);
  }, [startupPool, selectedStartupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoading(true);
    try {
      let result;
      let inputPayload: any = { ...formData };

      if (mode === "founder") {
        result = await evaluateFounderStartup({
          startupIdea: formData.startupIdea,
          industry: formData.industry,
          targetMarket: formData.targetMarket,
          region: formData.region,
          budget: formData.budget,
          teamSize: formData.teamSize,
          founderData: formData.founderData,
          marketData: formData.marketData,
          competitionData: formData.competitionData
        });
      } else if (mode === "investor") {
        if (!selectedStartup) {
          throw new Error("Please select a startup from the pool.");
        }
        inputPayload = {
          ...formData,
          selectedStartupName: selectedStartup.name,
          selectedStartupIdea: selectedStartup.ideaDescription
        };
        result = await investorInvestmentAnalysis({
          mode: "investor",
          startupIdea: selectedStartup.ideaDescription,
          industry: selectedStartup.industry,
          targetMarket: selectedStartup.targetMarket,
          region: selectedStartup.region,
          budget: selectedStartup.initialBudget?.toString() || "0",
          teamSize: selectedStartup.teamSize?.toString() || "1",
          founderData: "Registered Founder Data",
          startupData: `Current Revenue: $${selectedStartup.currentRevenue}`,
          marketData: formData.marketData,
          competitionData: formData.competitionData,
          registeredStartupsCount: startupPool?.length || 0,
          investmentAmount: formData.investmentAmount
        });
      } else if (mode === "intern") {
        result = await internStartupMatching({
          internSkills: formData.internSkills,
          internExperience: formData.internExperience,
          availableStartups: formData.availableStartups.split(",").map(s => s.trim())
        });
      } else if (mode === "evolution") {
        result = await evolutionStartupMutation({
          startupIdea: formData.startupIdea,
          industry: formData.industry,
          targetMarket: formData.targetMarket,
          region: formData.region,
          budget: formData.budget,
          teamSize: formData.teamSize,
          startupData: formData.startupData,
          availableStartups: formData.availableStartups.split(",").map(s => s.trim()),
          marketData: formData.marketData,
          competitionData: formData.competitionData
        });
      }
      
      onResultsReceived({ output: result, input: inputPayload });
    } catch (error: any) {
      console.error("Engine Error:", error);
      toast({
        variant: "destructive",
        title: "Engine Error",
        description: error.message || "Failed to process the request."
      });
    } finally {
      onLoading(false);
    }
  };

  const renderFields = () => {
    if (mode === "intern") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="internSkills">Skills</Label>
            <Textarea 
              id="internSkills" 
              name="internSkills" 
              placeholder="e.g. Python, React, SQL, AWS..." 
              value={formData.internSkills}
              onChange={handleChange}
              className="bg-background/50 border-border/50 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internExperience">Experience</Label>
            <Textarea 
              id="internExperience" 
              name="internExperience" 
              placeholder="Describe your past roles or projects..." 
              value={formData.internExperience}
              onChange={handleChange}
              className="bg-background/50 border-border/50 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableStartups">Available Startups (Comma separated)</Label>
            <Input 
              id="availableStartups" 
              name="availableStartups" 
              value={formData.availableStartups}
              onChange={handleChange}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>
      );
    }

    if (mode === "investor") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Startup from Pool</Label>
            <Select onValueChange={setSelectedStartupId} value={selectedStartupId}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder={!user ? "Connect to browse pool" : (isPoolLoading ? "Loading pool..." : "Select a startup")} />
              </SelectTrigger>
              <SelectContent>
                {startupPool?.map((startup) => (
                  <SelectItem key={startup.id} value={startup.id}>
                    {startup.name} ({startup.industry})
                  </SelectItem>
                ))}
                {(!startupPool || startupPool.length === 0) && !isPoolLoading && (
                  <SelectItem value="none" disabled>No startups in pool</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedStartup && (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-headline font-bold uppercase">Startup Data</span>
              </div>
              <p className="text-sm font-medium">{selectedStartup.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 italic">"{selectedStartup.ideaDescription}"</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-muted-foreground uppercase">Revenue</span>
                <span className="text-sm font-code font-bold text-primary">${selectedStartup.currentRevenue.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="investmentAmount">Proposed Investment (USD)</Label>
            <Input 
              id="investmentAmount" 
              name="investmentAmount" 
              type="number" 
              value={formData.investmentAmount} 
              onChange={handleChange} 
              className="bg-background/50 border-border/50 border-accent/30" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketData">Contextual Market Data (Optional)</Label>
            <Textarea id="marketData" name="marketData" placeholder="Latest industry trends..." value={formData.marketData} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="competitionData">Contextual Competition Data (Optional)</Label>
            <Textarea id="competitionData" name="competitionData" placeholder="Recent competitor moves..." value={formData.competitionData} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startupIdea">Startup Idea</Label>
          <Textarea 
            id="startupIdea" 
            name="startupIdea" 
            placeholder="What problem are you solving?" 
            value={formData.startupIdea}
            onChange={handleChange}
            className="bg-background/50 border-border/50 min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" placeholder="Fintech" value={formData.industry} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetMarket">Target Market</Label>
            <Input id="targetMarket" name="targetMarket" placeholder="SMEs" value={formData.targetMarket} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input id="budget" name="budget" placeholder="100,000" value={formData.budget} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input id="teamSize" name="teamSize" placeholder="4" value={formData.teamSize} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
        </div>

        {mode === "founder" && (
          <div className="space-y-2">
            <Label htmlFor="founderData">Founder Experience</Label>
            <Textarea id="founderData" name="founderData" placeholder="Relevant skills of the team..." value={formData.founderData} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
        )}

        {mode === "evolution" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startupData">Traction Data</Label>
              <Textarea id="startupData" name="startupData" placeholder="Current revenue, users, etc." value={formData.startupData} onChange={handleChange} className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketData">Market Data</Label>
              <Textarea id="marketData" name="marketData" placeholder="Trends, market size..." value={formData.marketData} onChange={handleChange} className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitionData">Competition Data</Label>
              <Textarea id="competitionData" name="competitionData" placeholder="Direct and indirect competitors..." value={formData.competitionData} onChange={handleChange} className="bg-background/50 border-border/50" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFields()}
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-semibold h-12 gap-2"
        disabled={isLoading || (mode === "investor" && !selectedStartupId)}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            ENGINE RUNNING...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            RUN ANALYSIS
          </>
        )}
      </Button>
    </form>
  );
}
