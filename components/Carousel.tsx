"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselSlide {
  id: number
  image: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}

interface CarouselProps {
  slides: CarouselSlide[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({ slides, autoPlay = true, interval = 6000 }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  if (slides.length === 0) return null

  return (
    <div className="relative w-full h-[500px] md:h-[600lg:h-[650px] overflow-hidden bg-springz-cream">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                  {slide.subtitle}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-springz-green hover:bg-springz-green/90 text-white px-8 py-3 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {slide.buttonText}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg rounded-lg font-medium"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-springz-green/10 to-springz-orange/10 rounded-3xl transform rotate-3"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] object-contain rounded-3xl transform hover:scale-105 transition-transform duration-500"
                />
                {/* Dynamic floating badges */}
                <div className="absolute -top-4 -right-4 bg-springz-orange text-white rounded-full p-3 shadow-lg">
                  <span className="font-bold text-sm">
                    {index === 0 && "SCIENCE"}
                    {index === 1 && "PREMIUM"}
                    {index === 2 && "CLEAN"}
                    {index === 3 && "DIAAS 100%"}
                    {index === 4 && "ECO"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:bg-springz-green/10 hover:text-springz-green p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:bg-springz-green/10 hover:text-springz-green p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-springz-green w-8" 
                  : "bg-springz-green/30 hover:bg-springz-green/50 w-3"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-springz-green rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-springz-orange rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-40 w-20 h-20 bg-springz-green rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
        <span className="text-sm font-bold text-gray-700">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </div>
  )
}