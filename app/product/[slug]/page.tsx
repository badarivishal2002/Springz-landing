import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductDetail from "@/components/ProductDetail"
import { getProductBySlug, allProducts } from "@/data/products"
import type { Metadata } from "next"

// Generate metadata for each product page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  
  if (!product) {
    return {
      title: "Product Not Found - Springz Nutrition",
      description: "The requested product could not be found."
    }
  }

  return {
    title: `${product.name} - Springz Nutrition`,
    description: product.shortDescription || product.description,
    keywords: product.tags.join(", "),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: [{ url: product.images[0] || "/placeholder-wsy0q.png" }],
      type: "website",
    },
  }
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main className="py-8">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug,
  }))
}