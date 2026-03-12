"use client";

import { useState } from "react";
import { useIdentity } from "@/components/identity-gate";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { voteBounty, deleteBounty } from "@/lib/effect/BountyService";
import { ADMIN_NAME } from "@/lib/constants";
import { useConfetti } from "@/lib/hooks/use-confetti";
import type { BountyWithVotes } from "@/lib/hooks/use-bounties";

export function BountyCard({
  bounty,
  onVoted,
}: {
  bounty: BountyWithVotes;
  onVoted: () => void;
}) {
  const identity = useIdentity();
  const fireConfetti = useConfetti();
  const isAdmin = identity.name === ADMIN_NAME;
  const [voting, setVoting] = useState(false);
  const voteCount = bounty.bounty_votes?.[0]?.count ?? 0;

  const vote = async () => {
    setVoting(true);
    try {
      await runWithSupabase(voteBounty(bounty.id, identity.id));
      fireConfetti();
      onVoted();
    } catch (e) {
      // Probably already voted (unique constraint)
      console.error("Vote failed:", e);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="border-2 border-border p-3 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="text-muted-foreground">I want </span>
            <span className="font-bold text-accent">{bounty.target_name}</span>
            <span className="text-muted-foreground"> to talk about </span>
            <span className="font-bold text-foreground">{bounty.topic}</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            {bounty.nominator_name && (
              <span className="text-[10px] text-muted-foreground">
                nominated by {bounty.nominator_name}
              </span>
            )}
            {isAdmin && (
              <button
                onClick={async () => {
                  try {
                    await runWithSupabase(deleteBounty(bounty.id));
                    onVoted();
                  } catch (e) {
                    console.error("Failed to delete bounty:", e);
                  }
                }}
                className="text-[10px] text-destructive font-bold hover:underline"
              >
                DEL
              </button>
            )}
          </div>
        </div>
        <button
          onClick={vote}
          disabled={voting}
          className="flex flex-col items-center border-2 border-border hover:border-accent px-3 py-1 transition-colors shrink-0"
        >
          <span className="text-xs">▲</span>
          <span className="text-sm font-bold">{voteCount}</span>
        </button>
      </div>
    </div>
  );
}
