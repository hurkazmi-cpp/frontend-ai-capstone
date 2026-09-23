import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, smoothStream, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: string } = await req.json();

  const systemPrompt = context
    ? `You are a helpful AI study buddy. The student has shared these notes with you:\n\n${context.slice(0, 8000)}\n\nUse them to answer questions when relevant. Keep explanations clear and concise.`
    : "You are a helpful AI study buddy. Help the student understand their notes, answer questions clearly, and keep explanations concise.";

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    experimental_transform: smoothStream({ delayInMs: 20, chunking: "word" }),
  });

  return result.toUIMessageStreamResponse();
}