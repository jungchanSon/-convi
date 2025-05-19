import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalyticsTag from "@/features/GoogleAnalyticsTag";
import TourClientProvider from "@/features/lint-buddy/customizing/guide/TourClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convi",
  description: "project convi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalyticsTag/> }
        <TourClientProvider>
        <main>
          <title> convi </title>
          {children}
        </main>
        </TourClientProvider>
      </body>
    </html>
  );
}
