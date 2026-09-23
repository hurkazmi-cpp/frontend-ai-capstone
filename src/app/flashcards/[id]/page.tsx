"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Flashcard = { question: string; answer: string };

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (i < retries) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return fetch(url, options); // final attempt, let caller handle failure
}

export default function FlashcardsPage() {
  const params = useParams();
  const id = params.id as string;

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    async function generateFlashcards() {
      const stored = localStorage.getItem(`document:${id}`);
      if (!stored) {
        setStatus("error");
        return;
      }

      const { text } = JSON.parse(stored);

      try {
        const res = await fetchWithRetry("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("Failed to generate flashcards");

        const data = await res.json();
        if (!data.flashcards || data.flashcards.length === 0) {
          throw new Error("No flashcards returned");
        }

        setCards(data.flashcards);
        setStatus("done");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    generateFlashcards();
  }, [id]);

  function handleNext() {
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i + 1) % cards.length);
    }, 300);
  }

  function handlePrev() {
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i - 1 + cards.length) % cards.length);
    }, 300);
  }

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="glass p-8">
        <h1 className="text-3xl mb-6">Flashcards</h1>

        {status === "loading" && <p className="text-muted">Generating flashcards...</p>}
        {status === "error" && (
          <p style={{ color: "#F2B84B" }}>
            Couldn't generate flashcards. Try uploading again.
          </p>
        )}

        {status === "done" && cards.length > 0 && (
          <>
            <p className="text-muted text-sm mb-4">
              Card {index + 1} of {cards.length}
            </p>

            <div
              onClick={() => setFlipped(!flipped)}
              className="flip-card min-h-[200px] cursor-pointer mb-6"
              style={{ height: "auto" }}
            >
              <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
                <div className="flip-card-front glass">
                  <p className="text-lg">{cards[index].question}</p>
                </div>
                <div className="flip-card-back glass">
                  <p className="text-lg">{cards[index].answer}</p>
                </div>
              </div>
            </div>

            <p className="text-muted text-sm text-center mb-6">
              Click the card to {flipped ? "see the question" : "reveal the answer"}
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrev}
                className="glass glow-hover px-6 py-2 rounded-lg"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="glass glow-hover px-6 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}