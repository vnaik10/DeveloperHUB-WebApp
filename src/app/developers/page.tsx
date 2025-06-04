"use client"

import { DeveloperCard } from "@/components/developers/developer-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { userStorage, projectStorage } from "@/lib/storage"
import { useState, useEffect } from "react"
import { AuthModal } from "@/components/auth/auth-modal"

const skillCategories = [
  "Frontend", "Backend", "Mobile", "DevOps", "Data Science", "Blockchain",
  "Game Dev", "AI/ML", "Cloud", "Security"
]

export default function DevelopersPage() {
  const { user } = useAuth()
  const [developers, setDevelopers] = useState<any[]>([])
  const [filteredDevelopers, setFilteredDevelopers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Load all registered users and transform them into developer profiles
    const allUsers = userStorage.getAllUsers()
    const developersWithProjects = allUsers.map(user => {
      const userProjects = projectStorage.getByAuthor(user.id)
      return {
        id: user.id,
        name: user.name,
        title: user.title,
        avatar: user.avatar || '',
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        projects: userProjects.length,
        followers: 0, // Could be implemented later
        rating: 5.0, // Could be implemented later
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        websiteUrl: user.websiteUrl,
        isFollowing: false // Could be implemented later
      }
    })
    setDevelopers(developersWithProjects)
    setFilteredDevelopers(developersWithProjects)
  }, [])

  useEffect(() => {
    // Filter developers based on search and category
    let filtered = developers

    if (searchTerm) {
      filtered = filtered.filter(developer =>
        developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(developer =>
        developer.skills.some((skill: string) =>
          skill.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (selectedCategory === "Frontend" && ["React", "Vue", "Angular", "JavaScript", "TypeScript", "CSS"].some(tech => skill.includes(tech))) ||
          (selectedCategory === "Backend" && ["Node.js", "Python", "Java", "Django", "Express", "API"].some(tech => skill.includes(tech))) ||
          (selectedCategory === "Mobile" && ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"].some(tech => skill.includes(tech))) ||
          (selectedCategory === "DevOps" && ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform"].some(tech => skill.includes(tech))) ||
          (selectedCategory === "Data Science" && ["Python", "TensorFlow", "Pandas", "ML", "AI", "Data"].some(tech => skill.includes(tech))) ||
          (selectedCategory === "Blockchain" && ["Solidity", "Web3", "Ethereum", "Crypto", "DeFi"].some(tech => skill.includes(tech)))
        )
      )
    }

    setFilteredDevelopers(filtered)
  }, [developers, searchTerm, selectedCategory])

  const handleJoinCommunity = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    // User is already part of the community by being registered
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Developer Community</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Connect with talented developers from around the world
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🌟 Real Developer Profiles</h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              This page shows actual registered developers from our community. {user ? 'Your profile is automatically included when you sign up!' : 'Join our community to create your developer profile and connect with others!'}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search developers by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
            >
              <Filter className="mr-2 h-4 w-4" />
              All Specialties
            </Button>
            {skillCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Join Community Button */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredDevelopers.length} of {developers.length} developers in our community
          </p>
          <Button onClick={handleJoinCommunity}>
            <UserPlus className="mr-2 h-4 w-4" />
            {user ? 'You\'re in the Community!' : 'Join Community'}
          </Button>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevelopers.length > 0 ? (
            filteredDevelopers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm || selectedCategory ? 'No developers found matching your criteria.' : 'No developers have joined the community yet.'}
              </p>
              {!user && (
                <Button onClick={handleJoinCommunity}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Be the first to join!
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Load More - Hidden for now since we show all users */}
        {filteredDevelopers.length > 12 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Developers
            </Button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </div>
  )
}
