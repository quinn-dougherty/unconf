import { Data } from "effect";

export class SupabaseError extends Data.TaggedError("SupabaseError")<{
  message: string;
  cause?: unknown;
}> {}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  entity: string;
  id?: string;
}> {}
