import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError } from "./errors";

export const createBounty = (
  targetName: string,
  topic: string,
  nominatedBy: string,
  nominatorName: string,
) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("bounties")
        .insert({
          target_name: targetName,
          topic,
          nominated_by: nominatedBy,
          nominator_name: nominatorName,
        })
        .select()
        .single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const getAllBounties = () =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("bounties")
        .select("*, bounty_votes(count)")
        .order("created_at", { ascending: false }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const voteBounty = (bountyId: string, identityId: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { error } = yield* Effect.promise(() =>
      supabase
        .from("bounty_votes")
        .insert({ bounty_id: bountyId, identity_id: identityId }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
  });

export const deleteBounty = (id: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { error } = yield* Effect.promise(() =>
      supabase.from("bounties").delete().eq("id", id),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
  });

export const getMostWanted = () =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("bounties")
        .select("*, bounty_votes(count)")
        .order("created_at", { ascending: false })
        .limit(5),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    // Sort by vote count client-side
    return (data ?? []).sort((a, b) => {
      const aVotes = (a.bounty_votes as unknown as { count: number }[])?.[0]?.count ?? 0;
      const bVotes = (b.bounty_votes as unknown as { count: number }[])?.[0]?.count ?? 0;
      return bVotes - aVotes;
    });
  });
