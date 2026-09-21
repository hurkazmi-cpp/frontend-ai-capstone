"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status, stop } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const bottomRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (autoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, autoScroll]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage({ text: input });
        setInput("");
    };

    return (
        <main className="p-4 max-w-2xl mx-auto flex flex-col h-[calc(100vh-64px)]">
            <h1 className="text-2xl font-bold mb-4">Chat with your Study Buddy</h1>

            <div
                className="flex-1 overflow-y-auto space-y-3 mb-4"
                onScroll={(e) => {
                    const el = e.currentTarget;
                    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
                    setAutoScroll(isAtBottom);
                }}
            >
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`p-3 rounded-lg max-w-[80%] ${m.role === "user"
                            ? "bg-primary text-white ml-auto"
                            : "bg-gray-100 text-gray-900"
                            }`}
                    >
                        {m.parts.map((part, i) =>
                            part.type === "text" ? (
                                <div key={i} className="prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                                </div>
                            ) : null
                        )}
                    </div>
                ))}

                {status === "submitted" && (
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-500 max-w-[80%]">
                        Thinking...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                />
                {status === "streaming" ? (
                    <button
                        type="button"
                        onClick={stop}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                )}
            </form>
        </main>
    );
}