import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FlashcardsPage from "./page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "test-doc-1" }),
}));

const mockCards = [
  { question: "What is H2O?", answer: "Water" },
  { question: "What is NaCl?", answer: "Salt" },
];

describe("FlashcardsPage", () => {
  beforeEach(() => {
    localStorage.setItem(
      "document:test-doc-1",
      JSON.stringify({ name: "Test Doc", text: "sample notes", uploadedAt: Date.now() })
    );

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ flashcards: mockCards }),
    }) as any;
  });

  it("shows both question and answer, flipping the card on click", async () => {
    render(<FlashcardsPage />);

    await waitFor(() => screen.getByText("What is H2O?"));

    const cardInner = document.querySelector(".flip-card-inner");
    expect(cardInner).not.toHaveClass("flipped");

    fireEvent.click(screen.getByText("What is H2O?"));

    await waitFor(() => {
      expect(document.querySelector(".flip-card-inner")).toHaveClass("flipped");
    });
  });

  it("moves to the next card and resets the flip state", async () => {
    render(<FlashcardsPage />);

    await waitFor(() => screen.getByText("What is H2O?"));
    fireEvent.click(screen.getByText("What is H2O?"));

    await waitFor(() => {
      expect(document.querySelector(".flip-card-inner")).toHaveClass("flipped");
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(
      () => {
        expect(document.querySelector(".flip-card-inner")).not.toHaveClass("flipped");
      },
      { timeout: 500 }
    );

    await waitFor(() => screen.getByText("What is NaCl?"));
  });
});