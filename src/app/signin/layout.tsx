import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.0js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-center items-center">{children}</body>
    </html>
  )
}
