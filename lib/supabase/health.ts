/**
 * Detect whether a Supabase error is caused by the project being paused/unreachable.
 * Free-tier Supabase projects auto-pause after 7 days of inactivity, which causes
 * DNS resolution failures and fetch network errors.
 */
export function isSupabaseDown(error: unknown): boolean {
  if (!error) return false;
  const msg = String(
    error instanceof Error ? error.message : (error as { message?: string }).message ?? error,
  ).toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network error") ||
    msg.includes("could not resolve") ||
    msg.includes("dns") ||
    msg.includes("enotfound") ||
    msg.includes("econnrefused")
  );
}
