"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FormInput from "@/components/FormInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactPageClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Nutrition Way", "Health City, HC 12345", "United States"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "Mon-Fri: 9AM-6PM EST"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@springsnutrition.com", "support@springsnutrition.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM", "Sunday: Closed"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions about our products or need personalized nutrition advice? We're here to help you on your
              fitness journey.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl text-foreground">Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="font-playfair font-bold text-xl text-foreground mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-4">
                          Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setIsSubmitted(false)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                          label="Full Name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          required
                          value={formData.name}
                          onChange={handleInputChange("name")}
                          error={errors.name}
                        />

                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          required
                          value={formData.email}
                          onChange={handleInputChange("email")}
                          error={errors.email}
                        />

                        <FormInput
                          label="Message"
                          name="message"
                          type="textarea"
                          placeholder="Tell us how we can help you..."
                          required
                          value={formData.message}
                          onChange={handleInputChange("message")}
                          error={errors.message}
                        />

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-playfair font-bold text-2xl text-foreground mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-8">
                    Whether you have questions about our products, need nutrition advice, or want to learn more about
                    Springs Nutrition, we're here to help.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                              {info.details.map((detail, detailIndex) => (
                                <p key={detailIndex} className="text-muted-foreground text-sm">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-playfair font-bold text-3xl text-foreground mb-4">Visit Our Location</h2>
              <p className="text-muted-foreground">
                Stop by our headquarters to learn more about our products and meet our team.
              </p>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Springs Nutrition Location"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
          onClick={() => {
            // Placeholder for WhatsApp integration
            alert("WhatsApp chat feature coming soon!")
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
