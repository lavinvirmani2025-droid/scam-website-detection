import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Scam Detection",
  description: "Detect scam websites easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
