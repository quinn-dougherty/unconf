"use client";

import { useState } from "react";
import { SITE_PASSWORD } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (value === SITE_PASSWORD) {
      document.cookie = "unconf_access=1; path=/; max-age=604800";
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div
        className={`border-2 border-primary p-8 max-w-md w-full mx-4 ${shake ? "animate-shake" : ""}`}
      >
        <h1 className="text-2xl font-bold text-primary mb-2">
          ENTER THE PASSWORD
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          you know the one. if you don&apos;t, ask someone who does.
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="..."
            className={`border-2 ${error ? "border-destructive" : "border-foreground/30"} bg-background font-mono`}
            autoFocus
          />
          <Button
            onClick={submit}
            className="border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/80"
          >
            ENTER
          </Button>
        </div>
        {error && (
          <p className="text-destructive text-sm mt-2 font-bold">
            WRONG. TRY AGAIN.
          </p>
        )}
      </div>
    </div>
  );
}
