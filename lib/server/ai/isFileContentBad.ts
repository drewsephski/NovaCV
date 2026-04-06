import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://self.so',
    'X-Title': 'self.so',
  },
});

export const isFileContentBad = async (fileContent: string) => {
  // we can for now do the AI parsing here?
  const generationResult = await generateText({
    model: openrouter.chat('openrouter/free'),
    prompt: `You are given the following file content, evalute if content is harmful or spammy.
    ${fileContent}
    `,
  });

  if (generationResult.text.startsWith('unsafe')) {
    return true;
  } else {
    return false;
  }
};
