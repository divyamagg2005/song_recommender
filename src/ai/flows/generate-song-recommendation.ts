// 'use server';

/**
 * @fileOverview AI agent that recommends songs based on image description and music preferences.
 *
 * - generateSongRecommendation - A function that generates song recommendations.
 * - GenerateSongRecommendationInput - The input type for the generateSongRecommendation function.
 * - GenerateSongRecommendationOutput - The return type for the generateSongRecommendation function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSongRecommendationInputSchema = z.object({
  photoDescription: z
    .string()
    .describe('A description of the photo or scene for which to generate a song recommendation.'),
  musicPreference: z
    .string()
    .describe(
      'The preferred music style or genre, and whether the user prefers latest or old songs.'
    ),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateSongRecommendationInput = z.infer<typeof GenerateSongRecommendationInputSchema>;

const GenerateSongRecommendationOutputSchema = z.object({
  songRecommendation: z.string().describe('The recommended song for the Instagram story.'),
  reasoning: z.string().describe('The reasoning behind the song recommendation.'),
});
export type GenerateSongRecommendationOutput = z.infer<typeof GenerateSongRecommendationOutputSchema>;

export async function generateSongRecommendation(
  input: GenerateSongRecommendationInput
): Promise<GenerateSongRecommendationOutput> {
  return generateSongRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSongRecommendationPrompt',
  input: {schema: GenerateSongRecommendationInputSchema},
  output: {schema: GenerateSongRecommendationOutputSchema},
  prompt: `You are an AI music expert specializing in recommending songs for Instagram stories.

You will use the description of the photo and the user's music preferences to recommend a song that fits the mood and style.

Consider the genre and the preference for latest or old songs.

Photo Description: {{{photoDescription}}}
Music Preference: {{{musicPreference}}}
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}

Based on the above information, provide a song recommendation and explain your reasoning.
`,
});

const generateSongRecommendationFlow = ai.defineFlow(
  {
    name: 'generateSongRecommendationFlow',
    inputSchema: GenerateSongRecommendationInputSchema,
    outputSchema: GenerateSongRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
