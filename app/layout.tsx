import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Retinal OCT",
  description: "Diagonose retinal diseases with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-white", fontSans.variable)}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
