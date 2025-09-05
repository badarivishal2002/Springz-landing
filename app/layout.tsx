import type React from "react"
import type { Metadata } from "next"
import { Baloo_2, Nunito } from "next/font/google"
import { AuthProvider } from "@/hooks/useAuth"
import { SessionProvider } from "@/components/SessionProvider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const baloo = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo",
  weight: ["400", "600", "700"],
})

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Springz Nutrition - Premium Protein Supplements",
  description:
    "Discover high-quality protein supplements designed for fitness enthusiasts. Elite Protein & Native Protein for optimal performance and recovery.",
  keywords:
    "protein supplements, whey protein, fitness nutrition, muscle building, post workout recovery, springz nutrition",
  authors: [{ name: "Springz Nutrition" }],
  creator: "Springz Nutrition",
  publisher: "Springz Nutrition",
  metadataBase: new URL("https://springznutrition.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Springz Nutrition - Premium Protein Supplements",
    description: "High-quality protein supplements for serious athletes and fitness enthusiasts.",
    url: "https://springznutrition.com",
    siteName: "Springz Nutrition",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Springz Nutrition - Premium Protein Supplements",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Springz Nutrition - Premium Protein Supplements",
    description: "High-quality protein supplements for serious athletes and fitness enthusiasts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Springz Nutrition",
              description: "Premium protein supplements for fitness enthusiasts",
              url: "https://springznutrition.com",
              logo: "https://springznutrition.com/springz-logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Nutrition Way",
                addressLocality: "Health City",
                addressRegion: "HC",
                postalCode: "12345",
                addressCountry: "US",
              },
              sameAs: [
                "https://facebook.com/springznutrition",
                "https://instagram.com/springznutrition",
                "https://twitter.com/springznutrition",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans bg-background text-foreground">
        <SessionProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
