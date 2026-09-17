"use client";

import { useEffect, useState } from "react";

export default function HealthPage() {
  const [status, setStatus] = useState("Checking...");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.github.com/zen")
      .then((res) => res.text())
      .then((text) => {
        setStatus("✅ Connected");
        setData(text);
      })
      .catch(() => {
        setStatus("❌ Failed to fetch");
      });
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Health Check</h1>
      <p className="mt-4">
        Status: <span className="font-semibold">{status}</span>
      </p>
      {data && (
        <p className="mt-2 text-muted italic">"{data}"</p>
      )}
    </main>
  );
}