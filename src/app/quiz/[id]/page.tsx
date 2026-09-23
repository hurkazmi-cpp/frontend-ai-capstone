"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";
import confetti from "canvas-confetti";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
};

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (i < retries) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return fetch(url, options); // final attempt, let caller handle failure
}

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<"loading" | "active" | "finished" | "error">("loading");
  const [current, setCurrent] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [missedTopics, setMissedTopics] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    async function generateQuiz() {
      const stored = localStorage.getItem(`document:${id}`);
      if (!stored) {
        setStatus("error");
        return;
      }

      const { text } = JSON.parse(stored);

      try {
        const res = await fetchWithRetry("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("Failed to generate quiz");

        const data = await res.json();
        if (!data.quiz || data.quiz.length === 0) {
          throw new Error("No quiz returned");
        }

        setQuestions(data.quiz);
        setStatus("active");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    generateQuiz();
  }, [id]);

  // Animate score count-up when quiz finishes
  useEffect(() => {
    if (status !== "finished") return;
    if (displayScore >= score) {
      if (score >= 8) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#8B7FD1", "#F2B84B", "#F5F3FF"],
        });
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayScore((s) => s + 1);
    }, 100);

    return () => clearTimeout(timeout);
  }, [status, displayScore, score]);

  function handleSelect(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);

    const q = questions[current];
    if (optionIndex === q.correctIndex) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setMissedTopics((topics) => [...topics, q.topic]);
      setStreak(0);
    }
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const existing = localStorage.getItem("weakSpots");
    const weakSpots: Record<string, { count: number; docId: string }> = existing
      ? JSON.parse(existing)
      : {};

    missedTopics.forEach((topic) => {
      const prevCount = weakSpots[topic]?.count || 0;
      weakSpots[topic] = { count: prevCount + 1, docId: id };
    });

    localStorage.setItem("weakSpots", JSON.stringify(weakSpots));

    // Track overall stats
    const statsRaw = localStorage.getItem("studyStats");
    const stats = statsRaw ? JSON.parse(statsRaw) : { quizzesTaken: 0, bestStreak: 0 };
    stats.quizzesTaken += 1;
    stats.bestStreak = Math.max(stats.bestStreak, bestStreak);
    localStorage.setItem("studyStats", JSON.stringify(stats));

    setStatus("finished");
  }

  const progressPercent = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="glass p-8">
        <h1 className="text-3xl mb-6">Quiz</h1>

        {status === "loading" && <p className="text-muted">Generating quiz...</p>}
        {status === "error" && (
          <div>
            <p style={{ color: "#F2B84B" }} className="mb-4">
              Couldn't generate a quiz. Try again.
            </p>
            <button onClick={() => window.location.reload()} className="glass glow-hover px-4 py-2 rounded-lg">
              Retry
            </button>
          </div>
        )}

        {status === "active" && questions.length > 0 && (
          <>
            {/* Progress bar */}
            <div className="mb-2 flex justify-between items-center">
              <p className="text-muted text-sm">
                Question {current + 1} of {questions.length}
              </p>
              {streak >= 2 && (
                <div className="flex items-center gap-1 text-base font-medium" style={{ color: "#F2B84B" }}>
                  <Flame size={20} />
                  <span>{streak} in a row!</span>
                </div>
              )}
            </div>
            <div
              className="w-full h-2 rounded-full mb-6 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: "var(--color-primary)",
                }}
              />
            </div>

            <p className="text-lg mb-6">{questions[current].question}</p>

            <div className="flex flex-col gap-3 mb-6">
              {questions[current].options.map((option, i) => {
                const isCorrect = i === questions[current].correctIndex;
                const isSelected = i === selected;

                let bg = "rgba(255, 255, 255, 0.08)";
                let border = "rgba(255, 255, 255, 0.12)";

                if (answered && isCorrect) {
                  bg = "rgba(143, 209, 158, 0.18)";
                  border = "#8FD19E";
                } else if (answered && isSelected && !isCorrect) {
                  bg = "rgba(242, 184, 75, 0.18)";
                  border = "#F2B84B";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    className="glow-hover px-5 py-3 rounded-lg text-left transition-all"
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                className="glass p-5 mb-6"
                style={{
                  borderColor: selected === questions[current].correctIndex ? "#8FD19E" : "#F2B84B",
                  borderWidth: "1.5px",
                }}
              >
                <p className="font-medium mb-1">
                  {selected === questions[current].correctIndex ? "Correct!" : "Not quite."}
                </p>
                <p className="text-muted text-sm">{questions[current].explanation}</p>
              </div>
            )}

            {answered && (
              <button
                onClick={handleNext}
                className="glass glow-hover px-6 py-2 rounded-lg"
              >
                {current + 1 < questions.length ? "Next Question" : "See Results"}
              </button>
            )}
          </>
        )}
        {status === "finished" && (
          <>
            <p className="text-4xl mb-2 font-semibold">
              {displayScore} / {questions.length}
            </p>

            {bestStreak >= 3 && (
              <div className="flex items-center gap-2 mb-4 text-lg" style={{ color: "#F2B84B" }}>
                <Flame size={24} />
                <span>Best streak: {bestStreak} in a row!</span>
              </div>
            )}

            <p className="text-muted mb-6">
              {missedTopics.length > 0
                ? `Topics to review: ${[...new Set(missedTopics)].join(", ")}`
                : "Great job — no weak spots this time!"}
            </p>
            <Link href="/" className="glass glow-hover px-6 py-3 rounded-lg inline-block">
              Back to Home
            </Link>
          </>
        )}
      </div>
    </main>
  );
}