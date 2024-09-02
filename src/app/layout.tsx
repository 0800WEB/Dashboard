
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
//core
import "primereact/resources/primereact.min.css";                                       
import React from 'react';
import { Metadata } from "next";
import ConnectionStatus from '@/components/ConnectionStatus';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col items-center justify-center bg-gray-100"} style={{backgroundColor:"#f3f4f6"}}>
        <ConnectionStatus>
          {children}
        </ConnectionStatus>
      </body>
    </html>
  );
}
