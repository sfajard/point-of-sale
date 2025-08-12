import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "A simple e-commerce application built with Next.js",
};

/**
 * Root layout component for the application.
 *
 * Fetches the current session via `auth()` and returns the top-level HTML structure that:
 * - applies global fonts and `antialiased` styling to the <body>,
 * - provides theme context via `ThemeProvider` (system default, transitions disabled),
 * - provides authentication session via `SessionProvider`,
 * - renders the `Navbar`, the page `children`, and a `Toaster` for notifications.
 *
 * @param children - The page content to render inside the layout.
 * @returns A React element representing the application's root HTML and body structure.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <Navbar />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
