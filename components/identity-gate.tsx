"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { runWithSupabase } from "@/lib/effect/SupabaseClient";
import { getOrCreateIdentity } from "@/lib/effect/IdentityService";

interface Identity {
  id: string;
  name: string;
}

const IdentityContext = createContext<Identity | null>(null);

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = getCookie("unconf_identity");
    if (stored) {
      try {
        setIdentity(JSON.parse(stored));
      } catch {
        // Invalid cookie, re-prompt
      }
    }
    setLoading(false);
  }, []);

  const submit = useCallback(async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await runWithSupabase(getOrCreateIdentity(name.trim()));
      const ident = { id: created.id, name: created.name };
      document.cookie = `unconf_identity=${encodeURIComponent(JSON.stringify(ident))}; path=/; max-age=604800`;
      setIdentity(ident);
    } catch (e) {
      console.error("Failed to create identity:", e);
    } finally {
      setSubmitting(false);
    }
  }, [name]);

  if (loading) return null;

  if (!identity) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="border-2 border-accent p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-accent mb-2">
            WHAT DO THEY CALL YOU?
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            pick a name. any name. no verification. no accountability.
          </p>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="your name (or someone else's)"
              className="border-2 border-foreground/30 bg-background font-mono"
              autoFocus
              disabled={submitting}
            />
            <Button
              onClick={submit}
              disabled={!name.trim() || submitting}
              className="border-2 border-accent bg-accent text-accent-foreground font-bold hover:bg-accent/80"
            >
              {submitting ? "..." : "GO"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <IdentityContext.Provider value={identity}>
      {children}
    </IdentityContext.Provider>
  );
}
