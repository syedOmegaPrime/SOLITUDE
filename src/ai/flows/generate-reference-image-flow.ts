
'use server';
/**
 * @fileOverview An AI flow to generate a reference image based on a user prompt.
 *
 * - generateReferenceImage - A function that handles the image generation process.
 * - GenerateReferenceImageInput - The input type for the generateReferenceImage function.
 * - GenerateReferenceImageOutput - The return type for the generateReferenceImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReferenceImageInputSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters.").max(200, "Prompt must be 200 characters or less.").describe("A descriptive prompt for the image to be generated."),
});
export type GenerateReferenceImageInput = z.infer<typeof GenerateReferenceImageInputSchema>;

const GenerateReferenceImageOutputSchema = z.object({
  imageUrl: z.string().url().optional().describe("The URL of the generated image. This will be a data URI."),
  message: z.string().describe("A message about the generation process, e.g., success or failure."),
  error: z.boolean().default(false).describe("Indicates if an error occurred during generation."),
});
export type GenerateReferenceImageOutput = z.infer<typeof GenerateReferenceImageOutputSchema>;


export async function generateReferenceImage(input: GenerateReferenceImageInput): Promise<GenerateReferenceImageOutput> {
  return generateReferenceImageFlow(input);
}

const generateReferenceImageFlow = ai.defineFlow(
  {
    name: 'generateReferenceImageFlow',
    inputSchema: GenerateReferenceImageInputSchema,
    outputSchema: GenerateReferenceImageOutputSchema,
  },
  async (input) => {
    try {
        console.log(`Generating image for prompt: ${input.prompt}`);
        
        // Ensure GOOGLE_GENAI_API_KEY is set, otherwise Gemini image generation will fail
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            console.error("GOOGLE_GENAI_API_KEY is not set. Cannot generate image with Google AI.");
            return {
                message: "Image generation failed: GOOGLE_GENAI_API_KEY is not configured.",
                error: true,
            };
        }

        const { media } = await ai.generate({
            // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
            model: 'googleai/gemini-2.0-flash-exp',
            prompt: input.prompt, // Using the user's prompt directly
            config: {
              responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
              // Optional: Adjust safety settings if needed, though default might be fine
              // safetySettings: [
              //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
              // ],
            },
            // Explicitly not using outputFormat: "json" here as we are getting image media directly
        });

        if (media && media.url) {
            console.log("Image generated successfully:", media.url.substring(0, 50) + "...");
            return {
                imageUrl: media.url, // This will be a data URI (e.g., "data:image/png;base64,...")
                message: "Image generated successfully.",
                error: false,
            };
        } else {
            console.warn("Image generation did not return media or URL.");
            return {
                message: "Image generation completed, but no image data was returned.",
                error: true,
            };
        }

    } catch (e: any) {
      console.error("Error in generateReferenceImageFlow:", e);
      // Check if the error is due to API key issues
      if (e.message && (e.message.includes("API key not valid") || e.message.includes("Permission denied"))) {
        return {
          message: `Image generation failed: API Key issue. ${e.message}. Please check your GOOGLE_GENAI_API_KEY.`,
          error: true,
        };
      }
      return {
        message: `An error occurred during image generation: ${e.message || 'Unknown error'}`,
        error: true,
      };
    }
  }
);
