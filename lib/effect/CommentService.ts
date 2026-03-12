import { Effect } from "effect";
import { SupabaseClient } from "./SupabaseClient";
import { SupabaseError } from "./errors";

export const createComment = (
  sessionId: string,
  identityId: string,
  authorName: string,
  body: string,
) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("comments")
        .insert({
          session_id: sessionId,
          identity_id: identityId,
          author_name: authorName,
          body,
        })
        .select()
        .single(),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const getCommentsForSession = (sessionId: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { data, error } = yield* Effect.promise(() =>
      supabase
        .from("comments")
        .select()
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
    return data;
  });

export const flagComment = (commentId: string, identityId: string) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseClient;
    const { error } = yield* Effect.promise(() =>
      supabase
        .from("comment_flags")
        .insert({ comment_id: commentId, identity_id: identityId }),
    );
    if (error) return yield* new SupabaseError({ message: error.message, cause: error });
  });
