import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import SettingsPage from "./page";

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows document count based on localStorage", () => {
    localStorage.setItem(
      "document:doc-1",
      JSON.stringify({ name: "notes.txt", text: "hello", uploadedAt: Date.now() })
    );

    render(<SettingsPage />);
    expect(screen.getByText(/1 document stored/i)).toBeInTheDocument();
  });

  it("requires two clicks to actually clear data", () => {
    localStorage.setItem(
      "document:doc-1",
      JSON.stringify({ name: "notes.txt", text: "hello", uploadedAt: Date.now() })
    );

    render(<SettingsPage />);

    const button = screen.getByText("Clear all data");
    fireEvent.click(button);

    expect(screen.getByText("Click again to confirm")).toBeInTheDocument();
    expect(localStorage.getItem("document:doc-1")).not.toBeNull();

    fireEvent.click(screen.getByText("Click again to confirm"));

    expect(localStorage.getItem("document:doc-1")).toBeNull();
  });
});