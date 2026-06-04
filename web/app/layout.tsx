import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://scolaritate.ro";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Școlaritate — Portal studențesc USV",
    template: "%s · Școlaritate USV",
  },
  description:
    "Accesează notele, orarul și profilul tău de student USV fără VPN, de pe orice dispozitiv. Portal neoficial pentru studenții Universității Ștefan cel Mare din Suceava.",
  keywords: [
    "USV",
    "Universitatea Stefan cel Mare Suceava",
    "portal studenti USV",
    "note USV",
    "orar USV",
    "scolaritate USV",
    "studenti Suceava",
    "portal academic USV",
    "note facultate Suceava",
  ],
  authors: [{ name: "Școlaritate" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: APP_URL,
    siteName: "Școlaritate USV",
    title: "Școlaritate — Portal studențesc USV",
    description:
      "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Școlaritate — Portal studențesc USV",
    description:
      "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${inter.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
