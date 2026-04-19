"use client";

import { useState } from "react";
import { useSessions, type SessionWithSlot } from "@/lib/hooks/use-sessions";
import { SessionCard, EmptySlotCard } from "@/components/session-card";
import { SessionForm } from "@/components/session-form";
import { SLOT_TYPES } from "@/lib/constants";
import type { Tables } from "@/lib/supabase/database.types";

type SlotType = "lightning" | "standard" | "micro";

type SectionKey = "opener" | "micro-early" | "lightning" | "standard" | "micro-late";

const SECTIONS: {
  key: SectionKey;
  type: SlotType;
  label: string;
  timeLabel: string;
  filter?: (slotIndex: number) => boolean;
}[] = [
  {
    key: "opener",
    type: "standard",
    label: "OPENING TALK",
    timeLabel: "1:15 - 1:35 PM",
    filter: (i) => i === 4,
  },
  {
    key: "micro-early",
    type: "micro",
    label: "MICRO TALKS (OPENING)",
    timeLabel: "1:40 - 2:00 PM",
    filter: (i) => i <= 4,
  },
  {
    key: "lightning",
    type: "lightning",
    label: "LIGHTNING ROUNDS",
    timeLabel: "2:00 - 2:50 PM",
  },
  {
    key: "standard",
    type: "standard",
    label: "STANDARD TALKS",
    timeLabel: "3:00 - 4:10 PM",
    filter: (i) => i < 4,
  },
  {
    key: "micro-late",
    type: "micro",
    label: "MICRO TALKS (CLOSING)",
    timeLabel: "4:40 - 5:00 PM",
    filter: (i) => i >= 5,
  },
];

export function ScheduleView() {
  const { sessions, timeSlots, loading, refresh } = useSessions();
  const [claimSlotId, setClaimSlotId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-blink">
        LOADING SCHEDULE...
      </div>
    );
  }

  const sessionsBySlot = new Map<string, SessionWithSlot>();
  for (const s of sessions) {
    sessionsBySlot.set(s.time_slot_id, s);
  }

  const slotsByType = new Map<SlotType, Tables<"time_slots">[]>();
  for (const slot of timeSlots) {
    const list = slotsByType.get(slot.slot_type) ?? [];
    list.push(slot);
    slotsByType.set(slot.slot_type, list);
  }

  return (
    <>
      <div className="space-y-8">
        {SECTIONS.map((section) => {
          const all = slotsByType.get(section.type) ?? [];
          const slots = section.filter ? all.filter((s) => section.filter!(s.slot_index)) : all;
          const config = SLOT_TYPES[section.type];
          return (
            <div key={section.key}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className={`text-lg font-bold ${config.color}`}>
                  {section.label}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {section.timeLabel} &middot; {config.duration}min each
                </span>
              </div>
              <div className="grid gap-2">
                {slots
                  .sort((a, b) => a.slot_index - b.slot_index)
                  .map((slot) => {
                    const session = sessionsBySlot.get(slot.id);
                    if (session) {
                      return <SessionCard key={slot.id} session={session} />;
                    }
                    return (
                      <EmptySlotCard
                        key={slot.id}
                        slot={slot}
                        onClaim={() => setClaimSlotId(slot.id)}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {claimSlotId && (
        <SessionForm
          open={!!claimSlotId}
          onOpenChange={(open) => !open && setClaimSlotId(null)}
          timeSlotId={claimSlotId}
          onSuccess={() => {
            setClaimSlotId(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
