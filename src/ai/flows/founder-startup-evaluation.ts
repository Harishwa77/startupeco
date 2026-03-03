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

Based on the provided input, perform the following tasks and return ONLY valid JSON that strictly adheres to the output schema:

1.  **Evaluate Clarity and Uniqueness**: Provide a direct and concise evaluation of the startup idea's clarity and its unique selling proposition.
2.  **Suggest 3 Innovation Improvements**: Propose three distinct and actionable innovation improvements to enhance the idea.
3.  **Optimize Revenue Model**: Suggest specific, data-backed strategies to optimize the revenue model.
4.  **Suggest Technical Stack**: Recommend a suitable and realistic technical stack for implementing this startup, considering scalability and cost.
5.  **Generate 3-Month Execution Roadmap**: Create a realistic 3-month execution roadmap with critical milestones and objectives.
6.  **Provide Market Analysis**: Deliver a thorough market analysis, focusing on market size, trends, and opportunities.
7.  **Provide Risk Analysis**: Identify and analyze key risks, including market, operational, financial, and competitive risks.
8.  **Score the Startup (0-100)**: Assign numerical scores (0-100) for the following metrics, justifying them implicitly through your analysis:
    -   marketViability: The potential for the startup to succeed in its target market.
    -   competitionIntensity: The level of competition in the industry.
    -   scalability: The ease with which the startup can grow and expand.
    -   innovationIndex: The originality and novelty of the startup idea and its proposed solutions.
    -   overallStartupFitness: A comprehensive score reflecting the overall strength and potential of the startup.

Remember to:
-   Be analytical and data-driven.
-   Provide realistic projections.
-   Avoid motivational fluff.
-   Use measurable scoring (0-100 scale).
-   Think conservatively like a real investor.
-   Always return ONLY valid JSON.
-   Do NOT include explanations outside JSON.
-   Do NOT use markdown formatting (except for within the JSON string values if necessary).

Your response should be a single JSON object.`,
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
