'use server';
/**
 * @fileOverview This file implements the Genkit flow for the "intern" mode of the Advanced AI Startup Ecosystem Engine.
 * It analyzes an intern's skills and experience to match them with suitable startups,
 * calculates compatibility scores, suggests roles, and identifies skill gaps.
 *
 * - internStartupMatching - The main function to initiate the intern matching process.
 * - InternStartupMatchingInput - The input type for the internStartupMatching function.
 * - InternStartupMatchingOutput - The return type for the internStartupMatching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const InternStartupMatchingInputSchema = z.object({
  internSkills: z.string().describe('Detailed list of the intern\u0027s skills, e.g., "Proficient in Python, JavaScript, React, SQL, Cloud computing (AWS)."'),
  internExperience: z.string().describe('Detailed description of the intern\u0027s experience, e.g., "Developed a full-stack web application, contributed to open-source projects, worked on data analysis tasks."'),
  availableStartups: z.array(z.string()).describe('A list of available startup names or brief descriptions for matching, e.g., ["InnovateTech: AI-driven logistics platform", "GreenHarvest: Sustainable agriculture tech", "CodeCrafters: Developer tooling startup"].'),
});
export type InternStartupMatchingInput = z.infer<typeof InternStartupMatchingInputSchema>;

// Output Schema
const MatchedStartupSchema = z.object({
  startupName: z.string().describe('The name of the matched startup.'),
  compatibilityScore: z.number().int().min(0).max(100).describe('A score (0-100) indicating compatibility between the intern and the startup. Higher is better.'),
  recommendedRole: z.string().describe('The suggested role for the intern in this startup, based on their skills and the startup\u0027s needs.'),
});

const InternStartupMatchingOutputSchema = z.object({
  mode: z.literal("intern"),
  internStrengthAnalysis: z.string().describe('An analytical summary of the intern\u0027s key strengths based on their skills and experience.'),
  matchedStartups: z.array(MatchedStartupSchema).max(3).describe('A list of up to 3 suitable startups matched with the intern, including compatibility scores and recommended roles.'),
  skillGapSuggestions: z.array(z.string()).describe('Suggestions for specific skills the intern should improve or acquire to enhance their marketability or fit for target roles.'),
});
export type InternStartupMatchingOutput = z.infer<typeof InternStartupMatchingOutputSchema>;

// Prompt Input Schema - for what the prompt itself consumes
const InternStartupMatchingPromptInputSchema = z.object({
  internSkills: z.string(),
  internExperience: z.string(),
  availableStartupsListString: z.string().describe('A newline-separated list of available startups for the AI to consider.'),
});

// Define the prompt
const internStartupMatchingPrompt = ai.definePrompt({
  name: 'internStartupMatchingPrompt',
  input: { schema: InternStartupMatchingPromptInputSchema },
  output: { schema: InternStartupMatchingOutputSchema },
  prompt: `You are an Advanced AI Startup Ecosystem Engine, specifically functioning as an AI Talent Matching System. Your goal is to analyze intern data and match them with suitable startups, providing accurate compatibility scores and role recommendations.\n\nFollow these rules:\n1. Be analytical and data-driven.\n2. Provide realistic projections.\n3. Avoid motivational fluff.\n4. Use measurable scoring (0-100 scale).\n5. Think conservatively like a real investor.\n6. Always return ONLY valid JSON.\n7. Do NOT include explanations outside JSON.\n8. Do NOT use markdown formatting.\n\nBased on the following intern information and available startups, perform the requested tasks.\n\nIntern Skills:\n{{{internSkills}}}\n\nIntern Experience:\n{{{internExperience}}}\n\nAvailable Startups:\n{{{availableStartupsListString}}}\n\nTasks:\n1. Analyze the intern's strengths from their skills and experience.\n2. Match the intern with the top 3 most suitable startups from the 'Available Startups' list.\n3. For each matched startup, calculate a compatibility score (0-100). This score should reflect how well the intern's skills and experience align with the startup's needs and industry.\n4. For each matched startup, suggest a realistic and appropriate role for the intern.\n5. Identify specific skill gaps and suggest concrete improvements for the intern.\n\nReturn your response ONLY as a JSON object matching the following structure:\n\n{\n  "mode": "intern",\n  "internStrengthAnalysis": "...",\n  "matchedStartups": [\n    {\n      "startupName": "Startup A",\n      "compatibilityScore": 75,\n      "recommendedRole": "Software Engineer Intern"\n    },\n    {\n      "startupName": "Startup B",\n      "compatibilityScore": 60,\n      "recommendedRole": "Data Analyst Intern"\n    }\n  ],\n  "skillGapSuggestions": [\n    "Improve data visualization skills",\n    "Learn basic cloud security"\n  ]\n}`,
});

// Define the flow
const internStartupMatchingFlow = ai.defineFlow(
  {
    name: 'internStartupMatchingFlow',
    inputSchema: InternStartupMatchingInputSchema,
    outputSchema: InternStartupMatchingOutputSchema,
  },
  async (input) => {
    // Format the availableStartups array into a newline-separated string for the prompt
    const availableStartupsListString = input.availableStartups
      .map((s, index) => `${index + 1}. ${s}`)
      .join('\n');

    const { output } = await internStartupMatchingPrompt({
      internSkills: input.internSkills,
      internExperience: input.internExperience,
      availableStartupsListString: availableStartupsListString,
    });
    return output!;
  }
);

/**
 * Initiates the intern matching process.
 * Analyzes an intern's skills and experience against available startups
 * to provide compatibility scores, role recommendations, and skill gap suggestions.
 *
 * @param input - An object containing the intern's skills, experience, and a list of available startups.
 * @returns A promise that resolves to an object containing the intern's strength analysis,
 *          matched startups with compatibility scores and roles, and skill gap suggestions.
 */
export async function internStartupMatching(input: InternStartupMatchingInput): Promise<InternStartupMatchingOutput> {
  return internStartupMatchingFlow(input);
}
