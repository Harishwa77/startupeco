"use client";

import React, { useState } from "react";
import { ModeSelector } from "./ModeSelector";
import { InputForm } from "./InputForm";
import { OutputDisplay } from "./OutputDisplay";
import { Card } from "@/components/ui/card";
import { Zap, Shield, TrendingUp, BrainCircuit, User as UserIcon, LogOut, LogIn } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type EngineMode = "founder" | "investor" | "intern" | "evolution";

export interface EngineResult {
  output: any;
  input: any;
}

export function Dashboard() {
  const [mode, setMode] = useState<EngineMode>("founder");
  const [results, setResults] = useState<EngineResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignIn = () => {
    initiateAnonymousSignIn(auth);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
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
        
        <div className="flex flex-col items-end gap-4">
          {isUserLoading ? (
            <div className="h-10 w-32 bg-secondary animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-xl border border-border/50">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-headline font-bold uppercase tracking-tighter opacity-70">Authenticated</p>
                <p className="text-[10px] font-code text-accent truncate max-w-[100px]">{user.uid}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn} variant="outline" className="gap-2 font-headline uppercase tracking-wider text-xs border-primary/50 hover:bg-primary/10">
              <LogIn className="h-4 w-4" />
              Secure Connect
            </Button>
          )}
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
            results={results} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}
