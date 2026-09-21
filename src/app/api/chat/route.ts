import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, smoothStream, type UIMessage } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: groq("openai/gpt-oss-120b"),
        system:
            "You are a helpful AI study buddy. Help the student understand their notes, answer questions clearly, and keep explanations concise.",
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: "word",
        }),
    });

    return result.toUIMessageStreamResponse();
}