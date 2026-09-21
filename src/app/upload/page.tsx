"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "reading" | "error">("idle");
  const router = useRouter();

  async function extractTextFromPDF(file: File): Promise<string> {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("reading");

    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      const id = crypto.randomUUID();
      localStorage.setItem(
        `document:${id}`,
        JSON.stringify({ name: file.name, text, uploadedAt: Date.now() })
      );

      router.push(`/summary/${id}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="glass p-8">
        <h1 className="text-3xl mb-2">Upload Notes</h1>
        <p className="text-muted mb-6">
          Upload a .pdf or .txt file to generate a summary, flashcards, and a quiz.
        </p>

        <label className="glass glow-hover flex flex-col items-center justify-center p-10 cursor-pointer">
          <span className="mb-2">
            {fileName ? fileName : "Click to choose a file"}
          </span>
          <span className="text-muted text-sm">.pdf or .txt</span>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {status === "reading" && (
          <p className="text-muted mt-4">Reading your file...</p>
        )}
        {status === "error" && (
          <p className="mt-4" style={{ color: "#F2B84B" }}>
            Something went wrong reading that file. Try a different one.
          </p>
        )}
      </div>
    </main>
  );
}