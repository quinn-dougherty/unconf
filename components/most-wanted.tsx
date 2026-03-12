"use client";

import { useBounties } from "@/lib/hooks/use-bounties";

export function MostWanted() {
  const { bounties, loading } = useBounties();

  if (loading || bounties.length === 0) return null;

  // Aggregate by target_name
  const targetVotes = new Map<string, number>();
  for (const b of bounties) {
    const votes = b.bounty_votes?.[0]?.count ?? 0;
    targetVotes.set(
      b.target_name,
      (targetVotes.get(b.target_name) ?? 0) + votes,
    );
  }

  const sorted = [...targetVotes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="border-2 border-accent p-4">
      <h3 className="text-sm font-bold text-accent mb-3">MOST WANTED</h3>
      <div className="space-y-2">
        {sorted.map(([name, votes], i) => (
          <div key={name} className="flex items-center gap-2 text-sm">
            <span className="text-accent font-bold w-5">#{i + 1}</span>
            <span className="font-bold flex-1">{name}</span>
            <span className="text-muted-foreground text-xs">
              {votes} vote{votes !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
