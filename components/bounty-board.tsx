"use client";

import { useBounties } from "@/lib/hooks/use-bounties";
import { BountyCard } from "@/components/bounty-card";

export function BountyBoard() {
  const { bounties, loading, refresh } = useBounties();

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-blink">
        LOADING BOUNTIES...
      </div>
    );
  }

  // Sort by vote count descending
  const sorted = [...bounties].sort((a, b) => {
    const aVotes = a.bounty_votes?.[0]?.count ?? 0;
    const bVotes = b.bounty_votes?.[0]?.count ?? 0;
    return bVotes - aVotes;
  });

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">
          no bounties yet. be the first to voluntell someone.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} onVoted={refresh} />
      ))}
    </div>
  );
}
