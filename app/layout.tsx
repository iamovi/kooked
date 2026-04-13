import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { Reddit_Mono } from "next/font/google";
import "./globals.css";

const redditMono = Reddit_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-mono", // Add this
});

export const metadata: Metadata = {
  title: "KooKed / Website Roaster",
  description:
    "Paste any website URL and let our ruthless AI critic roast it with dark humor, savage insults, and zero mercy. Get a grade and brutal commentary instantly.",
  keywords: [
    "website roaster",
    "AI roast",
    "site review",
    "website critic",
    "kooked",
    "roast my site",
    "dark humor",
  ],
  authors: [{ name: "Kooked" }],
  creator: "Kooked",
  icons: {
    icon: "/fireicon.png",
    shortcut: "/fireicon.png",
    apple: "/fireicon.png",
  },
  metadataBase: new URL("https://kooked.vercel.app"),
  openGraph: {
    title: "Kooked — AI Website Roaster",
    description:
      "Paste a URL. Get destroyed. Our AI critic roasts websites with zero mercy.",
    type: "website",
    siteName: "Kooked",
    locale: "en_US",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Kooked Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kooked — AI Website Roaster",
    description:
      "Paste a URL. Get destroyed. Our AI critic roasts websites with zero mercy.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${redditMono.variable} ${redditMono.className}`}>
      <body className="antialiased font-sans">
        <SplashScreen />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
