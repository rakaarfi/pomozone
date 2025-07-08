// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegistry } from "@/components/core/PwaRegistry";

const APP_NAME = "PomoZone";
const APP_DESCRIPTION = "A terminal-inspired Pomodoro app to help developers code, focus, and commit to deep work sessions.";
const APP_URL = "https://pomozone.vercel.app";

export const metadata: Metadata = {
  // --- Informasi Dasar ---
  title: `${APP_NAME} - A Focus Terminal for Developers`,
  description: APP_DESCRIPTION,

  // --- Metadata PWA ---
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },

  // --- Metadata SEO & Social Sharing (Open Graph) ---
  keywords: ["pomodoro", "focus timer", "developer productivity", "pomozone", "code focus", "time management"],
  authors: [{ name: "Raka Arfi", url: "https://github.com/rakaarfi" }],

  openGraph: {
    type: "website",
    url: APP_URL,
    title: `${APP_NAME} - Focus Terminal`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{
      url: `${APP_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: `Promotional image for ${APP_NAME}`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rakaarfi",
    title: `${APP_NAME} - Focus Terminal`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
};

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
      <body>
        {children}
        <PwaRegistry />
      </body>
    </html>
  );
}