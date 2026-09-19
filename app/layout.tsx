import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexo CRM | Consultoria",
  description: "CRM comercial para empresas de consultoria",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
