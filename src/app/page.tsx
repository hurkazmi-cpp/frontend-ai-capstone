"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [weakSpots, setWeakSpots] = useState<[string, { count: number; docId: string }][]>([]);
  const [hasDocument, setHasDocument] = useState(false);
  const [latestId, setLatestId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState({ documents: 0, quizzesTaken: 0, bestStreak: 0 });

  useEffect(() => {
    const stored = localStorage.getItem("weakSpots");
    if (stored) {
      const parsed: Record<string, { count: number; docId: string }> = JSON.parse(stored);
      const sorted = Object.entries(parsed).sort((a, b) => b[1].count - a[1].count).slice(0, 6);
      setWeakSpots(sorted);
    }

    const keys = Object.keys(localStorage).filter((k) => k.startsWith("document:"));
    setHasDocument(keys.length > 0);

    if (keys.length > 0) {
      let latestKey = keys[0];
      let latestTime = 0;
      keys.forEach((key) => {
        const doc = JSON.parse(localStorage.getItem(key) || "{}");
        if (doc.uploadedAt > latestTime) {
          latestTime = doc.uploadedAt;
          latestKey = key;
        }
      });
      setLatestId(latestKey.replace("document:", ""));
    }

    const statsRaw = localStorage.getItem("studyStats");
    const savedStats = statsRaw ? JSON.parse(statsRaw) : { quizzesTaken: 0, bestStreak: 0 };
    const docCount = Object.keys(localStorage).filter((k) => k.startsWith("document:")).length;
    setStats({ documents: docCount, quizzesTaken: savedStats.quizzesTaken, bestStreak: savedStats.bestStreak });
  }, []);

  function handleFeatureClick(e: React.MouseEvent) {
    if (!hasDocument) {
      e.preventDefault();
      setNotice("Upload a .txt or .pdf file first to generate flashcards or a quiz.");
      setTimeout(() => setNotice(""), 4000);
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="glass p-8 mb-6">
        <h1 className="text-3xl mb-2">Welcome back</h1>
        <p className="text-muted">
          Upload your notes, chat through tricky topics, and turn what you learn into flashcards and quizzes.
        </p>
      </div>

      {notice && (
        <div className="glass p-4 mb-6" style={{ borderColor: "#F2B84B", borderWidth: "1.5px" }}>
          <p className="text-sm">{notice}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/upload" className="glass glow-hover p-6 block">
          <h2 className="text-xl mb-2">Upload Notes</h2>
          <p className="text-muted text-sm">Generate a summary, flashcards, or a quiz.</p>
        </Link>

        <Link href="/chat" className="glass glow-hover p-6 block">
          <h2 className="text-xl mb-2">Chat</h2>
          <p className="text-muted text-sm">Ask questions, get clear explanations.</p>
        </Link>

        <Link
          href={hasDocument && latestId ? `/flashcards/${latestId}` : "/upload"}
          onClick={handleFeatureClick}
          className="glass glow-hover p-6 block"
        >
          <h2 className="text-xl mb-2">Flashcards</h2>
          <p className="text-muted text-sm">Review your uploaded topics.</p>
        </Link>

        <Link
          href={hasDocument && latestId ? `/quiz/${latestId}` : "/upload"}
          onClick={handleFeatureClick}
          className="glass glow-hover p-6 block"
        >
          <h2 className="text-xl mb-2">Quiz</h2>
          <p className="text-muted text-sm">Test yourself and track weak spots.</p>
        </Link>
      </div>

      {weakSpots.length > 0 && (
        <div className="glass p-6 mb-6">
          <h2 className="text-lg mb-4">Your Weak Spots</h2>
          <div className="flex flex-col gap-3">
            {weakSpots.map(([topic, data]) => {
              const maxCount = weakSpots[0][1].count;
              const widthPercent = (data.count / maxCount) * 100;
              return (
                <Link
                  key={topic}
                  href={`/chat?ask=${encodeURIComponent(`Can you explain ${topic}?`)}&docId=${data.docId}`}
                  className="glass glow-hover p-4 block"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span>{topic}</span>
                    <span className="text-muted">missed {data.count}x</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPercent}%`, background: "var(--color-accent)" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "var(--color-primary)" }}>
                    Ask the Study Buddy →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass p-6">
        <h2 className="text-lg mb-6">Study Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--color-accent)", textShadow: "0 0 20px rgba(242, 184, 75, 0.5)" }}
            >
              {stats.documents}
            </p>
            <p className="text-muted text-xs">Documents uploaded</p>
          </div>
          <div>
            <p
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--color-accent)", textShadow: "0 0 20px rgba(242, 184, 75, 0.5)" }}
            >
              {stats.quizzesTaken}
            </p>
            <p className="text-muted text-xs">Quizzes completed</p>
          </div>
          <div>
            <p
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--color-accent)", textShadow: "0 0 20px rgba(242, 184, 75, 0.5)" }}
            >
              {stats.bestStreak}
            </p>
            <p className="text-muted text-xs">Best streak</p>
          </div>
        </div>
      </div>
    </main>
  );
}