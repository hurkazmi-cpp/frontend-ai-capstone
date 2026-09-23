import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UploadPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("UploadPage", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
  });

  it("reads a .txt file, saves it to localStorage, and navigates to its summary page", async () => {
    render(<UploadPage />);

    const file = new File(["Sample note content"], "notes.txt", { type: "text/plain" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    const calledPath = pushMock.mock.calls[0][0] as string;
    expect(calledPath).toMatch(/^\/summary\//);

    const id = calledPath.replace("/summary/", "");
    const stored = localStorage.getItem(`document:${id}`);
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.name).toBe("notes.txt");
    expect(parsed.text).toBe("Sample note content");
  });
});