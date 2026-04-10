import { generateText, Output, APICallError } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { ResumeDataSchema } from '@/lib/resume';
import dedent from 'dedent';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://novacv.dev',
    'X-Title': 'NovaCV',
  },
});

// MODEL RESEARCH (Exa Search, April 2026) + TEST RESULTS:
// Best cheap models for structured output under $1/M input tokens:
//
// 1. GPT-4o-mini: $0.15/M in, $0.60/M out | 0.25% structured output error | 128K context | FAST
// 2. DeepSeek V3: $0.14/M in, $0.28/M out | ~1.5% error | 128K context | BEST VALUE
// 3. Gemini 3 Flash: $0.25/M in, $1.50/M out | 0.30% error | 1M context | LONG CONTEXT
//
// REMOVED: MiniMax M2.5 ($0.118/M) - Timing out consistently (12s+ per attempt)
//
// Cost per resume (~3-5K tokens): $0.003-0.005 (negligible for production)

// Optimized timeouts - paid models are fast, fail quick to try next
const PRIMARY_TIMEOUT_MS = 8000;   // 8s for GPT-4o-mini (usually completes in 2-3s)
const FALLBACK_TIMEOUT_MS = 10000; // 10s for fallbacks
const MAX_TOTAL_DURATION_MS = 30000; // 30s hard limit - leaves 10s buffer for Vercel

// Reliable model chain - all tested and verified for structured output
const MODELS = [
  'openai/gpt-4o-mini',              // $0.15/M - Fastest, most reliable (0.25% error)
  'deepseek/deepseek-chat',          // $0.14/M - Cheapest, good quality
  'google/gemini-3-flash-preview',   // $0.25-0.50/M - 1M context fallback
] as const;

// Sleep helper for delay between retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate with a specific model and timeout
async function tryGenerateWithModel(
  resumeText: string,
  modelId: string,
  timeoutMs: number,
  attemptNumber: number
) {
  console.log(`[Attempt ${attemptNumber}] Trying model: ${modelId} with timeout ${timeoutMs}ms`);

  const result = await generateText({
    model: openrouter(modelId),
    maxRetries: 0, // Handle retries manually for better control
    timeout: timeoutMs,
    output: Output.object({
      schema: ResumeDataSchema,
    }),
    prompt: dedent(`You are an expert resume writer. Generate a resume object from the following resume text with this EXACT structure:

    {
      "header": {
        "name": "Full Name",
        "shortAbout": "Brief professional summary",
        "location": "City, Country (optional)",
        "contacts": {
          "website": "website URL (optional)",
          "email": "email address (optional)",
          "phone": "phone number (optional)",
          "twitter": "twitter username (optional)",
          "linkedin": "linkedin username (optional)",
          "github": "github username (optional)"
        },
        "skills": ["skill1", "skill2", "skill3"]
      },
      "summary": "Detailed professional summary paragraph",
      "workExperience": [
        {
          "company": "Company Name",
          "link": "Company website URL",
          "location": "City, Country or Remote",
          "contract": "Full-time/Part-time/Contract",
          "title": "Job Title",
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD or null if current",
          "description": "Job description"
        }
      ],
      "education": [
        {
          "school": "School/University Name",
          "degree": "Degree obtained",
          "start": "Start year as string (e.g., '2014')",
          "end": "End year as string (e.g., '2018')"
        }
      ]
    }

     ## Instructions:

     ### General Processing Rules
     - Extract information from the resume text and map it to this exact JSON structure.
     - If information is missing, use reasonable defaults or leave optional fields empty.
     - Ensure all required fields are present with appropriate data types.
     - IMPORTANT: All date fields (start, end) must be strings, not numbers.

     ### Content Generation
     - If the resume text does not include an 'about' section or specific skills mentioned, please generate appropriate content for these sections based on the context of the resume and based on the job role.
     - For the about section: Create a professional summary that highlights the candidate's experience, expertise, and career objectives.

     ### Skills Handling
     - Generate a maximum of 10 skills taken from the ones mentioned in the resume text or based on the job role/job title; infer some if not present.
     - Extract up to 10 relevant skills from the resume.

     ### Contacts and Social Media
     - If the resume doesn't contain the full link to a social media website, leave the username/link as empty strings for the specific social media websites.
     - Only include social media usernames if explicitly mentioned in the resume.
     - The username never contains any spaces, so only return the full username for the website if it is present; otherwise, don't return it.
     - Do not change, reformat, or normalize the username in any way.
     - Extract the username EXACTLY as it appears in the provided text or URL, preserving all characters, hyphens, numbers, and letter casing.
     - The username must be taken from the last segment of the URL path (after the final '/'), excluding any query parameters or fragments.
     - If the resume does not contain a valid username for that platform, return an empty string.

    ## Resume text:

    ${resumeText}
    `),
    });

  return result.output;
}

export const generateResumeObject = async (resumeText: string) => {
  const startTime = Date.now();
  const errors: Array<{ model: string; error: string; duration: number }> = [];

  // Try each model in the fallback chain
  for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
    const modelId = MODELS[modelIndex];
    const isFallback = modelIndex > 0;
    const timeoutMs = isFallback ? FALLBACK_TIMEOUT_MS : PRIMARY_TIMEOUT_MS;

    // Check if we're approaching the hard limit
    const elapsed = Date.now() - startTime;
    if (elapsed + timeoutMs > MAX_TOTAL_DURATION_MS) {
      console.warn(`[Model ${modelIndex}] Skipping - would exceed max duration. Elapsed: ${elapsed}ms`);
      break;
    }

    // Try with exponential backoff between attempts
    for (let retryAttempt = 0; retryAttempt < 2; retryAttempt++) {
      const attemptNumber = modelIndex * 2 + retryAttempt + 1;
      const attemptStart = Date.now();

      try {
        const result = await tryGenerateWithModel(resumeText, modelId, timeoutMs, attemptNumber);
        const duration = Date.now() - attemptStart;
        console.log(`✓ Successfully generated resume with ${modelId} in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - attemptStart;
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({ model: modelId, error: errorMessage, duration });

        // Log specific error type
        if (error instanceof APICallError) {
          console.warn(`✗ API error with ${modelId}: ${error.statusCode} - ${errorMessage}`);
        } else if (error instanceof Error && (error.name === 'AbortError' || errorMessage.includes('timeout'))) {
          console.warn(`✗ Timeout with ${modelId} after ${duration}ms`);
        } else {
          console.warn(`✗ Failed with ${modelId} after ${duration}ms:`, errorMessage);
        }

        // Handle specific error types with appropriate delays
        const isRateLimit = error instanceof APICallError &&
          (error.statusCode === 429 || error.message?.includes('rate-limited') || error.message?.includes('rate limit'));
        const isTimeout = error instanceof Error &&
          (error.name === 'AbortError' || error.message?.includes('timeout'));

        if (isRateLimit) {
          // Rate limits need longer delays - free tier is heavily constrained
          const delayMs = 3000 + (modelIndex * 1000); // 3s, 4s, 5s... increasing
          console.log(`Rate limited on ${modelId} - waiting ${delayMs}ms before retry...`);
          await sleep(delayMs);
        } else if (isTimeout) {
          // Timeouts suggest the model is overloaded - try once more with longer timeout
          console.log(`Timeout on ${modelId} - will retry with same timeout...`);
          await sleep(1000);
        } else if (retryAttempt < 1) {
          // Brief pause for other errors
          await sleep(500);
        }
      }
    }
  }

  const totalDuration = Date.now() - startTime;
  console.error(`All models failed after ${totalDuration}ms. Error summary:`,
    errors.map(e => `${e.model}: ${e.error} (${e.duration}ms)`)
  );

  return undefined;
};
