"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIdentity } from "@/components/identity-gate";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { createBounty } from "@/lib/effect/BountyService";

interface BountyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BountyForm({ open, onOpenChange, onSuccess }: BountyFormProps) {
  const identity = useIdentity();
  const [targetName, setTargetName] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!targetName.trim() || !topic.trim()) return;
    setSubmitting(true);
    try {
      await runWithSupabase(
        createBounty(
          targetName.trim(),
          topic.trim(),
          identity.id,
          identity.name,
        ),
      );
      setTargetName("");
      setTopic("");
      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      console.error("Failed to create bounty:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-accent bg-background max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-accent">
            VOLUNTELL SOMEONE
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            nominate someone to talk about something. they can&apos;t say no (well, they
            can, but where&apos;s the fun in that?)
          </p>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-bold">WHO *</Label>
            <Input
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="their name (real or otherwise)"
              className="border-2 border-foreground/20 bg-background"
            />
          </div>
          <div>
            <Label className="text-xs font-bold">ABOUT WHAT *</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="the topic they MUST address"
              className="border-2 border-foreground/20 bg-background"
            />
          </div>
          <Button
            onClick={submit}
            disabled={!targetName.trim() || !topic.trim() || submitting}
            className="w-full border-2 border-accent bg-accent text-accent-foreground font-bold hover:bg-accent/80"
          >
            {submitting ? "..." : "PLACE BOUNTY"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
