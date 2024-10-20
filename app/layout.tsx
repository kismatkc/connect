import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
export const metadata: Metadata = {
  title: "Connect",
  description: "Connect with new people",
};

const interFont = Inter({
  weight: ["400", "800"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} antialiased`}>{children}</body>
    </html>
  );
}
