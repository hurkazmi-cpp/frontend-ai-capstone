import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { text }: { text: string } = await req.json();

  const { text: raw } = await generateText({
    model: groq("openai/gpt-oss-120b"),
    system:
      "You are a study assistant. Generate 8-12 flashcards from the given notes. Respond ONLY with a JSON array, no markdown, no explanation, no code fences. Format: [{\"question\": \"...\", \"answer\": \"...\"}]",
    prompt: text.slice(0, 12000),
  });

  // Clean up in case the model adds stray formatting
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const flashcards = JSON.parse(cleaned);
    return Response.json({ flashcards });
  } catch (err) {
    return Response.json({ error: "Failed to parse flashcards" }, { status: 500 });
  }
}