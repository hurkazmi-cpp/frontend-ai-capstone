import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeBlock from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders the code content", () => {
    render(<CodeBlock>{"const x = 1;"}</CodeBlock>);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("copies code to clipboard when the copy button is clicked", async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<CodeBlock>{"const x = 1;"}</CodeBlock>);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(writeTextMock).toHaveBeenCalledWith("const x = 1;");
  });
});