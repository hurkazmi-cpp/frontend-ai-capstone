import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { text }: { text: string } = await req.json();

    const { text: raw } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system: `You are a study assistant. Generate exactly 10 multiple-choice questions from the given notes.
Each question must have exactly 4 options, one correct answer, a short topic tag (2-3 words describing the concept), and a brief 1-2 sentence explanation of why the correct answer is right.
Respond ONLY with a JSON array, no markdown, no explanation outside the JSON, no code fences.
Format: [{"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "topic": "...", "explanation": "..."}]`,
      prompt: text.slice(0, 12000),
    });

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const quiz = JSON.parse(cleaned);

    return Response.json({ quiz });
  } catch (err) {
    console.error("Quiz generation error:", err);
    return Response.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}