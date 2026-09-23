import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { Settings as SettingsIcon } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import CursorGlow from "@/components/CursorGlow";
import ParticleField from "@/components/ParticleField";
import Logo from "@/components/Logo";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Study Buddy",
  description: "Upload notes, get summaries, flashcards, and quizzes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="ambient-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="grain-overlay" />
        <ParticleField />
        <CursorGlow />

        <nav
          className="glass hidden md:flex items-center gap-2 p-3 m-4 max-w-3xl mx-auto justify-between"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <Logo />
            <Link href="/" className="glow-hover px-4 py-2 rounded-lg font-medium">
              <span className="nav-link">Home</span>
            </Link>
            <Link href="/upload" className="glow-hover px-4 py-2 rounded-lg">
              <span className="nav-link">Upload</span>
            </Link>
            <Link href="/history" className="glow-hover px-4 py-2 rounded-lg">
              <span className="nav-link">History</span>
            </Link>
            <Link href="/chat" className="glow-hover px-4 py-2 rounded-lg">
              <span className="nav-link">Chat</span>
            </Link>
          </div>
          <Link href="/settings" className="glow-hover p-2 rounded-lg flex-shrink-0" aria-label="Settings">
            <SettingsIcon size={20} />
          </Link>
        </nav>
        <MobileNav />

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

      </body>
    </html >
  );
}