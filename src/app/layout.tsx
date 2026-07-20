import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSN HUB",
  description: "Центр экспертных знаний и профессионального развития",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
