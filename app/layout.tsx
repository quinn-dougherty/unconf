import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseStatusProvider } from "@/components/supabase-status";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "UNCONF FOR NO REASON",
  description: "April 25 2026 at Monstalvat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased">
        <SupabaseStatusProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SupabaseStatusProvider>
      </body>
    </html>
  );
}
