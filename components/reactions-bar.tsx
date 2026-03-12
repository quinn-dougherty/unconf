"use client";

import { useState, useEffect, useCallback } from "react";
import { REACTION_EMOJIS } from "@/lib/constants";
import { useIdentity } from "@/components/identity-gate";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { toggleReaction, getReactionsForSession } from "@/lib/effect/ReactionService";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { useConfetti } from "@/lib/hooks/use-confetti";
import type { Tables } from "@/lib/supabase/database.types";

type Reaction = Tables<"reactions">;

interface ReactionCounts {
  [emoji: string]: { count: number; mine: boolean };
}

export function ReactionsBar({ sessionId }: { sessionId: string }) {
  const identity = useIdentity();
  const fireConfetti = useConfetti();
  const [reactions, setReactions] = useState<ReactionCounts>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data: Reaction[] = await runWithSupabase(getReactionsForSession(sessionId));
      const counts: ReactionCounts = {};
      for (const emoji of REACTION_EMOJIS) {
        const matching = data.filter((r: Reaction) => r.emoji === emoji);
        counts[emoji] = {
          count: matching.length,
          mine: matching.some((r: Reaction) => r.identity_id === identity.id),
        };
      }
      setReactions(counts);
    } catch (e) {
      console.error("Failed to load reactions:", e);
    }
  }, [sessionId, identity.id]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime("reactions", () => load(), `session_id=eq.${sessionId}`);

  const toggle = async (emoji: string) => {
    if (busy) return;
    setBusy(emoji);
    try {
      const result = await runWithSupabase(
        toggleReaction(sessionId, emoji, identity.id),
      );
      if (result.action === "added" && emoji === "👍") {
        fireConfetti();
      }
      await load();
    } catch (e) {
      console.error("Failed to toggle reaction:", e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {REACTION_EMOJIS.map((emoji) => {
        const r = reactions[emoji] ?? { count: 0, mine: false };
        return (
          <button
            key={emoji}
            onClick={() => toggle(emoji)}
            disabled={busy === emoji}
            className={`flex items-center gap-1 border-2 px-2 py-0.5 text-sm transition-all hover:bg-card ${
              r.mine
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span>{emoji}</span>
            {r.count > 0 && (
              <span className="text-xs text-muted-foreground">{r.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
