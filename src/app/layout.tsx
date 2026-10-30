import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Campus Connect | Vinoba Bhave University",
  description: "Campus life in one app: Safety, Academics, Notices, Events, Clubs, and Messages.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#152A4E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen bg-paper text-text">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
