import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "UI'Kit — Liquid Glass",
  description:
    "Liquid-glass UI kit replicated 1:1 from Figma — Next.js, TypeScript, Tailwind, transitions.dev and React Three Fiber.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-geist antialiased">{children}</body>
    </html>
  );
}
