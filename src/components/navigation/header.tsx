"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code, Menu, X, User, LogOut, Plus } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { AddProjectModal } from "@/components/projects/add-project-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const handleJoinCommunity = () => {
    if (user) {
      // User is already logged in, redirect to projects
      window.location.href = '/projects'
      return
    }
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleAddProject = () => {
    if (!user) {
      setAuthMode('register')
      setShowAuthModal(true)
      return
    }
    setShowAddProject(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">DeveloperHUB</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`text-sm font-medium transition-colors ${
              isActive('/projects')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Projects
          </Link>
          <Link
            href="/developers"
            className={`text-sm font-medium transition-colors ${
              isActive('/developers')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Developers
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              isActive('/about')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="outline" onClick={handleAddProject}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative h-10 w-10"
                >
                  {user.avatar && user.avatar !== '/api/placeholder/80/80' ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-[100]">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href={`/developers/${user.id}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleJoinCommunity}>
                Join Community
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/developers"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Developers
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Link href={`/developers/${user.id}`} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleAddProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button className="w-full" onClick={handleJoinCommunity}>
                    Join Community
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <AddProjectModal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onProjectAdded={() => {
          // Refresh projects if needed
          window.location.reload()
        }}
      />
    </header>
  )
}
