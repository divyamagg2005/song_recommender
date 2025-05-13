// 'use server';
/**
 * @fileOverview Analyzes image description and preferences to recommend a song.
 *
 * - analyzeImageDescription - A function that takes image description, song type, and optional image to recommend a song.
 * - AnalyzeImageDescriptionInput - The input type for the analyzeImageDescription function.
 * - AnalyzeImageDescriptionOutput - The return type for the analyzeImageDescription function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageDescriptionInputSchema = z.object({
  imageDescription: z.string().describe('Description of the image or scene.'),
  songType: z.string().describe('Type of song (e.g., latest, old, genre).'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "Optional: A photo of the scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzeImageDescriptionInput = z.infer<typeof AnalyzeImageDescriptionInputSchema>;

const AnalyzeImageDescriptionOutputSchema = z.object({
  songRecommendation: z.string().describe('Recommended song based on the image description and song type.'),
  reasoning: z.string().describe('Reasoning behind the song recommendation.'),
});

export type AnalyzeImageDescriptionOutput = z.infer<typeof AnalyzeImageDescriptionOutputSchema>;

export async function analyzeImageDescription(
  input: AnalyzeImageDescriptionInput
): Promise<AnalyzeImageDescriptionOutput> {
  return analyzeImageDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageDescriptionPrompt',
  input: {schema: AnalyzeImageDescriptionInputSchema},
  output: {schema: AnalyzeImageDescriptionOutputSchema},
  prompt: `You are a music recommendation expert. Given an image description and song type preference, you will recommend a song that fits the description.

Image Description: {{{imageDescription}}}
Song Type: {{{songType}}}

{{#if imageDataUri}}
Image: {{media url=imageDataUri}}
{{/if}}

Consider the image description and song type to provide a relevant song recommendation and explain your reasoning.  The songRecommendation field should just contain the song title and artist.
`,
});

const analyzeImageDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeImageDescriptionFlow',
    inputSchema: AnalyzeImageDescriptionInputSchema,
    outputSchema: AnalyzeImageDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
