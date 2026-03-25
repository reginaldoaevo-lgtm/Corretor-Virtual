import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corretor Virtual Elite",
  description: "CRM Imobiliário de Elite com Inteligência Artificial",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
