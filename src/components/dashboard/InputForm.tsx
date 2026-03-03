"use client";

import React, { useState } from "react";
import { EngineMode } from "./Dashboard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { evaluateFounderStartup } from "@/ai/flows/founder-startup-evaluation";
import { investorInvestmentAnalysis } from "@/ai/flows/investor-investment-analysis";
import { internStartupMatching } from "@/ai/flows/intern-startup-matching";
import { evolutionStartupMutation } from "@/ai/flows/evolution-startup-mutation";
import { Loader2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InputFormProps {
  mode: EngineMode;
  onResultsReceived: (data: any) => void;
  onLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export function InputForm({ mode, onResultsReceived, onLoading, isLoading }: InputFormProps) {
  const { toast } = useToast();
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
    competitionData: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoading(true);
    try {
      let result;
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
        result = await investorInvestmentAnalysis({
          mode: "investor",
          startupIdea: formData.startupIdea,
          industry: formData.industry,
          targetMarket: formData.targetMarket,
          region: formData.region,
          budget: formData.budget,
          teamSize: formData.teamSize,
          founderData: formData.founderData,
          startupData: formData.startupData,
          marketData: formData.marketData,
          competitionData: formData.competitionData
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
      onResultsReceived(result);
    } catch (error) {
      console.error("Engine Error:", error);
      toast({
        variant: "destructive",
        title: "Engine Error",
        description: "Failed to process the request. Please check inputs."
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

        {mode === "investor" && (
          <div className="space-y-2">
            <Label htmlFor="startupData">Traction Data</Label>
            <Textarea id="startupData" name="startupData" placeholder="Current revenue, users, etc." value={formData.startupData} onChange={handleChange} className="bg-background/50 border-border/50" />
          </div>
        )}

        {(mode === "investor" || mode === "evolution") && (
          <div className="space-y-4">
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
        disabled={isLoading}
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