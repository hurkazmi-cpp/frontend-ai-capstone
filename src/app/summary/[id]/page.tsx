"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (i < retries) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return fetch(url, options); // final attempt, let caller handle failure
}

export default function SummaryPage() {
    const params = useParams();
    const id = params.id as string;

    const [docName, setDocName] = useState("");
    const [summary, setSummary] = useState("");
    const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

    useEffect(() => {
        async function generateSummary() {
            const stored = localStorage.getItem(`document:${id}`);
            if (!stored) {
                setStatus("error");
                return;
            }

            const { name, text } = JSON.parse(stored);
            setDocName(name);

            try {
                const res = await fetchWithRetry("/api/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                });

                if (!res.ok) throw new Error("Failed to generate summary");

                const data = await res.json();
                setSummary(data.summary);
                setStatus("done");
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        }

        generateSummary();
    }, [id]);

    return (
        <main className="p-4 md:p-8 max-w-3xl mx-auto">
            <div className="glass p-8">
                <h1 className="text-3xl mb-2">Summary</h1>
                {docName && <p className="text-muted mb-6">{docName}</p>}

                {status === "loading" && <p className="text-muted">Generating summary...</p>}
                {status === "error" && (
                    <p style={{ color: "#F2B84B" }}>
                        Couldn't generate a summary. Try uploading again.
                    </p>
                )}
                {status === "done" && (
                    <div className="prose prose-sm prose-invert max-w-none overflow-x-auto">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                            }}
                        >
                            {summary}
                        </ReactMarkdown>
                    </div>
                )}
                {status === "done" && (
                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            href={`/flashcards/${id}`}
                            className="glass glow-hover px-6 py-3 rounded-lg"
                        >
                            Study Flashcards
                        </Link>
                        <Link
                            href={`/quiz/${id}`}
                            className="glass glow-hover px-6 py-3 rounded-lg"
                        >
                            Take a Quiz
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}