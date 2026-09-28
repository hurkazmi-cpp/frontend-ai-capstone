"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });
const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });

export default function AmbientEffects() {
  return (
    <>
      <ParticleField />
      <CursorGlow />
    </>
  );
}