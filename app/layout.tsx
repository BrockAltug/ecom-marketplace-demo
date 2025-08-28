import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { CartProvider } from "@/lib/cart-store"
import { AuthProvider } from "@/lib/auth-store"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { NetworkStatus } from "@/components/ui/network-status"
import { PerformanceMonitor } from "@/components/ui/performance-monitor"
import "./globals.css"

export const metadata: Metadata = {
  title: "MarketPlace - Your Modern Shopping Destination",
  description:
    "Discover amazing products with advanced search, personalized recommendations, and seamless shopping experience.",
  generator: "v0.app",
  keywords: "marketplace, shopping, ecommerce, products, deals, online store",
  authors: [{ name: "MarketPlace Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MarketPlace - Your Modern Shopping Destination",
    description: "Discover amazing products with AI-powered recommendations and premium shopping experience.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketPlace - Your Modern Shopping Destination",
    description: "Discover amazing products with AI-powered recommendations and premium shopping experience.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14b8a6" },
    { media: "(prefers-color-scheme: dark)", color: "#06b6d4" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <NetworkStatus />
              {children}
              <PerformanceMonitor />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
