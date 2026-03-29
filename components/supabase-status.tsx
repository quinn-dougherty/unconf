"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SupabaseStatus {
  isDown: boolean;
  markDown: () => void;
  markUp: () => void;
}

const SupabaseStatusContext = createContext<SupabaseStatus>({
  isDown: false,
  markDown: () => {},
  markUp: () => {},
});

export const useSupabaseStatus = () => useContext(SupabaseStatusContext);

export function SupabaseStatusProvider({ children }: { children: ReactNode }) {
  const [isDown, setIsDown] = useState(false);
  const markDown = useCallback(() => setIsDown(true), []);
  const markUp = useCallback(() => setIsDown(false), []);

  return (
    <SupabaseStatusContext.Provider value={{ isDown, markDown, markUp }}>
      {isDown && <SupabaseDownBanner />}
      {children}
    </SupabaseStatusContext.Provider>
  );
}

function SupabaseDownBanner() {
  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-destructive text-destructive-foreground p-4 text-center border-b-2 border-destructive-foreground/20">
      <p className="font-bold text-lg">DATABASE OFFLINE</p>
      <p className="text-sm opacity-90">
        The database has been paused due to inactivity. Bug quinn to go restore
        it on the{" "}
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold"
        >
          Supabase dashboard
        </a>
        . Things will be broken until then.
      </p>
    </div>
  );
}
