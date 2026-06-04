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
    default: "Scolaritate+ — Note, orar și profil fără VPN",
    template: "%s · Scolaritate+",
  },
  description:
    "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
  keywords: [
    "portal USV",
    "USV",
    "Universitatea Stefan cel Mare Suceava",
    "note USV",
    "orar USV",
    "studenti USV",
    "scolaritate USV",
    "portal studenti Suceava",
    "note facultate USV",
  ],
  authors: [{ name: "Scolaritate+" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: APP_URL,
    siteName: "Scolaritate+",
    title: "Scolaritate+ — Note, orar și profil fără VPN",
    description:
      "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
    images: [{ url: "/opengraph-image", alt: "Scolaritate+ — interfață modernă pentru studenții USV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scolaritate+ — Note, orar și profil fără VPN",
    description:
      "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
    images: [{ url: "/opengraph-image", alt: "Scolaritate+ — interfață modernă pentru studenții USV" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Scolaritate+",
  url: APP_URL,
  description: "Note, orar și profil pentru studenții USV — fără VPN, de pe orice dispozitiv.",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  inLanguage: "ro",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  provider: {
    "@type": "Organization",
    name: "Universitatea Ștefan cel Mare din Suceava",
    url: "https://www.usv.ro",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
