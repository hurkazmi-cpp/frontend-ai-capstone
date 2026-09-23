"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/CodeBlock";
import { Send, Square, MessageCircle } from "lucide-react";

function getDocumentContext(docId?: string | null): string | undefined {
  if (docId) {
    const stored = localStorage.getItem(`document:${docId}`);
    if (stored) return JSON.parse(stored).text;
  }

  const keys = Object.keys(localStorage).filter((k) => k.startsWith("document:"));
  if (keys.length === 0) return undefined;

  let latestKey = keys[0];
  let latestTime = 0;
  keys.forEach((key) => {
    const doc = JSON.parse(localStorage.getItem(key) || "{}");
    if (doc.uploadedAt > latestTime) {
      latestTime = doc.uploadedAt;
      latestKey = key;
    }
  });

  const stored = localStorage.getItem(latestKey);
  return stored ? JSON.parse(stored).text : undefined;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [hasContext, setHasContext] = useState(false);

  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ context: getDocumentContext(docId) }),
    }),
  });

  useEffect(() => {
    setHasContext(!!getDocumentContext(docId));

    const ask = searchParams.get("ask");
    if (ask) {
      sendMessage({ text: ask });
    }
  }, []);

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

  const suggestions = [
    "Explain photosynthesis simply",
    "Quiz me on World War 2",
    "What's the difference between mitosis and meiosis?",
  ];

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-2xl mb-2">Chat with your Study Buddy</h1>

      {hasContext && (
        <p className="text-muted text-xs mb-4">Chatting with context from your latest upload</p>
      )}

      <div
        className="flex-1 overflow-y-auto space-y-3 mb-4"
        onScroll={(e) => {
          const el = e.currentTarget;
          const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
          setAutoScroll(isAtBottom);
        }}
      >
        {messages.length === 0 && (
          <div className="glass p-8 flex flex-col items-center text-center gap-4">
            <MessageCircle size={32} style={{ color: "var(--color-muted)" }} />
            <p className="text-muted">
              Ask anything about what you're studying — I'll explain it clearly.
            </p>
            <div className="flex flex-col gap-2 w-full">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage({ text: s })}
                  className="glass glow-hover px-4 py-2 rounded-lg text-sm text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl max-w-[85%] ${m.role === "user" ? "ml-auto" : ""
              }`}
            style={{
              background:
                m.role === "user"
                  ? "var(--color-primary)"
                  : "rgba(255, 255, 255, 0.08)",
              border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {m.parts.map((part, i) =>
              part.type === "text" ? (
                <div key={i} className="prose prose-sm prose-invert max-w-none overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                    }}
                  >
                    {part.text}
                  </ReactMarkdown>
                </div>
              ) : null
            )}
          </div>
        ))}

        {status === "submitted" && (
          <div
            className="p-4 rounded-2xl max-w-[85%] text-muted"
            style={{ background: "rgba(255, 255, 255, 0.08)" }}
          >
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="glass flex gap-2 p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 bg-transparent px-4 py-2 outline-none"
        />
        {status === "streaming" ? (
          <button
            type="button"
            onClick={stop}
            className="glow-hover px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="glow-hover px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: "var(--color-primary)" }}
          >
            <Send size={16} />
          </button>
        )}
      </form>
    </main>
  );
}