import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(configuredUrl || "http://localhost:3100"),
  title: {
    default: "Emir Semenov — Bot & Agent Systems",
    template: "%s | Emir Semenov",
  },
  description:
    "Experimental portfolio and implementation catalog for bot and AI-ready agent systems across messaging, web, and connected business services.",
  applicationName: "Emir Semenov — Bot & Agent Systems",
  authors: [{ name: "Emir Semenov", url: "https://github.com/MDT07" }],
  creator: "Emir Semenov",
  openGraph: {
    type: "website",
    title: "Emir Semenov — Bot & Agent Systems",
    description: "Eight practical system architectures for bots, assistants, and controlled automation.",
    siteName: "Emir Semenov — Bot & Agent Systems",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Semenov — Bot & Agent Systems",
    description: "Eight practical system architectures for bots, assistants, and controlled automation.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
