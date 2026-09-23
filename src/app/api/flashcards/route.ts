import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { text }: { text: string } = await req.json();

    const { text: raw } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system:
        'You are a study assistant. Generate 8-12 flashcards from the given notes. Each answer must be concise: a single short sentence or phrase, maximum 15-20 words. Respond ONLY with a JSON array, no markdown, no explanation, no code fences. Format: [{"question": "...", "answer": "..."}]',
      prompt: text.slice(0, 12000),
    });

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const flashcards = JSON.parse(cleaned);

    return Response.json({ flashcards });
  } catch (err) {
    console.error("Flashcards generation error:", err);
    return Response.json(
      { error: "Failed to generate flashcards. Please try again." },
      { status: 500 }
    );
  }
}