'use server';
/**
 * @fileOverview An AI Venture Capitalist agent for evaluating startup investment attractiveness.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fetchIndustryNews } from '@/services/news-service';
import { fetchMarketBenchmarks } from '@/services/market-service';

const InvestorInvestmentAnalysisInputSchema = z.object({
  mode: z.literal('investor'),
  startupIdea: z.string().describe('The core idea of the startup.'),
  industry: z.string().describe('The industry the startup operates in.'),
  targetMarket: z.string().describe('The target market segment.'),
  region: z.string().describe('The geographical region of operation.'),
  budget: z.string().describe('The current budget or funding of the startup.'),
  teamSize: z.string().describe('The size of the startup team.'),
  founderData: z.string().describe('Data pertaining to the founders.'),
  startupData: z.string().describe('General data about the startup.'),
  marketData: z.string().describe('Current market data and trends.'),
  competitionData: z.string().describe('Information about competitors.'),
  registeredStartupsCount: z.number().describe('Total startups in the pool.'),
  investmentAmount: z.string().describe('The amount the investor is considering committing.'),
});
export type InvestorInvestmentAnalysisInput = z.infer<typeof InvestorInvestmentAnalysisInputSchema>;

const InvestorInvestmentAnalysisOutputSchema = z.object({
  mode: z.literal('investor'),
  investmentSummary: z.string().describe('A summary of the investment attractiveness.'),
  growthProjection: z.object({
    '1_year': z.string().describe('Estimated growth projection for 1 year.'),
    '3_year': z.string().describe('Estimated growth projection for 3 years.'),
    '5_year': z.string().describe('Estimated growth projection for 5 years.'),
  }),
  valuationData: z.array(z.object({
    year: z.string(),
    valuation: z.number().describe('Projected valuation in thousands of USD.'),
    revenue: z.number().describe('Projected revenue in thousands of USD.'),
  })).describe('Numerical projection data for charting.'),
  estimatedROI: z.string().describe('Estimated Return on Investment percentage.'),
  recessionSurvivalProbability: z.string().describe('Simulation of recession survival probability.'),
  majorRisks: z.array(z.string()).describe('Identification of key risk factors.'),
  recommendation: z.string().describe('Investment recommendation: Invest / Observe / Avoid.'),
  poolSaturationAnalysis: z.string().describe('Analysis of how this startup compares to the registered pool.'),
  scores: z.object({
    riskScore: z.number().min(0).max(100).describe('Risk score (0-100).'),
    returnPotential: z.number().min(0).max(100).describe('Return potential score (0-100).'),
    stabilityIndex: z.number().min(0).max(100).describe('Stability index score (0-100).'),
  }),
});
export type InvestorInvestmentAnalysisOutput = z.infer<typeof InvestorInvestmentAnalysisOutputSchema>;

export async function investorInvestmentAnalysis(input: InvestorInvestmentAnalysisInput): Promise<InvestorInvestmentAnalysisOutput> {
  return investorInvestmentAnalysisFlow(input);
}

const investorInvestmentAnalysisPrompt = ai.definePrompt({
  name: 'investorInvestmentAnalysisPrompt',
  input: { 
    schema: InvestorInvestmentAnalysisInputSchema.extend({ 
      realTimeNews: z.string().optional(),
      marketBenchmarks: z.string().optional()
    }) 
  },
  output: { schema: InvestorInvestmentAnalysisOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine operating as an AI Venture Capitalist. 

Your task is to provide a comprehensive investment attractiveness evaluation. 

CRITICAL: You must set the "mode" property in the output JSON to exactly "investor".

Input Benchmarks:
{{#if marketBenchmarks}}Live Market Benchmarks:
{{{marketBenchmarks}}}{{/if}}

{{#if realTimeNews}}Live Industry News:
{{{realTimeNews}}}{{/if}}

Startup Details:
Idea: {{{startupIdea}}}
Revenue Data: {{{startupData}}}
Industry: {{{industry}}}

Instructions:
1. Evaluate attractiveness for a check of {{{investmentAmount}}}.
2. Provide a 5-year numerical growth projection for valuation and revenue (in $1000s). Use exactly 5 data points (Year 1, 2, 3, 4, 5).
3. Estimate ROI and risks, specifically factoring in the Live Market Benchmarks provided.
4. Compare this startup to the existing pool of {{{registeredStartupsCount}}} startups.

Return ONLY valid JSON.`,
});

const investorInvestmentAnalysisFlow = ai.defineFlow(
  {
    name: 'investorInvestmentAnalysisFlow',
    inputSchema: InvestorInvestmentAnalysisInputSchema,
    outputSchema: InvestorInvestmentAnalysisOutputSchema,
  },
  async (input) => {
    const [realTimeNews, marketBenchmarks] = await Promise.all([
      fetchIndustryNews(input.industry),
      fetchMarketBenchmarks(input.industry)
    ]);

    const { output } = await investorInvestmentAnalysisPrompt({
      ...input,
      realTimeNews,
      marketBenchmarks,
    });
    
    if (!output) throw new Error('Failed to generate investor analysis');
    return output;
  }
);
