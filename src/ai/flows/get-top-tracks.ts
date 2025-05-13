'use server';
/**
 * @fileOverview AI agent that retrieves top trending tracks.
 *
 * - getTopTracks - A function that fetches top tracks.
 * - GetTopTracksInput - The input type for the getTopTracks function.
 * - GetTopTracksOutput - The return type for the getTopTracks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackSchema = z.object({
  title: z.string().describe('The title of the track.'),
  artist: z.string().describe('The artist of the track.'),
});
export type Track = z.infer<typeof TrackSchema>;

const GetTopTracksInputSchema = z.object({
  platform: z.string().describe('The platform for which to get top tracks (e.g., Instagram, TikTok).'),
  timePeriod: z.string().describe('The time period for the top tracks (e.g., "this week", "this month till date").'),
  count: z.number().optional().default(3).describe('The number of top tracks to retrieve, default is 3, max 5.'),
});

export type GetTopTracksInput = z.infer<typeof GetTopTracksInputSchema>;

const GetTopTracksOutputSchema = z.object({
  tracks: z.array(TrackSchema).describe('A list of top tracks, each with a title and artist.'),
});

export type GetTopTracksOutput = z.infer<typeof GetTopTracksOutputSchema>;

export async function getTopTracks(
  input: GetTopTracksInput
): Promise<GetTopTracksOutput> {
  return getTopTracksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTopTracksPrompt',
  input: {schema: GetTopTracksInputSchema},
  output: {schema: GetTopTracksOutputSchema},
  prompt: `You are a music trend analyst AI.
Your task is to provide a list of {{count}} top trending songs on {{platform}} for the period of {{timePeriod}}.
Focus on currently popular and viral tracks suitable for social media.
Each song must include a title and an artist.
Return exactly {{count}} tracks if possible, but no more than 5.
`,
});

const getTopTracksFlow = ai.defineFlow(
  {
    name: 'getTopTracksFlow',
    inputSchema: GetTopTracksInputSchema,
    outputSchema: GetTopTracksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        ...input,
        count: Math.min(input.count || 3, 5) // Ensure count is at most 5
    });
    if (!output || !output.tracks) {
      throw new Error('AI failed to generate top tracks.');
    }
    return { tracks: output.tracks.slice(0, Math.min(input.count || 3, 5)) }; // Ensure correct number of tracks
  }
);
