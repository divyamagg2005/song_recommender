
'use server';
/**
 * @fileOverview AI agent that recommends songs and lyrics for social media stories.
 *
 * - generateStorySoundtrack - A function that generates song and lyric recommendations.
 * - GenerateStorySoundtrackInput - The input type for the generateStorySoundtrack function.
 * - GenerateStorySoundtrackOutput - The return type for the generateStorySoundtrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStorySoundtrackInputSchema = z.object({
  imageDataUri: z
    .string()
    .nullable() // ← Add this to allow null values
    .optional()
    .describe(
      "Optional: A photo for analysis, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  pictureType: z.string().describe('The type of picture (e.g., Selfie, Landscape, Food).'),
  pictureDescription: z
    .string()
    .nullable() // ← Add this too for consistency
    .optional()
    .describe('User-provided description of the picture.'),
  mood: z.string().describe('The mood or vibe the user is going for (e.g., Happy, Chill, Adventurous).'),
  moodDescription: z
    .string()
    .nullable() // ← And this
    .optional()
    .describe('User-provided description of the mood.'),
  preferredLanguage: z.string().describe('Preferred language for the song. Can be "Any" or a specific language code/name.'),
  otherLanguage: z
    .string()
    .nullable() // ← And this
    .optional()
    .describe('Specific language if preferredLanguage is not "Any".'),
  postingPlatform: z.string().describe('Platform where the story will be posted (e.g., Instagram, TikTok).'),
  songRecency: z.string().describe('How recent the song should be (e.g., Latest Hits, Classics).'),
});

export type GenerateStorySoundtrackInput = z.infer<typeof GenerateStorySoundtrackInputSchema>;

const SongRecommendationSchema = z.object({
  songTitle: z.string().describe('The title of the recommended song.'),
  songArtist: z.string().describe('The artist of the recommended song.'),
  catchyLyric: z.string().describe('A catchy lyric from the song that matches the vibe.'),
  reasoning: z.string().describe('Reasoning behind the song and lyric recommendation.'),
});
export type SongRecommendation = z.infer<typeof SongRecommendationSchema>;

const GenerateStorySoundtrackOutputSchema = z.object({
  recommendations: z.array(SongRecommendationSchema).min(5).describe('A list of at least 5 song recommendations, each with a song title, artist, catchy lyric, and reasoning.'),
});

export type GenerateStorySoundtrackOutput = z.infer<typeof GenerateStorySoundtrackOutputSchema>;

export async function generateStorySoundtrack(
  input: GenerateStorySoundtrackInput
): Promise<GenerateStorySoundtrackOutput> {
  return generateStorySoundtrackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStorySoundtrackPrompt',
  input: {schema: GenerateStorySoundtrackInputSchema},
  output: {schema: GenerateStorySoundtrackOutputSchema},
  prompt: `You are an expert AI music curator specializing in recommending songs and catchy lyrics for social media stories (like Instagram Stories, TikTok).
Your goal is to find the perfect soundtrack that aligns with the user's picture, mood, and preferences.

User's input:
- Picture Type: {{{pictureType}}}
{{#if pictureDescription}}
- Picture Description: {{{pictureDescription}}} (e.g., Sunset with palm trees, vintage tone...)
{{/if}}
- Mood/Vibe: {{{mood}}}
{{#if moodDescription}}
- Mood Description: {{{moodDescription}}} (e.g., Feeling grateful, chill Sunday vibes...)
{{/if}}
- Preferred Language: {{{preferredLanguage}}}
{{#if otherLanguage}}
  - Specific Language: {{{otherLanguage}}} (e.g., Spanish, Malayalam)
{{/if}}
- Posting Platform: {{{postingPlatform}}}
- Desired Song Recency: {{{songRecency}}}

{{#if imageDataUri}}
- Image for analysis: {{media url=imageDataUri}}
  (Analyze this image if provided to enhance the recommendation.)
{{/if}}

Based on all the provided information (including image analysis if an image is present), recommend a list of AT LEAST 5 songs.
The output must be an object containing a key "recommendations", which is an array of song objects.
Each song object in the "recommendations" array must include:
1.  "songTitle": The title of the recommended song.
2.  "songArtist": The artist of the recommended song.
3.  "catchyLyric": A short, catchy lyric from the song that would be perfect for the story.
4.  "reasoning": A brief reasoning for your choice, explaining how the song and lyric fit the user's input.

Ensure each song title and artist are accurate. Each catchy lyric should be impactful and relevant.
If the preferred language is 'Any', you can choose any language, but English is a good default unless the context strongly suggests otherwise. If a specific language is mentioned (either in preferredLanguage or otherLanguage), prioritize that language.
Consider the posting platform and song recency preferences.
The "recommendations" array must contain at least 5 distinct song recommendations. Each recommendation must have all four fields (songTitle, songArtist, catchyLyric, reasoning) populated.
`,
});

const generateStorySoundtrackFlow = ai.defineFlow(
  {
    name: 'generateStorySoundtrackFlow',
    inputSchema: GenerateStorySoundtrackInputSchema,
    outputSchema: GenerateStorySoundtrackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.recommendations || output.recommendations.length < 1) { // Zod schema will enforce min(5) on final output
      throw new Error('AI failed to generate sufficient soundtrack recommendations.');
    }
    return output;
  }
);

