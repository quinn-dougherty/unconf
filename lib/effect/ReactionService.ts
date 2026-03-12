import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError } from "./errors";

export const toggleReaction = (
  sessionId: string,
  emoji: string,
  identityId: string,
) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;

    // Check if reaction exists
    const { data: existing } = yield* Effect.promise(() =>
      supabase
        .from("reactions")
        .select("id")
        .eq("session_id", sessionId)
        .eq("identity_id", identityId)
        .eq("emoji", emoji)
        .maybeSingle(),
    );

    if (existing) {
      const { error } = yield* Effect.promise(() =>
        supabase.from("reactions").delete().eq("id", existing.id),
      );
      if (error) return yield* new SupabaseError({ message: error.message, cause: error });
      return { action: "removed" as const };
    } else {
      const { error } = yield* Effect.promise(() =>
        supabase
          .from("reactions")
          .insert({ session_id: sessionId, identity_id: identityId, emoji }),
      );
      if (error) return yield* new SupabaseError({ message: error.message, cause: error });
      return { action: "added" as const };
    }
  });

export const getReactionsForSession = (sessionId: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("reactions").select().eq("session_id", sessionId),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });
