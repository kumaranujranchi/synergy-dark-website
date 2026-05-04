import type { Metadata } from "next";
import { Noto_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Synergy Brand Architect - Admin Dashboard",
  description: "Internal management panel for Synergy Brand Architect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${plusJakartaSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-[#a1a1a1] font-sans">
        <ConvexClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
