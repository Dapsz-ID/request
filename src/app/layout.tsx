import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Form Request - Dapsz -Powered Development",
  description: "Modern Next.js scaffold optimized for powered development with Dapsz. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Dapsz", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Dapsz Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Dapsz Scaffold",
    description: "Dapsz-powered development with modern React stack",
    url: "https://music.vyncore..my.id",
    siteName: "Music Dapsz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dapsz",
    description: "Dapsz-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
