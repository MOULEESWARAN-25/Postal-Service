import "./globals.css";
import { Inter } from "next/font/google";
import ClientHeader from "./clientHeader";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata = {
  title: "India Post DSS — Decision Support System",
  description:
    "A decision support system for India Post field officers to analyze demographics, recommend postal schemes, and plan outreach campaigns.",
  keywords: "India Post, DSS, Decision Support, Postal Schemes, Demographics",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C8102E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen" style={{ background: "#F6F8FC" }}>
            <ClientHeader />
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
