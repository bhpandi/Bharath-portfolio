import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-bharath-nine.vercel.app"),
  title: "Bharath Pandi — Technical Delivery Manager",
  description:
    "Senior Technical Delivery Manager with 16+ years in Banking, FinTech & E-Commerce. UOB Digital Banking | PayPal | Cognizant. Based in Singapore.",
  applicationName: "Bharath Pandi Portfolio",
  authors: [{ name: "Bharath Pandi" }],
  keywords: [
    "Technical Delivery Manager",
    "FinTech",
    "Digital Banking",
    "Singapore",
    "UOB",
    "PayPal",
    "Cognizant",
    "Portfolio",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bharath Pandi",
    startupImage: "/apple-touch-icon.png",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon-32.png",
  },
  openGraph: {
    title: "Bharath Pandi — Technical Delivery Manager",
    description:
      "Seasoned Technical Delivery Manager with 16+ years in Banking, FinTech & E-Commerce. UOB Digital Banking | PayPal | Cognizant.",
    type: "website",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Bharath Pandi" }],
  },
  twitter: {
    card: "summary",
    title: "Bharath Pandi — Technical Delivery Manager",
    description: "16+ years in FinTech, Banking & E-Commerce. Based in Singapore.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* PWA service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
        {/* iOS safe areas */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050b18] text-slate-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
