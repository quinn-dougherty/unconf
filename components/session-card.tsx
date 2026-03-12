"use client";

import Link from "next/link";
import { SLOT_TYPES } from "@/lib/constants";
import type { SessionWithSlot } from "@/lib/hooks/use-sessions";
import type { Tables } from "@/lib/supabase/database.types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function isNow(slot: Tables<"time_slots">) {
  const now = new Date();
  return new Date(slot.start_time) <= now && now < new Date(slot.end_time);
}

function isPast(slot: Tables<"time_slots">) {
  return new Date(slot.end_time) <= new Date();
}

function isVoluntold(session: SessionWithSlot): boolean {
  if (!session.creator_name || session.speaker_names.length === 0) return false;
  return session.speaker_names.some(
    (s) => s.toLowerCase() !== session.creator_name!.toLowerCase(),
  );
}

export function SessionCard({ session }: { session: SessionWithSlot }) {
  const slot = session.time_slots;
  const slotConfig = SLOT_TYPES[slot.slot_type];
  const now = isNow(slot);
  const past = isPast(slot);
  const voluntold = isVoluntold(session);

  return (
    <Link href={`/session/${session.id}`}>
      <div
        className={`border-2 p-3 transition-all hover:border-primary/70 ${
          voluntold
            ? "border-dashed border-accent/70 hover:border-accent"
            : now
              ? "border-primary animate-pulse-glow"
              : past
                ? "border-border/50 opacity-50"
                : "border-border hover:bg-card"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {now && (
            <span className="text-xs font-bold text-primary border border-primary px-1 animate-blink">
              NOW
            </span>
          )}
          {voluntold && (
            <span className="text-[10px] font-bold text-accent border border-accent px-1">
              VOLUNTOLD
            </span>
          )}
          <span className={`text-xs font-bold ${slotConfig.color}`}>
            {slotConfig.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(slot.start_time)}&ndash;{formatTime(slot.end_time)}
          </span>
        </div>
        <h3 className="font-bold text-sm truncate">{session.title}</h3>
        {session.speaker_names.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            {session.speaker_names.join(", ")}
          </p>
        )}
        {session.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] border border-border px-1 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function EmptySlotCard({
  slot,
  onClaim,
}: {
  slot: Tables<"time_slots">;
  onClaim: () => void;
}) {
  const slotConfig = SLOT_TYPES[slot.slot_type];
  const now = isNow(slot);
  const past = isPast(slot);

  if (past) {
    return (
      <div className="border-2 border-border/30 border-dashed p-3 opacity-30">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold ${slotConfig.color}`}>
            {slotConfig.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(slot.start_time)}&ndash;{formatTime(slot.end_time)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground italic">unclaimed</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClaim}
      className={`w-full text-left border-2 border-dashed p-3 transition-all hover:border-primary hover:bg-card ${
        now ? "border-primary/50" : "border-border/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {now && (
          <span className="text-xs font-bold text-primary border border-primary px-1 animate-blink">
            NOW
          </span>
        )}
        <span className={`text-xs font-bold ${slotConfig.color}`}>
          {slotConfig.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatTime(slot.start_time)}&ndash;{formatTime(slot.end_time)}
        </span>
      </div>
      <p className="text-xs text-primary font-bold">+ CLAIM THIS SLOT</p>
    </button>
  );
}
