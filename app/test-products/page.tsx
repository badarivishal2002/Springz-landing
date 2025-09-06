import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductNavigation from "@/components/ProductNavigation"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main>
        <ProductNavigation />
      </main>
      <Footer />
    </div>
  )
}
