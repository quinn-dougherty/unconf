"use client";

import { useState, useEffect, useCallback } from "react";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { getEditHistory } from "@/lib/effect/SessionService";
import { useRealtime } from "@/lib/hooks/use-realtime";
import type { Tables, Json } from "@/lib/supabase/database.types";

function formatDiff(diff: Json): string[] {
  if (!diff || typeof diff !== "object" || Array.isArray(diff)) return [];
  const lines: string[] = [];
  for (const [key, value] of Object.entries(diff)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const v = value as Record<string, unknown>;
      lines.push(`${key}: "${String(v.from)}" → "${String(v.to)}"`);
    }
  }
  return lines;
}

export function SessionHistory({ sessionId }: { sessionId: string }) {
  const [edits, setEdits] = useState<Tables<"session_edits">[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await runWithSupabase(getEditHistory(sessionId));
      setEdits(data);
    } catch (e) {
      console.error("Failed to load edit history:", e);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime("session_edits", () => load(), `session_id=eq.${sessionId}`);

  if (edits.length === 0) return null;

  return (
    <div className="border-2 border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-between"
      >
        <span>EDIT LOG ({edits.length})</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {edits.map((edit) => (
            <div key={edit.id} className="px-3 py-2 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-accent">
                  {edit.editor_name ?? "unknown"}
                </span>
                <span className="text-muted-foreground">
                  {new Date(edit.created_at).toLocaleString("en-US", {
                    timeZone: "America/New_York",
                  })}
                </span>
              </div>
              {formatDiff(edit.diff).map((line, i) => (
                <p key={i} className="text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
