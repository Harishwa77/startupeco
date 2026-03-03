"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { chatbotResponse } from "@/ai/flows/chatbot-flow";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Neural Link established. I am the EchelonAI Assistant. How can I optimize your strategy today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' as const : 'user' as const,
        content: m.content
      }));

      const result = await chatbotResponse({
        message: userMsg,
        history: history as any
      });

      setMessages(prev => [...prev, { role: 'model', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Error: Neural connection interrupted. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 bg-card overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <header className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-headline font-bold uppercase tracking-tight">Neural Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] opacity-80 uppercase font-medium">Sync Active</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/10 text-white">
              <X className="w-4 h-4" />
            </Button>
          </header>

          <ScrollArea className="flex-1 p-4 bg-[#0B0E14]/50">
            <div className="space-y-4" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                    m.role === 'user' ? "bg-accent text-accent-foreground" : "bg-primary/20 text-primary border border-primary/20"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-accent/10 border border-accent/20 text-foreground rounded-tr-none" 
                      : "bg-secondary/50 border border-border/50 text-foreground/90 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-secondary/50 border border-border/50 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 bg-secondary/20">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input 
                placeholder="Query neural database..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-background/50 border-border/50 focus-visible:ring-primary/50"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90 shadow-primary/30"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-accent fill-accent animate-pulse" />
          </div>
        )}
      </Button>
    </div>
  );
}
