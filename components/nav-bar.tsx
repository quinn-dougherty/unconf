"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EVENT_NAME } from "@/lib/constants";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b-2 border-primary/50 bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-12">
        <Link href="/" className="text-primary font-bold text-sm tracking-wider">
          {EVENT_NAME}
        </Link>
        <div className="flex gap-4 text-sm">
          <Link
            href="/"
            className={cn(
              "hover:text-primary transition-colors",
              pathname === "/" ? "text-primary font-bold" : "text-muted-foreground",
            )}
          >
            SCHEDULE
          </Link>
          <Link
            href="/bounties"
            className={cn(
              "hover:text-accent transition-colors",
              pathname === "/bounties"
                ? "text-accent font-bold"
                : "text-muted-foreground",
            )}
          >
            BOUNTIES
          </Link>
        </div>
      </div>
    </nav>
  );
}
