'use server';
/**
 * @fileOverview A Genkit flow for evaluating a founder's startup idea.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fetchIndustryNews } from '@/services/news-service';
import { fetchMarketBenchmarks } from '@/services/market-service';

const FounderStartupEvaluationInputSchema = z.object({
  startupIdea: z.string().describe('The core idea of the startup.'),
  industry: z.string().describe('The industry the startup operates in.'),
  targetMarket: z.string().describe('The primary target market for the startup.'),
  region: z.string().describe('The geographical region of operation.'),
  budget: z.string().describe('The initial budget available.'),
  teamSize: z.string().describe('The current size of the founder\'s team.'),
  founderData: z.string().describe('Details about the founder(s) and their experience.'),
  marketData: z.string().optional().describe('Additional market data provided by the user.'),
  competitionData: z.string().optional().describe('Information about existing competitors.'),
});
export type FounderStartupEvaluationInput = z.infer<typeof FounderStartupEvaluationInputSchema>;

const FounderStartupEvaluationOutputSchema = z.object({
  mode: z.literal('founder'),
  evaluation: z.string().describe('Evaluation of the clarity and uniqueness of the startup idea.'),
  improvedIdea: z.string().describe('An optimized version of the startup idea.'),
  innovationSuggestions: z.array(z.string()).describe('Three concrete innovation improvements.'),
  revenueModelOptimization: z.string().describe('Suggestions for optimizing the revenue model.'),
  technicalStack: z.array(z.string()).describe('Recommended technical stack for implementation.'),
  apiRecommendations: z.array(z.object({
    name: z.string().describe('Name of the API.'),
    purpose: z.string().describe('Why this API is crucial for this startup.'),
    benefit: z.string().describe('The strategic advantage it provides.')
  })).describe('Strategic external APIs to integrate.'),
  roadmap_3_months: z.array(z.string()).describe('A 3-month execution roadmap with key milestones.'),
  marketAnalysis: z.string().describe('A data-driven market analysis.'),
  riskAnalysis: z.string().describe('A comprehensive risk analysis.'),
  scores: z.object({
    marketViability: z.number().int().min(0).max(100).describe('Score for market viability (0-100).'),
    competitionIntensity: z.number().int().min(0).max(100).describe('Score for competition intensity (0-100).'),
    scalability: z.number().int().min(0).max(100).describe('Score for scalability potential (0-100).'),
    innovationIndex: z.number().int().min(0).max(100).describe('Score for the innovation index (0-100).'),
    overallStartupFitness: z.number().int().min(0).max(100).describe('Overall fitness score for the startup (0-100).'),
  }),
});
export type FounderStartupEvaluationOutput = z.infer<typeof FounderStartupEvaluationOutputSchema>;

export async function evaluateFounderStartup(
  input: FounderStartupEvaluationInput
): Promise<FounderStartupEvaluationOutput> {
  return founderStartupEvaluationFlow(input);
}

const founderStartupEvaluationPrompt = ai.definePrompt({
  name: 'founderStartupEvaluationPrompt',
  input: { 
    schema: FounderStartupEvaluationInputSchema.extend({ 
      realTimeNews: z.string().optional(),
      marketBenchmarks: z.string().optional()
    }) 
  },
  output: { schema: FounderStartupEvaluationOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine, acting as an AI Startup Accelerator and AI Product Strategist.

Your task is to provide a comprehensive, analytical, and data-driven evaluation of a startup idea for a founder.

Input details:
Startup Idea: {{{startupIdea}}}
Industry: {{{industry}}}
Target Market: {{{targetMarket}}}
Region: {{{region}}}
Budget: {{{budget}}}
Team Size: {{{teamSize}}}

{{#if marketBenchmarks}}Real-time Market Benchmarks:
{{{marketBenchmarks}}}{{/if}}

{{#if realTimeNews}}Real-time Industry News Context:
{{{realTimeNews}}}{{/if}}

Based on the provided input, perform the following tasks and return ONLY valid JSON.
CRITICAL: You must set the "mode" property in the output JSON to exactly "founder".

Tasks:
1. Evaluate Clarity and Uniqueness.
2. Suggest 3 Innovation Improvements.
3. Optimize Revenue Model.
4. Suggest Technical Stack & API Recommendations (Include at least 3 high-value APIs).
5. Generate 3-Month Execution Roadmap.
6. Provide Market & Risk Analysis: Grounded in the provided news and market benchmarks.
7. Score the Startup (0-100).

Return ONLY valid JSON.`,
});

const founderStartupEvaluationFlow = ai.defineFlow(
  {
    name: 'founderStartupEvaluationFlow',
    inputSchema: FounderStartupEvaluationInputSchema,
    outputSchema: FounderStartupEvaluationOutputSchema,
  },
  async (input) => {
    const [realTimeNews, marketBenchmarks] = await Promise.all([
      fetchIndustryNews(input.industry),
      fetchMarketBenchmarks(input.industry)
    ]);

    const { output } = await founderStartupEvaluationPrompt({
      ...input,
      realTimeNews,
      marketBenchmarks,
    });
    
    if (!output) {
      throw new Error('Failed to generate founder startup evaluation.');
    }
    return output;
  }
);
