import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError, NotFoundError } from "./errors";
import type { TablesInsert, TablesUpdate, Json } from "@/lib/supabase/database.types";

export const getAllSessions = () =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("sessions")
        .select("*, time_slots(*)")
        .order("created_at", { ascending: true }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const getSessionById = (id: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("sessions").select("*, time_slots(*)").eq("id", id).single(),
    );
    if (error) {
      if (error.code === "PGRST116")
        return yield* new NotFoundError({ entity: "session", id });
      return yield* new SupabaseError({ message: error.message, cause: error });
    }
    return data;
  });

export const createSession = (session: TablesInsert<"sessions">) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase.from("sessions").insert(session).select("*, time_slots(*)").single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const updateSession = (
  id: string,
  updates: TablesUpdate<"sessions">,
  editedBy?: string,
  editorName?: string,
) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;

    const { data: current } = yield* Effect.promise(() =>
      supabase.from("sessions").select().eq("id", id).single(),
    );

    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("sessions")
        .update(updates)
        .eq("id", id)
        .select("*, time_slots(*)")
        .single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });

    if (current) {
      const diff: Record<string, { from: unknown; to: unknown }> = {};
      for (const [key, value] of Object.entries(updates)) {
        const oldVal = (current as Record<string, unknown>)[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(value)) {
          diff[key] = { from: oldVal, to: value };
        }
      }
      if (Object.keys(diff).length > 0) {
        yield* Effect.promise(() =>
          supabase.from("session_edits").insert({
            session_id: id,
            edited_by: editedBy ?? null,
            editor_name: editorName ?? null,
            diff: diff as unknown as Json,
          }),
        );
      }
    }

    return data;
  });

export const deleteSession = (id: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { error } = yield* Effect.promise(() =>
      supabase.from("sessions").delete().eq("id", id),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
  });

export const getEditHistory = (sessionId: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("session_edits")
        .select()
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });
