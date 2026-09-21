"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Layers, ListChecks } from "lucide-react";

type Doc = { id: string; name: string; uploadedAt: number };

export default function HistoryPage() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("document:"));
    const loaded: Doc[] = keys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      return {
        id: key.replace("document:", ""),
        name: data.name || "Untitled",
        uploadedAt: data.uploadedAt || 0,
      };
    });

    loaded.sort((a, b) => b.uploadedAt - a.uploadedAt);
    setDocs(loaded);
  }, []);

  return (
    <main className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="glass p-8 mb-6">
        <h1 className="text-3xl mb-2">History</h1>
        <p className="text-muted">Revisit your past uploads and their generated content.</p>
      </div>

      {docs.length === 0 && (
        <div className="glass p-8 text-center">
          <p className="text-muted">No uploads yet. Start by uploading your notes.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="glass p-6">
            <h2 className="text-lg mb-1">{doc.name}</h2>
            <p className="text-muted text-sm mb-4">
              {new Date(doc.uploadedAt).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/summary/${doc.id}`}
                className="glass glow-hover px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <FileText size={16} /> Summary
              </Link>
              <Link
                href={`/flashcards/${doc.id}`}
                className="glass glow-hover px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Layers size={16} /> Flashcards
              </Link>
              <Link
                href={`/quiz/${doc.id}`}
                className="glass glow-hover px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <ListChecks size={16} /> Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}