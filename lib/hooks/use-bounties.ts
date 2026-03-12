"use client";

import { useState, useEffect, useCallback } from "react";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { getAllBounties } from "@/lib/effect/BountyService";
import { useRealtime } from "./use-realtime";

export type BountyWithVotes = {
  id: string;
  target_name: string;
  topic: string;
  nominated_by: string | null;
  nominator_name: string | null;
  created_at: string;
  bounty_votes: { count: number }[];
};

export function useBounties() {
  const [bounties, setBounties] = useState<BountyWithVotes[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await runWithSupabase(getAllBounties());
      setBounties(data as unknown as BountyWithVotes[]);
    } catch (e) {
      console.error("Failed to load bounties:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useRealtime("bounties", () => refresh());
  useRealtime("bounty_votes", () => refresh());

  return { bounties, loading, refresh };
}
