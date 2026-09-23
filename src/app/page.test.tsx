import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a notice when Flashcards is clicked with no document uploaded", async () => {
    render(<HomePage />);

    fireEvent.click(screen.getByText("Flashcards"));

    expect(
      await screen.findByText(/Upload a .txt or .pdf file first/i)
    ).toBeInTheDocument();
  });

  it("does not show the notice when a document already exists", () => {
    localStorage.setItem(
      "document:doc-1",
      JSON.stringify({ name: "notes.txt", text: "hello", uploadedAt: Date.now() })
    );

    render(<HomePage />);

    expect(
      screen.queryByText(/Upload a .txt or .pdf file first/i)
    ).not.toBeInTheDocument();
  });
});