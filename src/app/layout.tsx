import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { AudioProvider } from '@/contexts/AudioContext';

export const metadata: Metadata = {
  title: "Latifah & Valen | Wedding Invitation",
  description: "Interactive wedding invitation for Latifah and Valen",

  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}