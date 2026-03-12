import { Context, Effect, Layer } from "effect";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import type { SupabaseClient as SBClient } from "@supabase/supabase-js";

export type TypedSupabaseClient = SBClient<Database>;

export class SupabaseClient extends Context.Tag("SupabaseClient")<
  SupabaseClient,
  TypedSupabaseClient
>() {}

export const SupabaseClientLive = Layer.sync(SupabaseClient, () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  ) as unknown as TypedSupabaseClient,
);

export function runWithSupabase<A, E>(
  effect: Effect.Effect<A, E, SupabaseClient>,
): Promise<A> {
  return Effect.runPromise(Effect.provide(effect, SupabaseClientLive));
}
