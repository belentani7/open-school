import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IA para Profesionales | Taller ILACAF — Sep 23, 24 y 25",
  description:
    "Taller intensivo de Inteligencia Artificial para profesionales de Auditoría, Derecho y Finanzas. Fernando Pérez Tapia — Instructor Principal. Cupos limitados.",
  keywords: [
    "IA",
    "inteligencia artificial",
    "taller",
    "ILACAF",
    "auditoría forense",
    "compliance",
    "finanzas",
    "Fernando Pérez Tapia",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
