import type { Metadata } from "next";
import { Poppins, Cinzel } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RegisterServiceWorker } from "./register-sw";
import { NotificationPermission } from "./components/NotificationPermission";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Furkan Emer - Randevu Sistemi",
  description: "Profesyonel berber randevu sistemi. Online randevu alın, müsait saatleri görün.",
  manifest: "/manifest.json",
  themeColor: "#C4A747",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Furkan Emer"
  },
  keywords: ["berber", "kuaför", "saç kesimi", "sakal", "cilt bakımı", "erkek kuaförü"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-title" content="Furkan Emer" />
      </head>
      <body
        className={`${poppins.variable} ${cinzel.variable} antialiased bg-[#0D0D0D] text-white`}
      >
        <RegisterServiceWorker />
        <NotificationPermission />
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
