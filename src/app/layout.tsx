import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spiritual Store - Authentic Karungali Mala & Spiritual Items",
  description: "Discover authentic Karungali mala, Rudraksha products, and spiritual items. Premium quality spiritual products with proper certification. Inspired by ancient wisdom, crafted for modern life.",
  keywords: ["Karungali mala", "Rudraksha", "Spiritual items", "Meditation", "Yoga", "Spiritual store", "Authentic products", "Certified mala"],
  authors: [{ name: "Spiritual Store Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Spiritual Store",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Spiritual Store - Authentic Karungali Mala & Spiritual Items",
    description: "Premium quality spiritual products with proper certification. Discover authentic Karungali mala, Rudraksha products, and spiritual items.",
    url: "https://spiritualstore.com",
    siteName: "Spiritual Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spiritual Store - Authentic Karungali Mala & Spiritual Items",
    description: "Premium quality spiritual products with proper certification.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#FF8C42" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FF8C42",
  colorScheme: "light",
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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <MobileNavigation />
        <Toaster />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
