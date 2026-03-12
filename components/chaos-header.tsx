"use client";

import { useEffect, useState } from "react";
import { EVENT_NAME, EVENT_START, EVENT_END, EVENT_LOCATION } from "@/lib/constants";

type Status = "BEFORE" | "NOW" | "OVER";

function getStatus(now: Date): { status: Status; countdown: string } {
  const start = new Date(EVENT_START);
  const end = new Date(EVENT_END);

  if (now >= end) return { status: "OVER", countdown: "IT'S OVER" };
  if (now >= start) return { status: "NOW", countdown: "HAPPENING NOW" };

  const diff = start.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return { status: "BEFORE", countdown: parts.join(" ") };
}

export function ChaosHeader() {
  const [{ status, countdown }, setState] = useState(() =>
    getStatus(new Date()),
  );

  useEffect(() => {
    const interval = setInterval(() => setState(getStatus(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8 px-4">
      <h1
        className={cn(
          "text-4xl md:text-6xl font-extrabold tracking-tighter mb-2",
          status === "NOW" && "text-primary animate-pulse-glow",
          status === "OVER" && "text-muted-foreground line-through",
          status === "BEFORE" && "text-foreground",
        )}
      >
        {EVENT_NAME}
      </h1>
      <p className="text-muted-foreground text-sm mb-1">
        APR 25, 2026 &middot; 1&ndash;5PM EDT
      </p>
      <p className="text-muted-foreground text-xs mb-4">{EVENT_LOCATION}</p>
      <div
        className={cn(
          "inline-block border-2 px-4 py-1 text-sm font-bold",
          status === "NOW" && "border-primary text-primary animate-pulse-glow",
          status === "OVER" && "border-muted-foreground text-muted-foreground",
          status === "BEFORE" && "border-accent text-accent",
        )}
      >
        {status === "BEFORE" && "T-MINUS "}
        {countdown}
        {status === "NOW" && <span className="animate-blink ml-1">_</span>}
      </div>

      <div className="mt-6 max-w-xl mx-auto text-left border-2 border-border p-4 text-sm text-muted-foreground space-y-3">
        <p>
          Come teach us some inexplicable skill, infodump about your latest
          wikipedia rabbit hole, make a spicy argument, solicit takes on
          something you&apos;re confused about, or whatever. Talking about your
          job is tentatively permitted at the cost of{" "}
          <span className="text-accent font-bold">5 pushups</span>. Also fair
          game is reserving a slot for a semi-structured session where you
          gently frame a discussion but don&apos;t centralize attention on
          yourself.
        </p>
        <p className="text-xs">
          A whiteboard and a TV will be available.
        </p>
        <p className="text-xs">
          <a
            href="https://partiful.com/e/JWRYodduEE7UmR3B8LVA"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline hover:no-underline font-bold"
          >
            RSVP ON PARTIFUL
          </a>
          {" "}&mdash; do this or you are not real
        </p>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
