"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { AuthModal } from "@/components/auth/auth-modal"
import Link from "next/link"

export function CTASection() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJoinCommunity = () => {
    if (user) {
      // User is already logged in, redirect to projects
      window.location.href = '/projects'
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Showcase Your Work?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who are already building their careers,
            sharing their projects, and connecting with the global tech community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={handleJoinCommunity}>
              <Users className="mr-2 h-5 w-5" />
              {user ? 'View Projects' : 'Join Community'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Github className="mr-2 h-5 w-5" />
                Browse Projects
              </Button>
            </Link>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Create Your Profile</h3>
                <p className="text-sm opacity-90">
                  Set up your developer profile and showcase your skills, experience, and interests.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Share Your Projects</h3>
                <p className="text-sm opacity-90">
                  Upload your projects with descriptions, images, and live demos to get discovered.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Connect & Collaborate</h3>
                <p className="text-sm opacity-90">
                  Network with other developers, get feedback, and find collaboration opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </section>
  )
}
