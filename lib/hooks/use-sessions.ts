"use client";

import { useState, useEffect, useCallback } from "react";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { getAllSessions } from "@/lib/effect/SessionService";
import { getAllTimeSlots } from "@/lib/effect/TimeSlotService";
import { useRealtime } from "./use-realtime";
import { isSupabaseDown } from "@/lib/supabase/health";
import { useSupabaseStatus } from "@/components/supabase-status";
import type { Tables } from "@/lib/supabase/database.types";

export type SessionWithSlot = Tables<"sessions"> & {
  time_slots: Tables<"time_slots">;
};

export function useSessions() {
  const [sessions, setSessions] = useState<SessionWithSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<Tables<"time_slots">[]>([]);
  const [loading, setLoading] = useState(true);
  const { markDown } = useSupabaseStatus();

  const refresh = useCallback(async () => {
    try {
      const [sessionsData, slotsData] = await Promise.all([
        runWithSupabase(getAllSessions()),
        runWithSupabase(getAllTimeSlots()),
      ]);
      setSessions(sessionsData as SessionWithSlot[]);
      setTimeSlots(slotsData);
    } catch (e) {
      console.error("Failed to load sessions:", e);
      if (isSupabaseDown(e)) markDown();
    } finally {
      setLoading(false);
    }
  }, [markDown]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useRealtime("sessions", () => {
    refresh();
  });

  useRealtime("session_edits", () => {
    refresh();
  });

  return { sessions, timeSlots, loading, refresh };
}
