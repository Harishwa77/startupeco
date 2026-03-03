"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreGridProps {
  scores: Record<string, number>;
}

export function ScoreGrid({ scores }: ScoreGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {Object.entries(scores).map(([label, value]) => (
        <Card key={label} className="p-4 bg-secondary/50 border-border/50 flex flex-col justify-between">
          <div className="mb-2">
            <p className="text-[10px] font-headline font-bold uppercase tracking-wider text-muted-foreground truncate">
              {label.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-2xl font-headline font-bold text-foreground">{value}%</p>
          </div>
          <Progress 
            value={value} 
            className="h-1 bg-background" 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              // Use CSS variables or raw values for dynamic colors
            }}
          />
        </Card>
      ))}
    </div>
  );
}