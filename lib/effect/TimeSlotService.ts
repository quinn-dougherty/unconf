import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError } from "./errors";

export const getAllTimeSlots = () =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("time_slots").select().order("start_time", { ascending: true }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const getCurrentSlot = () =>
  Effect.gen(function* () {
    const slots = yield* getAllTimeSlots();
    const now = new Date().toISOString();
    return slots.find((s) => s.start_time <= now && s.end_time > now) ?? null;
  });
