import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError } from "./errors";

export const getOrCreateIdentity = (name: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("identities").insert({ name }).select().single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const getIdentity = (id: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("identities").select().eq("id", id).single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });
