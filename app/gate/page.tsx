"use client";

import { useRouter } from "next/navigation";
import { PasswordGate } from "@/components/password-gate";

export default function GatePage() {
  const router = useRouter();
  return <PasswordGate onSuccess={() => router.push("/")} />;
}
