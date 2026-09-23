import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuizPage from "./page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "test-doc-1" }),
}));

const mockQuiz = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    topic: "Basic Math",
    explanation: "2 + 2 equals 4.",
  },
];

describe("QuizPage", () => {
  beforeEach(() => {
    localStorage.setItem(
      "document:test-doc-1",
      JSON.stringify({ name: "Test Doc", text: "sample notes", uploadedAt: Date.now() })
    );

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ quiz: mockQuiz }),
    }) as any;
  });

  it("shows correct feedback when the right answer is selected", async () => {
    render(<QuizPage />);

    await waitFor(() => screen.getByText("What is 2 + 2?"));

    fireEvent.click(screen.getByText("4"));

    expect(await screen.findByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText("2 + 2 equals 4.")).toBeInTheDocument();
  });

  it("shows 'Not quite' feedback when the wrong answer is selected", async () => {
    render(<QuizPage />);

    await waitFor(() => screen.getByText("What is 2 + 2?"));

    fireEvent.click(screen.getByText("3"));

    expect(await screen.findByText("Not quite.")).toBeInTheDocument();
  });
});