"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Heart, MessageCircle, Eye, ExternalLink } from "lucide-react"
import { GitHubIcon } from "@/components/ui/icons"
import { useAuth } from "@/contexts/auth-context"
import { projectStorage } from "@/lib/storage"
import { useState, useEffect } from "react"
import { AuthModal } from "@/components/auth/auth-modal"
import { AddProjectModal } from "@/components/projects/add-project-modal"
import toast from "react-hot-toast"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  authorId: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  comments: number
  views: number
  isLiked: boolean
}

const popularTags = [
  "React", "TypeScript", "Node.js", "Python", "Vue.js", "Angular",
  "Next.js", "Django", "Express", "MongoDB"
]

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)

  useEffect(() => {
    // Load projects from storage and check if user has liked them
    const allProjects = projectStorage.getAll()
    const projectsWithLikeStatus = allProjects.map(project => ({
      ...project,
      isLiked: user ? projectStorage.isLiked(project.id, user.id) : false
    }))
    setProjects(projectsWithLikeStatus)
    setFilteredProjects(projectsWithLikeStatus)
  }, [user])

  useEffect(() => {
    // Filter projects based on search and tag
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(project =>
        project.tags.includes(selectedTag)
      )
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedTag])

  const handleAddProject = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setShowAddProject(true)
  }

  const refreshProjects = () => {
    const allProjects = projectStorage.getAll()
    const projectsWithLikeStatus = allProjects.map(project => ({
      ...project,
      isLiked: user ? projectStorage.isLiked(project.id, user.id) : false
    }))
    setProjects(projectsWithLikeStatus)
  }

  const handleLike = (projectId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    try {
      projectStorage.like(projectId, user.id)
      refreshProjects()
      toast.success('Project liked!')
    } catch {
      toast.error('Failed to like project')
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Projects</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Explore amazing projects built by our developer community
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How Community Sharing Works</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              All projects you add here are visible to the entire DeveloperHUB community! Other developers can like, view, and get inspired by your work.
              Similarly, you can discover and interact with projects from other community members. {user ? 'Start by adding your own project!' : 'Join the community to add your projects and interact with others!'}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("")}
            >
              <Filter className="mr-2 h-4 w-4" />
              All Categories
            </Button>
            {popularTags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add Project Button */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <Button onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            {user ? 'Add Your Project' : 'Join to Add Project'}
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-lg transition-shadow">
                {project.image && project.image.trim() !== '' && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}

                {/* Author info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {project.author.avatar && project.author.avatar.trim() !== '' && project.author.avatar !== '/api/placeholder/40/40' ? (
                      <img
                        src={project.author.avatar}
                        alt={project.author.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {project.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{project.author.name}</p>
                    <p className="text-xs text-muted-foreground">{project.createdAt}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button
                      onClick={() => handleLike(project.id)}
                      className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                        project.isLiked ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${project.isLiked ? 'fill-current' : ''}`} />
                      <span>{project.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{project.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{project.views}</span>
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        title="View on GitHub"
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(project.liveUrl, '_blank')}
                        title="View Live Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm || selectedTag ? 'No projects found matching your criteria.' : 'No projects yet.'}
              </p>
              {user && (
                <Button onClick={handleAddProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Be the first to add a project!
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />

      <AddProjectModal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onProjectAdded={refreshProjects}
      />
    </div>
  )
}
