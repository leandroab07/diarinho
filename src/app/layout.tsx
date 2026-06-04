import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, themeBootScript } from "@/components/theme-provider";
import { FloralBackdrop } from "@/components/floral-backdrop";
import { PwaRegister } from "@/components/pwa-register";
import { InstallHint } from "@/components/install-hint";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Diarinho 🌸 — Diário & Agenda",
  description:
    "Seu cantinho fofo para registrar o dia a dia e organizar compromissos.",
  applicationName: "Diarinho",
  appleWebApp: {
    capable: true,
    title: "Diarinho",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec88a3" },
    { media: "(prefers-color-scheme: dark)", color: "#15101c" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen relative">
        <ThemeProvider>
          <FloralBackdrop />
          {children}
          <PwaRegister />
          <InstallHint />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--card-fg)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                boxShadow: "var(--shadow-soft)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
