import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AuthForm from "@/components/AuthForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign In - Springs Nutrition",
  description: "Sign in to your Springs Nutrition account to access your orders and preferences.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            <AuthForm mode="login" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
