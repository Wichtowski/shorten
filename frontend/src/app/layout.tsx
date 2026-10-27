import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { NotificationProvider } from "@components/context/NotificationContext";
import "./globals.css";
import { Navbar } from "@components/layout/Navbar";
import { UserProvider } from "@components/context/UserContext";
import { env } from "cloudflare:workers";
import { assertJwtConfigured } from "@lib/runtime-config";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"]
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"]
});

assertJwtConfigured(env);

export const metadata: Metadata = {
  title: "Shorten",
  description: "Turn long HTTPS links into short ones and see how often they get clicked.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${plexMono.variable}`}>
        <UserProvider>
          <NotificationProvider>
            <Navbar />
            <main>{children}</main>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
