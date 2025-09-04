import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TestTube, Dumbbell, Leaf, Award, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-springz-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="font-bold text-5xl md:text-6xl text-gray-900 leading-tight">
                    About Springz<br />
                    Nutrition
                  </h1>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    Bring clean, DIAAS-100%<br />
                    everyday nutrition to<br />
                    everyday life.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shop">
                    <Button 
                      size="lg" 
                      className="bg-springz-green hover:bg-springz-green/90 text-white px-8 py-4 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/health-check">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg font-medium"
                    >
                      Start Health Check
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Content - SCIENCE */}
              <div className="text-center lg:text-right">
                <div className="space-y-4">
                  <h2 className="font-bold text-6xl md:text-8xl text-gray-900 leading-none">SCIENCE</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    DIAAS-100% superior<br />
                    amino acid availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars Section */}
        <section className="py-16 bg-springz-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Science */}
              <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-springz-green rounded-2xl flex items-center justify-center mx-auto">
                    <TestTube className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">SCIENCE</h3>
                    <p className="text-gray-700 font-medium">
                      DIAAS 100% biotech<br />
                      verified
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-0 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative h-32 rounded-xl overflow-hidden">
                    <img 
                      src="/athletic-person-protein-shake.png" 
                      alt="Real-world performance" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">PERFORMANCE</h3>
                    <p className="text-gray-700 font-medium">
                      Real-world performance
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sustainable */}
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-0 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-springz-orange rounded-2xl flex items-center justify-center mx-auto">
                    <Leaf className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">SUSTAINABLE</h3>
                    <p className="text-gray-700 font-medium">
                      Clean label,<br />
                      eco packaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story & Science Section */}
        <section className="py-20 bg-springz-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left - Our Story */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-4xl text-gray-900 mb-6">Our Story</h2>
                  <div className="space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Springz Nutrition is the consumer brand from Plankt Biosystems– built to make science-grade 
                      nutrition taste great. From native plant proteins to functional foods and guilt-free snacks, 
                      we combine biotech R&D, clean-label ingredients, and sustainable sourcing to support 
                      real-world performance—at prices people can actually afford.
                    </p>
                    
                    {/* Image placeholder for hand with plant */}
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Leaf className="h-16 w-16 mx-auto mb-2 text-springz-green" />
                          <p className="text-sm">Sustainable ingredients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Science & Sustainability */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-4xl text-gray-900 mb-6">Science & Sustainability</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-springz-green mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">DIAAS-100% for superior amino acid availability</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-springz-green mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">Plant proteins + spirulina; clean label, FSSAI/GMP</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-springz-green mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">Biotech-driven batch QA and traceability</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-springz-green mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">Responsible sourcing; recyclable-first packaging</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-4xl text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                At Springz Nutrition, we're committed to delivering science-grade nutrition 
                that supports your everyday performance while caring for our planet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quality */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-green/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-springz-green" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Premium Quality</h3>
                  <p className="text-gray-600">
                    Every product undergoes rigorous testing in FDA-approved facilities 
                    to ensure maximum purity and potency.
                  </p>
                </CardContent>
              </Card>

              {/* Innovation */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-orange/10 rounded-2xl flex items-center justify-center mx-auto">
                    <TestTube className="h-8 w-8 text-springz-orange" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Scientific Innovation</h3>
                  <p className="text-gray-600">
                    We leverage cutting-edge biotechnology and research to create 
                    formulations that deliver superior nutritional value.
                  </p>
                </CardContent>
              </Card>

              {/* Sustainability */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Environmental Care</h3>
                  <p className="text-gray-600">
                    From sustainable sourcing to recyclable packaging, 
                    we're committed to protecting our planet for future generations.
                  </p>
                </CardContent>
              </Card>

              {/* Transparency */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Complete Transparency</h3>
                  <p className="text-gray-600">
                    Clean labels with no hidden ingredients. 
                    You deserve to know exactly what you're putting in your body.
                  </p>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Dumbbell className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Real-World Performance</h3>
                  <p className="text-gray-600">
                    Formulated for athletes and fitness enthusiasts who demand 
                    results in their training and recovery.
                  </p>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-white border border-springz-green/10 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-orange/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-springz-orange" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Community First</h3>
                  <p className="text-gray-600">
                    We're building a community of health-conscious individuals 
                    committed to achieving their fitness goals together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-springz-green to-springz-orange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h2 className="font-bold text-4xl md:text-5xl text-white leading-tight">
                Ready to fuel your<br />
                performance?
              </h2>
              <p className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto">
                Join thousands of athletes and fitness enthusiasts who trust Springz Nutrition 
                for their daily protein needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button 
                    size="lg" 
                    className="bg-white text-springz-green hover:bg-gray-50 px-8 py-4 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Shop Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-lg font-medium"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}