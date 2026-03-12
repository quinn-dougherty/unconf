"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { ChaosHeader } from "@/components/chaos-header";
import { ScheduleView } from "@/components/schedule-view";
import { IdentityProvider } from "@/components/identity-gate";
import { PasswordGate } from "@/components/password-gate";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Home() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

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
        <ChaosHeader />
        <ScheduleView />
      </main>
    </IdentityProvider>
  );
}
