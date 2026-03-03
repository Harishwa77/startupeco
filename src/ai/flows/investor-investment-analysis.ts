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
  prompt: `You are an Advanced AI Startup Ecosystem Engine operating as an AI Venture Capitalist within a Firebase-based platform. Your task is to provide a comprehensive investment attractiveness evaluation for a startup.

Instructions:
1. Evaluate the investment attractiveness of the startup based on the provided data.
2. Estimate realistic 1-year, 3-year, and 5-year growth projections.
3. Estimate a conservative projected ROI percentage.
4. Simulate the startup's probability of survival during an economic recession.
5. Identify and list key risk factors.
6. Provide a clear investment recommendation: "Invest", "Observe", or "Avoid".
7. Assign measurable scores (0-100) for riskScore, returnPotential, and stabilityIndex.

General Rules:
- Be analytical and data-driven.
- Provide realistic projections.
- Avoid motivational fluff.
- Think conservatively like a real investor.
- Ensure numerical scores are justified logically.
- Return ONLY valid JSON as per the specified output schema.
- Do NOT include explanations or any additional text outside the JSON.

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
    return output!;
  }
);
