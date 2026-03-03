'use server';
/**
 * @fileOverview A Genkit flow for the 'evolution' mode of the EchelonAI engine.
 *
 * This flow takes an existing startup concept and generates mutated variations
 * with improved differentiation, pricing, scalability, and AI innovation.
 * It identifies the best variant for future development based on a fitness score.
 *
 * - evolutionStartupMutation - The main function to call the evolution flow.
 * - EvolutionStartupMutationInput - The input type for the evolutionStartupMutation function.
 * - EvolutionStartupMutationOutput - The return type for the evolutionStartupMutation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EvolutionStartupMutationInputSchema = z.object({
  startupIdea: z.string().describe('The core startup idea.'),
  industry: z.string().describe('The industry the startup operates in.'),
  targetMarket: z.string().describe('The target market for the startup.'),
  region: z.string().describe('The geographical region of operation.'),
  budget: z.string().describe('The available budget for the startup.'),
  teamSize: z.string().describe('The current team size of the startup.'),
  startupData: z.string().describe('Existing data and metrics about the startup.'),
  availableStartups: z.array(z.string()).describe('List of available startups for comparison or context.'),
  marketData: z.string().describe('Relevant market research data.'),
  competitionData: z.string().describe('Information about competitors in the market.')
});
export type EvolutionStartupMutationInput = z.infer<typeof EvolutionStartupMutationInputSchema>;

const EvolutionStartupMutationOutputSchema = z.object({
  mode: z.literal('evolution').describe('The operational mode of the AI Engine.'),
  mutations: z.array(z.object({
    idea: z.string().describe('A mutated version of the startup idea.'),
    innovationAdded: z.string().describe('The AI-driven or tech innovation added.'),
    pricingStrategy: z.string().describe('The optimized pricing strategy for this variant.'),
    fitnessScore: z.number().int().min(0).max(100).describe('A score (0-100) indicating the overall fitness of this variant.')
  })).describe('List of mutated startup variations.'),
  bestVariant: z.object({
    idea: z.string().describe('The idea of the best variant.'),
    fitnessScore: z.number().int().min(0).max(100).describe('The fitness score of the best variant.')
  }).describe('The best startup variant identified.')
});
export type EvolutionStartupMutationOutput = z.infer<typeof EvolutionStartupMutationOutputSchema>;

export async function evolutionStartupMutation(input: EvolutionStartupMutationInput): Promise<EvolutionStartupMutationOutput> {
  return evolutionStartupMutationFlow(input);
}

const evolutionStartupMutationPrompt = ai.definePrompt({
  name: 'evolutionStartupMutationPrompt',
  input: { schema: EvolutionStartupMutationInputSchema },
  output: { schema: EvolutionStartupMutationOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine, specifically functioning as an AI Genetic Startup Evolution Engine.

You must generate a response that is:
1. Analytical and data-driven.
2. Provides realistic projections.
3. Avoids motivational fluff.
4. Uses measurable scoring (0-100 scale).
5. Thinks conservatively like a real investor.
6. Returns ONLY valid JSON.
7. Does NOT include explanations outside JSON.
8. Does NOT use markdown formatting.

Your task is to take the provided startup concept and evolve it.

CURRENT STARTUP CONCEPT DETAILS:
Startup Idea: {{{startupIdea}}}
Industry: {{{industry}}}
Target Market: {{{targetMarket}}}
Region: {{{region}}}
Budget: {{{budget}}}
Team Size: {{{teamSize}}}
Startup Data: {{{startupData}}}
Available Startups (for context): {{{availableStartups}}}
Market Data: {{{marketData}}}
Competition Data: {{{competitionData}}}


Based on the above information, perform the following tasks:
1. Create 3 distinct mutated startup variations. Each variation must clearly show improved differentiation from the original idea and existing competition.
2. Optimize the pricing strategy for each mutated variant to maximize profitability and market penetration.
3. Identify specific ways to increase scalability for each variant.
4. Add a unique AI-driven or cutting-edge tech innovation to each variant, explaining how it enhances the core offering.
5. Assign a 'fitnessScore' from 0 to 100 to each variant, reflecting its potential for success, scalability, and market impact, considering all improvements.
6. Select the 'bestVariant' among the three, stating its idea and fitness score.

Ensure your output directly adheres to the following JSON structure without any additional text or formatting:

{
  "mode": "evolution",
  "mutations": [
    {
      "idea": "",
      "innovationAdded": "",
      "pricingStrategy": "",
      "fitnessScore": 0
    },
    {
      "idea": "",
      "innovationAdded": "",
      "pricingStrategy": "",
      "fitnessScore": 0
    },
    {
      "idea": "",
      "innovationAdded": "",
      "pricingStrategy": "",
      "fitnessScore": 0
    }
  ],
  "bestVariant": {
    "idea": "",
    "fitnessScore": 0
  }
}`
});

const evolutionStartupMutationFlow = ai.defineFlow(
  {
    name: 'evolutionStartupMutationFlow',
    inputSchema: EvolutionStartupMutationInputSchema,
    outputSchema: EvolutionStartupMutationOutputSchema,
  },
  async (input) => {
    const { output } = await evolutionStartupMutationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate evolution mutations.');
    }
    return output;
  }
);
