import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { text }: { text: string } = await req.json();

  const { text: summary } = await generateText({
    model: groq("openai/gpt-oss-120b"),
    system:
      "You are a study assistant. Summarize the given notes clearly, using headings and bullet points where helpful. Keep it concise but complete.",
    prompt: text.slice(0, 12000), // keep prompt size reasonable
  });

  return Response.json({ summary });
}