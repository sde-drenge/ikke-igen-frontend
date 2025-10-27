import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "./components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ikke igen",
  description: "Ikke igen beskrivelse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex min-h-screen flex-col antialiased",
          geistSans.variable + " " + geistMono.variable
        )}
      >
        <Header />

        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
