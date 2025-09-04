import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Elite Whey Protein - Premium Protein Supplement | Springs Nutrition",
  description:
    "Elite Whey Protein delivers 25g of pure protein per serving with minimal carbs and fat. Perfect for post-workout recovery and muscle building.",
}

export default function EliteProteinPage() {
  redirect("/product/elite-whey-protein")
}
