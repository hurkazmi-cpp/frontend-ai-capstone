"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Upload, History, MessageCircle, Settings } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-1 md:hidden z-20">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg glow-hover"
            style={{ color: isActive ? "var(--color-accent)" : "var(--color-foreground)" }}
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}