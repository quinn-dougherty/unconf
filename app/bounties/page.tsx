"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { BountyBoard } from "@/components/bounty-board";
import { BountyForm } from "@/components/bounty-form";
import { MostWanted } from "@/components/most-wanted";
import { IdentityProvider } from "@/components/identity-gate";
import { PasswordGate } from "@/components/password-gate";
import { Button } from "@/components/ui/button";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function BountiesPage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setHasAccess(getCookie("unconf_access") === "1");
  }, []);

  if (hasAccess === null) return null;

  if (!hasAccess) {
    return <PasswordGate onSuccess={() => setHasAccess(true)} />;
  }

  return (
    <IdentityProvider>
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div className="py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-accent tracking-tighter mb-2">
            BOUNTY BOARD
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            voluntell people to give talks. upvote the ones you want to see.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="border-2 border-accent bg-accent text-accent-foreground font-bold hover:bg-accent/80"
          >
            + PLACE A BOUNTY
          </Button>
        </div>

        <div className="grid md:grid-cols-[1fr_250px] gap-6">
          <BountyBoard />
          <div>
            <MostWanted />
          </div>
        </div>

        <BountyForm
          open={showForm}
          onOpenChange={setShowForm}
        />
      </main>
    </IdentityProvider>
  );
}
