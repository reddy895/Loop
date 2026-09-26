import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "LOOP – AI Customer Feedback Intelligence Platform",
  description: "Enterprise SaaS Customer Feedback Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

