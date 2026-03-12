"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { ReactionsBar } from "@/components/reactions-bar";
import { CommentsSection } from "@/components/comments-section";
import { SessionHistory } from "@/components/session-history";
import { SessionForm } from "@/components/session-form";
import { IdentityProvider, useIdentity } from "@/components/identity-gate";
import { PasswordGate } from "@/components/password-gate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { getSessionById } from "@/lib/effect/SessionService";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { SLOT_TYPES } from "@/lib/constants";
import type { SessionWithSlot } from "@/lib/hooks/use-sessions";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function SessionDetail({ id }: { id: string }) {
  const identity = useIdentity();
  const [session, setSession] = useState<SessionWithSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [hijackFlash, setHijackFlash] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await runWithSupabase(getSessionById(id));
      setSession(data as SessionWithSlot);
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime("sessions", (payload) => {
    if (payload.eventType === "UPDATE") {
      load();
    }
  }, `id=eq.${id}`);

  useRealtime("session_edits", (payload) => {
    if (
      payload.eventType === "INSERT" &&
      (payload.new as Record<string, unknown>)?.edited_by !== identity.id
    ) {
      setHijackFlash(true);
      setTimeout(() => setHijackFlash(false), 2000);
    }
  }, `session_id=eq.${id}`);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-blink">
        LOADING...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-bold">SESSION NOT FOUND</p>
        <Link href="/" className="text-primary text-sm underline mt-2 inline-block">
          back to schedule
        </Link>
      </div>
    );
  }

  const slot = session.time_slots;
  const slotConfig = SLOT_TYPES[slot.slot_type];
  const isCreator = session.created_by === identity.id;

  return (
    <div className={`max-w-3xl mx-auto px-4 pb-12 ${hijackFlash ? "animate-shake" : ""}`}>
      {hijackFlash && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 border-2 border-destructive bg-destructive/20 px-4 py-2 text-sm font-bold text-destructive">
          HIJACKED!
        </div>
      )}

      <div className="py-6">
        <Link href="/" className="text-primary text-xs hover:underline">
          &larr; BACK TO SCHEDULE
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold ${slotConfig.color}`}>
              {slotConfig.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(slot.start_time)}&ndash;{formatTime(slot.end_time)}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {session.title}
          </h1>
          {session.speaker_names.length > 0 && (
            <p className="text-sm text-accent font-bold">
              {session.speaker_names.join(", ")}
            </p>
          )}
        </div>

        {session.description && (
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
            {session.description}
          </p>
        )}

        {session.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border-2 border-border px-2 py-0.5 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(session.slides_url || session.notes_url) && (
          <div className="flex gap-3 text-xs">
            {session.slides_url && (
              <a
                href={session.slides_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:no-underline"
              >
                SLIDES
              </a>
            )}
            {session.notes_url && (
              <a
                href={session.notes_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:no-underline"
              >
                NOTES
              </a>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            className="border-2 font-bold text-xs"
          >
            {isCreator ? "EDIT" : "HIJACK"}
          </Button>
          <span className="text-[10px] text-muted-foreground">
            anyone can edit. this is anarchy.
          </span>
        </div>

        <Separator className="bg-border" />

        <ReactionsBar sessionId={session.id} />

        <Separator className="bg-border" />

        <CommentsSection sessionId={session.id} />

        <Separator className="bg-border" />

        <SessionHistory sessionId={session.id} />
      </div>

      {editing && (
        <SessionForm
          open={editing}
          onOpenChange={setEditing}
          timeSlotId={session.time_slot_id}
          existingSession={session}
          onSuccess={() => {
            setEditing(false);
            load();
          }}
        />
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    setHasAccess(getCookie("unconf_access") === "1");
  }, []);

  if (hasAccess === null) return null;

  if (!hasAccess) {
    return <PasswordGate onSuccess={() => setHasAccess(true)} />;
  }

  return (
    <IdentityProvider>
      <NavBar />
      <SessionDetail id={id} />
    </IdentityProvider>
  );
}
