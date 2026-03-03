'use server';
/**
 * @fileOverview A Genkit flow for evaluating a founder's startup idea.
 *
 * - evaluateFounderStartup - A function that handles the founder startup evaluation process.
 * - FounderStartupEvaluationInput - The input type for the evaluateFounderStartup function.
 * - FounderStartupEvaluationOutput - The return type for the evaluateFounderStartup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  input: { schema: FounderStartupEvaluationInputSchema },
  output: { schema: FounderStartupEvaluationOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine, acting as an AI Startup Accelerator and AI Product Strategist.

Your task is to provide a comprehensive, analytical, and data-driven evaluation of a startup idea for a founder. Your analysis must be realistic, conservative, and avoid motivational fluff.

Input details:
Startup Idea: {{{startupIdea}}}
Industry: {{{industry}}}
Target Market: {{{targetMarket}}}
Region: {{{region}}}
Budget: {{{budget}}}
Team Size: {{{teamSize}}}
Founder Data: {{{founderData}}}
{{#if marketData}}Market Data: {{{marketData}}}{{/if}}
{{#if competitionData}}Competition Data: {{{competitionData}}}{{/if}}

Based on the provided input, perform the following tasks and return ONLY valid JSON that strictly adheres to the output schema.
CRITICAL: You must set the "mode" property in the output JSON to exactly "founder".

1.  **Evaluate Clarity and Uniqueness**: Provide a direct and concise evaluation.
2.  **Suggest 3 Innovation Improvements**: Propose three distinct and actionable innovation improvements.
3.  **Optimize Revenue Model**: Suggest specific, data-backed strategies.
4.  **Suggest Technical Stack & API Recommendations**: Recommend a technical stack AND at least 3 high-value external APIs (e.g., Stripe for payments, Plaid for fintech, Twilio for comms, etc.) that would make the venture more "attractive" to investors by increasing automation or data richness.
5.  **Generate 3-Month Execution Roadmap**: Create a realistic 3-month execution roadmap.
6.  **Provide Market & Risk Analysis**: Deliver thorough, conservative assessments.
7.  **Score the Startup (0-100)**.

Remember to be analytical, avoid fluff, and return ONLY valid JSON.`,
});

const founderStartupEvaluationFlow = ai.defineFlow(
  {
    name: 'founderStartupEvaluationFlow',
    inputSchema: FounderStartupEvaluationInputSchema,
    outputSchema: FounderStartupEvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await founderStartupEvaluationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate founder startup evaluation.');
    }
    return output;
  }
);
