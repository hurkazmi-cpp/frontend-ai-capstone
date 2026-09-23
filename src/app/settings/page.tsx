"use client";

import { useEffect, useState } from "react";
import { Trash2, Info } from "lucide-react";

export default function SettingsPage() {
  const [docCount, setDocCount] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    refreshCount();
  }, []);

  function refreshCount() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("document:"));
    setDocCount(keys.length);
  }

  function handleClearData() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }

    localStorage.clear();
    refreshCount();
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="glass p-8 mb-6">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted">Manage your data and learn more about this app.</p>
      </div>

      <div className="glass p-6 mb-6">
        <h2 className="text-lg mb-4">Your Data</h2>
        <p className="text-muted text-sm mb-4">
          {docCount} document{docCount !== 1 ? "s" : ""} stored in this browser.
        </p>
        <p className="text-muted text-xs mb-4">
          All your uploads, flashcards, quiz history, and weak spots are stored locally in your
          browser only — nothing is sent to a server or shared across devices.
        </p>

        <button
          onClick={handleClearData}
          className="glass glow-hover px-5 py-2 rounded-lg flex items-center gap-2 text-sm"
          style={{
            borderColor: confirmClear ? "#F2B84B" : undefined,
            borderWidth: confirmClear ? "1.5px" : undefined,
          }}
        >
          <Trash2 size={16} />
          {confirmClear ? "Click again to confirm" : "Clear all data"}
        </button>

        {cleared && (
          <p className="text-sm mt-3" style={{ color: "#8FD19E" }}>
            All data cleared.
          </p>
        )}
      </div>

      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} style={{ color: "var(--color-muted)" }} />
          <h2 className="text-lg">About</h2>
        </div>

        <p className="text-muted text-sm mb-4">
          AI Study Buddy helps you turn your notes into summaries, flashcards, and quizzes,
          and lets you chat through tricky topics with an AI tutor that understands your material.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {["Next.js", "Tailwind CSS", "Groq", "TypeScript"].map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="pt-4 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-muted text-xs">
            Built by Syed Muhammad Hur Abbas Kazmi as part of a Frontend AI Engineering internship.
          </p>
          <a
            href="https://github.com/hurkazmi-cpp/frontend-ai-capstone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs glow-hover inline-block w-fit"
            style={{ color: "var(--color-primary)" }}
          >
            View source on GitHub →
          </a>
        </div>
      </div>
    </main>
  );
}