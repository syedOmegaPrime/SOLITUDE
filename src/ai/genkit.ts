
import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config(); // Load .env file

const googleGenaiKey = process.env.GOOGLE_GENAI_API_KEY;

const plugins: Plugin<any>[] = [];
let defaultModel: string | undefined = undefined;

if (googleGenaiKey) {
  plugins.push(googleAI({apiKey: googleGenaiKey}));
  defaultModel = 'googleai/gemini-1.5-flash'; // Set Google model as default
  console.log('GoogleAI plugin configured.');
} else {
   console.warn(
    'GOOGLE_GENAI_API_KEY is not set. Google GenAI functionality will be disabled.'
  );
}


export const ai = genkit({
  plugins: plugins,
  model: defaultModel, 
});

if (plugins.length === 0) {
  console.error("CRITICAL: No AI plugins configured (GOOGLE_GENAI_API_KEY not found). Genkit will not function.");
} else if (!defaultModel) {
  // This case should ideally not be hit if googleGenaiKey is present, but as a safeguard:
  console.warn("No default model could be set. Explicitly provide a model in generate calls.");
}
