import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: '--font-manrope' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Queen Laundry",
  description: "Micro-SaaS for UMKM laundry management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#004ac6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-inter", manrope.variable, inter.variable)}>
      <body className="antialiased bg-background text-foreground">
        <main className="pb-20 min-h-screen">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
