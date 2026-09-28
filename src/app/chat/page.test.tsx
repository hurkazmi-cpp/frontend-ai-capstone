import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("ChatPage", () => {
  it("shows the empty state with suggestions when there are no messages", () => {
    render(<ChatPage />);
    expect(
      screen.getByText(/ask anything about what you're studying/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Explain photosynthesis simply")).toBeInTheDocument();
  });
});