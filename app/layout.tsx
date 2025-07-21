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

const currentUser = {
  email: "user@example.com",
  name: "John Doe",
  avatar: "https://github.com/shadcn.png",
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "A simple e-commerce application built with Next.js",
};

/**
 * Root layout component that sets up global providers, theming, session context, and navigation for the application.
 *
 * Wraps all pages with font styles, theme management, authentication session context, navigation bar, and notification UI.
 *
 * @param children - The page content to be rendered within the layout
 * @returns The complete HTML structure for the application's root layout
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
            <Navbar userEmail={currentUser.email} userName={currentUser.name} userAvatarUrl={currentUser.avatar} />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
