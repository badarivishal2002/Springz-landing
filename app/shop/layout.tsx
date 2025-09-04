import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop Premium Protein Supplements - Springz Nutrition",
  description:
    "Browse our collection of premium protein supplements including Plant Proteins, Functional Foods, and High-Protein Snacks. High-quality nutrition for serious athletes and fitness enthusiasts.",
  keywords: "protein supplements, plant protein, functional foods, high protein snacks, fitness nutrition, muscle building, post workout",
  openGraph: {
    title: "Shop Springz Nutrition - Premium Protein Supplements",
    description: "Discover our scientifically formulated protein supplements for optimal performance and recovery.",
    type: "website",
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
