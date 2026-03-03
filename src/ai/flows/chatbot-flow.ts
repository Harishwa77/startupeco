'use server';
/**
 * @fileOverview A Genkit flow for the EchelonAI Neural Assistant Chatbot.
 * This assistant provides strategic guidance and help within the startup ecosystem.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user\'s latest message.'),
  history: z.array(MessageSchema).optional().describe('Previous messages in the conversation.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The AI\'s response text.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const history = input.history?.map(m => ({
      role: m.role,
      content: [{ text: m.content }]
    })) || [];

    const { text } = await ai.generate({
      system: `You are the EchelonAI Neural Assistant. You are a highly professional, analytical, and helpful AI partner specializing in the startup ecosystem.
      Your goal is to assist users—founders, investors, and talent—with strategic advice and platform navigation.
      
      Guidelines:
      1. Be concise and professional.
      2. Use data-driven language.
      3. Explain EchelonAI's modes:
         - Founder Mode: Roadmap generation, Geospatial Intelligence, and API stacks.
         - Investor Mode: Growth projections, ROI simulation, and risk memos.
         - Talent Mode: Semantic matching between skills and the startup pool.
         - Evolution Mode: Genetic mutation of startup ideas.
      4. Avoid fluff. Think like a top-tier VC analyst.`,
      messages: [
        ...history,
        { role: 'user', content: [{ text: input.message }] }
      ],
    });

    return { response: text };
  }
);
