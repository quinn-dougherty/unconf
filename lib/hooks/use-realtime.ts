"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type TableName = string;
type Callback<T extends Record<string, unknown> = Record<string, unknown>> = (
  payload: RealtimePostgresChangesPayload<T>,
) => void;

export function useRealtime<T extends Record<string, unknown> = Record<string, unknown>>(
  table: TableName,
  callback: Callback<T>,
  filter?: string,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const supabase = createClient();
    const channelName = `realtime-${table}-${filter ?? "all"}`;

    const channelConfig: Parameters<typeof supabase.channel>[1] = undefined;
    const channel = supabase
      .channel(channelName, channelConfig)
      .on(
        "postgres_changes" as never,
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callbackRef.current(payload);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);
}
