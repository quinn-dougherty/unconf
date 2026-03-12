"use client";

import { useState, useEffect, useCallback } from "react";
import { useIdentity } from "@/components/identity-gate";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import {
  createComment,
  getCommentsForSession,
  flagComment,
} from "@/lib/effect/CommentService";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

function CommentCard({
  comment,
  onFlag,
}: {
  comment: Tables<"comments">;
  onFlag: (id: string) => void;
}) {
  if (comment.hidden) {
    return (
      <div className="border border-border/30 p-2 opacity-40">
        <p className="text-xs text-muted-foreground italic">
          [hidden by community flags]
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-border p-2 group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-accent">
          {comment.author_name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {new Date(comment.created_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/New_York",
            })}
          </span>
          <button
            onClick={() => onFlag(comment.id)}
            className="text-[10px] text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            title="Flag this comment"
          >
            FLAG
          </button>
        </div>
      </div>
      <p className="text-sm">{comment.body}</p>
      {comment.flag_count > 0 && (
        <span className="text-[10px] text-destructive">
          {comment.flag_count} flag{comment.flag_count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

export function CommentsSection({ sessionId }: { sessionId: string }) {
  const identity = useIdentity();
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await runWithSupabase(getCommentsForSession(sessionId));
      setComments(data);
    } catch (e) {
      console.error("Failed to load comments:", e);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime("comments", () => load(), `session_id=eq.${sessionId}`);

  const submit = async () => {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await runWithSupabase(
        createComment(sessionId, identity.id, identity.name, body.trim()),
      );
      setBody("");
      await load();
    } catch (e) {
      console.error("Failed to post comment:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlag = async (commentId: string) => {
    try {
      await runWithSupabase(flagComment(commentId, identity.id));
      await load();
    } catch (e) {
      console.error("Failed to flag comment:", e);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">COMMENTS</h3>
      <div className="space-y-2">
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} onFlag={handleFlag} />
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            no comments yet. be the first to say something unhinged.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="say something..."
          className="border-2 border-foreground/20 bg-background text-sm"
          disabled={submitting}
        />
        <Button
          onClick={submit}
          disabled={!body.trim() || submitting}
          className="border-2 border-primary bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/80"
        >
          SEND
        </Button>
      </div>
    </div>
  );
}
