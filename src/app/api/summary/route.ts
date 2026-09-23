import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { text }: { text: string } = await req.json();

    const { text: summary } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system:
        "You are a study assistant. Summarize the given notes clearly, using headings and bullet points where helpful. Keep it concise but complete.",
      prompt: text.slice(0, 12000),
    });

    return Response.json({ summary });
  } catch (err) {
    console.error("Summary generation error:", err);
    return Response.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}