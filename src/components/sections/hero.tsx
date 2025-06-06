"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { AuthModal } from "@/components/auth/auth-modal"

export function Hero() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect to projects or dashboard
      window.location.href = '/projects'
    } else {
      // Show registration modal
      setShowAuthModal(true)
    }
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-8">
            <Star className="mr-2 h-4 w-4 text-yellow-500" />
            Join 10,000+ developers worldwide
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Showcase Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Code{" "}
            </span>
            Connect with
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Developers
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Abhishek is the ultimate platform for developers to showcase their projects,
            discover amazing work from peers, and build meaningful connections in the coding community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              {user ? 'View Projects' : 'Get Started'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Github className="mr-2 h-5 w-5" />
                Browse Projects
              </Button>
            </Link>
          </div>

          {/* Professional Tagline */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground">
              Join our growing community of developers sharing innovative projects and building the future of technology together.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-1/2 right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </section>
  )
}
