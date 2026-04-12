import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
