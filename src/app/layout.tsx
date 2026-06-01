import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInstaller } from "../components/PWAInstaller";

export const metadata: Metadata = {
  title: "Radar CRM",
  description: "CRM Imobiliário Estratégico com Inteligência Artificial",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Radar CRM",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050A18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
