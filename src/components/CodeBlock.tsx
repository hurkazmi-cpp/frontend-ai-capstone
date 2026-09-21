"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  function getText(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getText).join("");
    if (node && typeof node === "object" && "props" in node) {
      return getText((node as any).props.children);
    }
    return "";
  }

  function handleCopy() {
    const text = getText(children).replace(/\n$/, "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 p-2 rounded-md glass glow-hover z-10"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}