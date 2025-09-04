import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Leaf, Award, Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-springz-cream">
      {/* Trust indicators section */}
      <div className="border-b border-springz-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-springz-green rounded-2xl flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">100% DIAAS</h3>
              <p className="text-gray-600 text-sm">Superior amino acid availability</p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-springz-orange rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">FSSAI & GMP</h3>
              <p className="text-gray-600 text-sm">Certified quality standards</p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-springz-green rounded-2xl flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Clean Label</h3>
              <p className="text-gray-600 text-sm">No artificial additives</p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-springz-orange rounded-2xl flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Sustainable</h3>
              <p className="text-gray-600 text-sm">Eco-friendly packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/springz-logo.png"
                alt="Springz Nutrition"
                width={48}
                height={48}
                className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <span className="font-bold text-2xl text-springz-green">Springz</span>
                <div className="text-xs font-semibold text-gray-600 tracking-wider">NUTRITION</div>
              </div>
            </Link>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-900">Science-grade nutrition. Everyday taste.</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bring clean, DIAAS-100% everyday nutrition to everyday life. From native plant proteins to functional foods, we combine biotech R&D and sustainable sourcing.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-springz-green" />
                <span>1-800-SPRINGZ (1-800-777-4649)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-springz-green" />
                <span>support@springznutrition.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-springz-green" />
                <span>123 Nutrition Way, Health City, HC 12345</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900">Products</h3>
            <div className="space-y-3">
              <Link href="/shop" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                All Products
              </Link>
              <Link href="/shop/plant-protein" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Plant Protein
              </Link>
              <Link href="/shop/native-protein" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Native Protein
              </Link>
              <Link href="/shop/functional-foods" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Functional Foods
              </Link>
              <Link href="/shop/high-protein-snacks" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                High-Protein Snacks
              </Link>
              <Link href="/shop/bundles" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Value Bundles
              </Link>
            </div>

            {/* Categories */}
            <div className="pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-springz-green/20">High Protein</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-springz-green/20">Vegan</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-springz-green/20">No Added Sugar</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-springz-green/20">Budget</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900">Support</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Our Story
              </Link>
              <Link href="/science" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Science & Sustainability
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/faq" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                FAQ
              </Link>
              <Link href="/shipping" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Shipping & Returns
              </Link>
              <Link href="/track-order" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Track Your Order
              </Link>
              <Link href="/nutrition-guide" className="block text-gray-600 hover:text-springz-green transition-colors text-sm">
                Nutrition Guide
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900">Stay Connected</h3>
            <p className="text-gray-600 text-sm">
              Get exclusive offers, nutrition tips, and be the first to know about new products.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white border-springz-green/20 focus:border-springz-green"
                />
                <Button className="bg-springz-green hover:bg-springz-green/90 text-white font-medium">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to receive marketing emails. Unsubscribe at any time.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Follow Us</h4>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-springz-green/10 hover:text-springz-green">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-springz-green/10 hover:text-springz-green">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-springz-green/10 hover:text-springz-green">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-springz-green/10 hover:text-springz-green">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Customer Reviews Badge */}
            <div className="bg-white rounded-2xl p-4 border border-springz-green/10 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-springz-orange">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm font-semibold text-gray-900">4.9/5</span>
              </div>
              <p className="text-xs text-gray-600">
                Based on 10,000+ customer reviews
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Real results, real people.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-springz-green/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <span>© 2024 Springz Nutrition. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-springz-green transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-springz-green transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-springz-green transition-colors">
                Sitemap
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Secure payments powered by</span>
              <div className="flex items-center space-x-2">
                <div className="bg-springz-green/10 rounded px-3 py-2">
                  <span className="text-springz-green font-bold text-xs">VISA</span>
                </div>
                <div className="bg-springz-orange/10 rounded px-3 py-2">
                  <span className="text-springz-orange font-bold text-xs">MC</span>
                </div>
                <div className="bg-blue-600 text-white rounded px-3 py-2">
                  <span className="font-bold text-xs">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}