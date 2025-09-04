"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Gift, Star } from "lucide-react"

interface PromoModalProps {
  title: string
  description: string
  buttonText: string
  onClose?: () => void
}

export default function PromoModal({ title, description, buttonText, onClose }: PromoModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem("springz-nutrition-promo-seen")

    if (!hasSeenModal) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("springz-nutrition-promo-seen", "true")
    onClose?.()
  }

  const handleClaim = () => {
    // Handle promo claim logic here
    console.log("Claiming discount...")
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl">
        {/* Header Background */}
        <div className="bg-gradient-to-r from-springz-green to-springz-orange p-6 text-white relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 p-2 text-white hover:bg-white/20 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Floating elements */}
          <div className="absolute top-4 left-4 opacity-20">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20">
            <Gift className="h-6 w-6" />
          </div>

          <div className="text-center space-y-3 relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <Gift className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-bold text-2xl">{title}</h2>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
              ))}
              <span className="ml-2 text-sm opacity-90">Rated 4.9/5 by 10,000+ customers</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600 leading-relaxed">{description}</p>
            
            {/* Promo Code */}
            <div className="bg-springz-cream border-2 border-dashed border-springz-green rounded-lg p-4">
              <div className="text-center">
                <span className="text-sm text-gray-600">Use code:</span>
                <div className="font-bold text-2xl text-springz-green tracking-wider">WELCOME15</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-springz-green rounded-full"></div>
                <span>DIAAS-100% superior amino acids</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-springz-green rounded-full"></div>
                <span>Free shipping on orders over €500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-springz-green rounded-full"></div>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full bg-springz-green hover:bg-springz-green/90 text-white py-3 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all" 
              onClick={handleClaim}
            >
              {buttonText}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500 hover:text-gray-700" 
              onClick={handleClose}
            >
              Maybe later
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">FSSAI</div>
              <div className="text-xs font-semibold text-springz-green">Certified</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Clean</div>
              <div className="text-xs font-semibold text-springz-green">Label</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">100%</div>
              <div className="text-xs font-semibold text-springz-green">Natural</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}