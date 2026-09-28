import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import HistoryPage from "./page";

describe("HistoryPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows an empty state when no documents exist", () => {
    render(<HistoryPage />);
    expect(screen.getByText(/no uploads yet/i)).toBeInTheDocument();
  });

  it("lists uploaded documents with their name", () => {
    localStorage.setItem(
      "document:doc-1",
      JSON.stringify({ name: "Biology Notes", text: "hello", uploadedAt: Date.now() })
    );

    render(<HistoryPage />);
    expect(screen.getByText("Biology Notes")).toBeInTheDocument();
  });
});