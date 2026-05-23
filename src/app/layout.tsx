import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Bharath Pandi — Technical Delivery Manager",
  description:
    "Over a decade of experience architecting and delivering enterprise-scale digital banking and fintech solutions across Singapore, Malaysia, and India.",
  icons: {
    icon: "/profile.jpeg",
    apple: "/profile.jpeg",
  },
  openGraph: {
    title: "Bharath Pandi — Technical Delivery Manager",
    description:
      "Seasoned Technical Delivery Manager with 16+ years in Banking, FinTech & E-Commerce. UOB Digital Banking | PayPal | Cognizant.",
    type: "website",
    images: ["/profile.jpeg"],
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
      <body className="min-h-full flex flex-col bg-[#050b18] text-slate-200">
        {children}
      </body>
    </html>
  );
}
