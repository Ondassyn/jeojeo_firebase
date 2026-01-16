import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/AuthContext";
import ToastProvider from "@/lib/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JeoJeo",
  description: "Some jeopardy with friends",
  icons: {
    icon: "/JJ.png", // points to public/my-custom-icon.png
    shortcut: "/JJ.png",
    apple: "/JJ.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/JJ.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen w-full bg-neutral-950 relative overflow-hidden flex items-center justify-center">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
