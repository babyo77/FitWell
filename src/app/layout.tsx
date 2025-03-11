import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/context/auth-context";
import Main from "@/components/main";
import { Toaster } from "sonner";

// Optimize font loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" }
  ],
};

// Enhanced metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fit-well.vercel.app"),
  title: {
    template: "%s | FitWell",
    default: "FitWell - AI-Powered Fitness & Wellness companion",
  },
  description: "Track your fitness journey with FitWell, your personalized AI health companion. Log meals, water intake, calories, and get smart wellness recommendations.",
  manifest: "/manifest.json",
  keywords: ["fitness app", "wellness tracker", "AI health assistant", "meal tracking", "calorie counter", "nutrition analyzer"],
  creator: "FitWell",
  publisher: "FitWell",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FitWell - AI-Powered Fitness & Wellness Assistant",
    description: "Track your fitness journey with FitWell, your personalized AI health assistant. Log meals, water intake, calories, and get smart wellness recommendations.",
    siteName: "FitWell",
    
  },
  appleWebApp: {
    capable: true,
    title: "FitWell",
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >

          <AuthProvider>
            <Toaster position="top-center" richColors closeButton />
            <Main>{children}</Main>
            <BottomNav />
          </AuthProvider>
      </body>
    </html>
  );
}