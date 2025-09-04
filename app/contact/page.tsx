import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - Springs Nutrition | Get in Touch",
  description:
    "Contact Springs Nutrition for questions about our premium protein supplements. Get personalized nutrition advice and support for your fitness journey.",
  keywords: "contact springs nutrition, protein supplement support, nutrition advice, fitness help",
  openGraph: {
    title: "Contact Springs Nutrition",
    description: "Get in touch with our nutrition experts for personalized advice and product support.",
    type: "website",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
