// app/layout.tsx
import type { Metadata, Viewport } from "next"; // <-- 1. Impor Viewport
import "./globals.css";
import { PwaRegistry } from "@/components/core/PwaRegistry";

// Metadata tetap ada, tapi tanpa themeColor
export const metadata: Metadata = {
  title: "Pomozone - Focus Terminal",
  description: "A terminal-inspired Pomodoro app for developers.",
  manifest: "/manifest.json",
};

// 2. Buat objek viewport baru yang diekspor
export const viewport: Viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children} <PwaRegistry /> </body>
    </html>
  );
}