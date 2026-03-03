'use server';
/**
 * @fileOverview This file implements a Genkit flow for the 'founder' mode of the EchelonAI engine.
 * It helps founders generate and refine startup ideas by providing evaluation, innovation suggestions,
 * technical stack recommendations, a 3-month roadmap, market and risk analyses, and various performance scores.
 *
 * - aiStartupIdeaGeneration - The main function to trigger the AI startup idea generation process.
 * - AiStartupIdeaGenerationInput - The input type for the aiStartupIdeaGeneration function.
 * - AiStartupIdeaGenerationOutput - The return type for the aiStartupIdeaGeneration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiStartupIdeaGenerationInputSchema = z.object({
  startupIdea: z.string().describe('The initial startup idea.'),
  industry: z.string().describe('The industry the startup operates in.'),
  targetMarket: z.string().describe('The target market for the startup.'),
  region: z.string().describe('The geographical region for the startup operation.'),
  budget: z.string().describe('The initial budget available for the startup.'),
  teamSize: z.string().describe('The current or projected size of the founding team.'),
  founderData: z.string().describe('Additional data about the founder, their experience, or skills.'),
});
export type AiStartupIdeaGenerationInput = z.infer<typeof AiStartupIdeaGenerationInputSchema>;

const AiStartupIdeaGenerationOutputSchema = z.object({
  mode: z.literal('founder'),
  evaluation: z.string().describe('Evaluation of clarity and uniqueness of the startup idea.'),
  improvedIdea: z.string().describe('A refined and improved version of the startup idea.'),
  innovationSuggestions: z.array(z.string()).min(3).max(3).describe('Three distinct innovation improvements for the idea.'),
  revenueModelOptimization: z.string().describe('Suggestions to optimize the revenue model.'),
  technicalStack: z.array(z.string()).describe('Recommended technical stack for the startup.'),
  roadmap_3_months: z.array(z.string()).describe('A 3-month execution roadmap.'),
  marketAnalysis: z.string().describe('Market analysis based on the provided inputs.'),
  riskAnalysis: z.string().describe('Identification and analysis of key risks.'),
  scores: z.object({
    marketViability: z.number().min(0).max(100).describe('Score for market viability (0-100).'),
    competitionIntensity: z.number().min(0).max(100).describe('Score for competition intensity (0-100).'),
    scalability: z.number().min(0).max(100).describe('Score for scalability potential (0-100).'),
    innovationIndex: z.number().min(0).max(100).describe('Score for the innovation level of the idea (0-100).'),
    overallStartupFitness: z.number().min(0).max(100).describe('Overall fitness score for the startup idea (0-100).'),
  }),
});
export type AiStartupIdeaGenerationOutput = z.infer<typeof AiStartupIdeaGenerationOutputSchema>;

export async function aiStartupIdeaGeneration(input: AiStartupIdeaGenerationInput): Promise<AiStartupIdeaGenerationOutput> {
  return aiStartupIdeaGenerationFlow(input);
}

const aiStartupIdeaGenerationPrompt = ai.definePrompt({
  name: 'aiStartupIdeaGenerationPrompt',
  input: { schema: AiStartupIdeaGenerationInputSchema },
  output: { schema: AiStartupIdeaGenerationOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine, specifically acting as an AI Startup Accelerator and Market Analyst.
Your goal is to provide a realistic, analytical, and data-driven evaluation of a startup idea, avoiding motivational fluff and unrealistic projections. You must think conservatively like a real investor.

Based on the following input, provide a comprehensive analysis and detailed suggestions, and strictly return ONLY valid JSON that conforms to the specified output schema.

Input Data:
Startup Idea: {{{startupIdea}}}
Industry: {{{industry}}}
Target Market: {{{targetMarket}}}
Region: {{{region}}}
Budget: {{{budget}}}
Team Size: {{{teamSize}}}
Founder Data: {{{founderData}}}

Tasks:
1. Evaluate the clarity and uniqueness of the startup idea.
2. Suggest exactly 3 distinct innovation improvements to enhance the idea's value proposition.
3. Optimize the revenue model, suggesting realistic and scalable strategies.
4. Suggest a robust and scalable technical stack suitable for the proposed startup.
5. Generate a realistic 3-month execution roadmap with actionable steps.
6. Provide a concise market analysis, highlighting opportunities and challenges.
7. Provide a conservative risk analysis, identifying critical potential pitfalls.
8. Assign measurable scores from 0-100 for:
   - marketViability: How viable is the market for this idea?
   - competitionIntensity: How intense is the competition? (Higher score = more intense)
   - scalability: How easily can this startup scale?
   - innovationIndex: How innovative is the idea?
   - overallStartupFitness: An overall assessment of the startup's potential.

Ensure all numerical scores are justified logically and reflect a conservative investor mindset.

Output JSON:`,
});

const aiStartupIdeaGenerationFlow = ai.defineFlow(
  {
    name: 'aiStartupIdeaGenerationFlow',
    inputSchema: AiStartupIdeaGenerationInputSchema,
    outputSchema: AiStartupIdeaGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await aiStartupIdeaGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate startup idea analysis.');
    }
    return output;
  }
);
