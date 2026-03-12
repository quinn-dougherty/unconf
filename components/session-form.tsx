"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIdentity } from "@/components/identity-gate";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { createSession, updateSession } from "@/lib/effect/SessionService";
import type { SessionWithSlot } from "@/lib/hooks/use-sessions";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSlotId: string;
  existingSession?: SessionWithSlot;
  onSuccess?: () => void;
}

export function SessionForm({
  open,
  onOpenChange,
  timeSlotId,
  existingSession,
  onSuccess,
}: SessionFormProps) {
  const identity = useIdentity();
  const [title, setTitle] = useState(existingSession?.title ?? "");
  const [description, setDescription] = useState(
    existingSession?.description ?? "",
  );
  const [speakers, setSpeakers] = useState(
    existingSession?.speaker_names.join(", ") ?? "",
  );
  const [tags, setTags] = useState(existingSession?.tags.join(", ") ?? "");
  const [slidesUrl, setSlidesUrl] = useState(existingSession?.slides_url ?? "");
  const [notesUrl, setNotesUrl] = useState(existingSession?.notes_url ?? "");
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!existingSession;
  const isHijack = isEdit && existingSession.created_by !== identity.id;

  const submit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const speakerNames = speakers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const tagList = tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (isEdit) {
        await runWithSupabase(
          updateSession(
            existingSession.id,
            {
              title: title.trim(),
              description: description.trim() || null,
              speaker_names: speakerNames,
              tags: tagList,
              slides_url: slidesUrl.trim() || null,
              notes_url: notesUrl.trim() || null,
            },
            identity.id,
            identity.name,
          ),
        );
      } else {
        await runWithSupabase(
          createSession({
            time_slot_id: timeSlotId,
            title: title.trim(),
            description: description.trim() || null,
            speaker_names: speakerNames,
            tags: tagList,
            slides_url: slidesUrl.trim() || null,
            notes_url: notesUrl.trim() || null,
            created_by: identity.id,
          }),
        );
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      console.error("Failed to save session:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-primary bg-background max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-primary">
            {isHijack ? "HIJACK THIS SESSION" : isEdit ? "EDIT SESSION" : "CLAIM THIS SLOT"}
          </DialogTitle>
          {isHijack && (
            <p className="text-xs text-accent font-bold">
              YOU ARE EDITING SOMEONE ELSE&apos;S SESSION. ANARCHY.
            </p>
          )}
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-bold">TITLE *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="what are you talking about"
              className="border-2 border-foreground/20 bg-background"
            />
          </div>
          <div>
            <Label className="text-xs font-bold">DESCRIPTION</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="elaborate if you dare"
              className="border-2 border-foreground/20 bg-background resize-none"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-xs font-bold">SPEAKERS (comma-separated)</Label>
            <Input
              value={speakers}
              onChange={(e) => setSpeakers(e.target.value)}
              placeholder="you, or someone you're voluntelling"
              className="border-2 border-foreground/20 bg-background"
            />
          </div>
          <div>
            <Label className="text-xs font-bold">TAGS (comma-separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="rust, chaos, bad ideas"
              className="border-2 border-foreground/20 bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-bold">SLIDES URL</Label>
              <Input
                value={slidesUrl}
                onChange={(e) => setSlidesUrl(e.target.value)}
                placeholder="https://..."
                className="border-2 border-foreground/20 bg-background text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">NOTES URL</Label>
              <Input
                value={notesUrl}
                onChange={(e) => setNotesUrl(e.target.value)}
                placeholder="https://..."
                className="border-2 border-foreground/20 bg-background text-xs"
              />
            </div>
          </div>
          <Button
            onClick={submit}
            disabled={!title.trim() || submitting}
            className="w-full border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/80"
          >
            {submitting
              ? "..."
              : isHijack
                ? "HIJACK IT"
                : isEdit
                  ? "SAVE CHANGES"
                  : "CLAIM IT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
