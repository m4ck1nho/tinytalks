import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TinyTalks - Learn English with Confidence",
  description: "Professional English language learning platform with integrated CRM for teachers and students. Master English from beginner to B1 level.",
  keywords: ["English learning", "language education", "online courses", "English teacher"],
  authors: [{ name: "TinyTalks" }],
  openGraph: {
    title: "TinyTalks - Learn English with Confidence",
    description: "Professional English language learning platform with integrated CRM for teachers and students.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
