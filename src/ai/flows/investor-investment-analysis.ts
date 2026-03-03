'use server';
/**
 * @fileOverview An AI Venture Capitalist agent for evaluating startup investment attractiveness.
 *
 * - investorInvestmentAnalysis - A function that handles the investor investment analysis process.
 * - InvestorInvestmentAnalysisInput - The input type for the investorInvestmentAnalysis function.
 * - InvestorInvestmentAnalysisOutput - The return type for the investorInvestmentAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InvestorInvestmentAnalysisInputSchema = z.object({
  mode: z.literal('investor'),
  startupIdea: z.string().describe('The core idea of the startup.'),
  industry: z.string().describe('The industry the startup operates in.'),
  targetMarket: z.string().describe('The target market segment.'),
  region: z.string().describe('The geographical region of operation.'),
  budget: z.string().describe('The current budget or funding of the startup.'),
  teamSize: z.string().describe('The size of the startup team.'),
  founderData: z.string().describe('Data pertaining to the founders (e.g., experience, background).'),
  startupData: z.string().describe('General data about the startup (e.g., traction, past performance).'),
  marketData: z.string().describe('Current market data and trends relevant to the startup.'),
  competitionData: z.string().describe('Information about competitors and the competitive landscape.'),
  registeredStartupsCount: z.number().describe('The total number of startups currently registered in the platform pool.'),
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
  estimatedROI: z.string().describe('Estimated Return on Investment percentage.'),
  recessionSurvivalProbability: z.string().describe('Simulation of recession survival probability.'),
  majorRisks: z.array(z.string()).describe('Identification of key risk factors.'),
  recommendation: z.string().describe('Investment recommendation: Invest / Observe / Avoid.'),
  poolSaturationAnalysis: z.string().describe('Analysis of how this startup compares to the registered pool of competitors.'),
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
  input: { schema: InvestorInvestmentAnalysisInputSchema },
  output: { schema: InvestorInvestmentAnalysisOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine operating as an AI Venture Capitalist. 

Your task is to provide a comprehensive investment attractiveness evaluation. You must also consider the context of the platform's startup pool.

CRITICAL: You must set the "mode" property in the output JSON to exactly "investor".

Instructions:
1. Evaluate the investment attractiveness for a potential check of {{{investmentAmount}}}.
2. Consider that there are {{{registeredStartupsCount}}} other startups in the pool. Analyze how this specific startup stands out (poolSaturationAnalysis).
3. Estimate realistic 1-year, 3-year, and 5-year growth projections.
4. Estimate a conservative projected ROI percentage.
5. Simulate the startup's probability of survival during an economic recession.
6. Identify and list key risk factors.
7. Provide a clear investment recommendation: "Invest", "Observe", or "Avoid".
8. Assign measurable scores (0-100) for riskScore, returnPotential, and stabilityIndex.

General Rules:
- Be analytical and data-driven.
- Provide realistic projections.
- Avoid motivational fluff.
- Think conservatively like a real investor.
- Return ONLY valid JSON.

Startup Details:
Startup Idea: {{{startupIdea}}}
Industry: {{{industry}}}
Target Market: {{{targetMarket}}}
Region: {{{region}}}
Budget: {{{budget}}}
Team Size: {{{teamSize}}}
Founder Data: {{{founderData}}}
Startup Data: {{{startupData}}}
Market Data: {{{marketData}}}
Competition Data: {{{competitionData}}}`,
});

const investorInvestmentAnalysisFlow = ai.defineFlow(
  {
    name: 'investorInvestmentAnalysisFlow',
    inputSchema: InvestorInvestmentAnalysisInputSchema,
    outputSchema: InvestorInvestmentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await investorInvestmentAnalysisPrompt(input);
    if (!output) throw new Error('Failed to generate investor analysis');
    return output;
  }
);
