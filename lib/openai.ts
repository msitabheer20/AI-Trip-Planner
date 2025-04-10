import OpenAI from 'openai';

// Create an OpenAI API client (that will by default use the OPENAI_API_KEY environment variable)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  
  return response.data[0].embedding;
}; 