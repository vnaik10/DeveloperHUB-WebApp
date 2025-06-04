"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { projectStorage } from "@/lib/storage"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  comments: number
  views: number
}

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Load projects from storage and get the most liked ones
    const allProjects = projectStorage.getAll()
    const featuredProjects = allProjects
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 6)
    setProjects(featuredProjects)
  }, [])
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing projects built by our talented developer community.
            Get inspired and showcase your own work.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-lg transition-shadow group">
                {project.image && project.image.trim() !== '' && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-md mb-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div className="flex items-center gap-3 mb-3">
                  {project.author.avatar && project.author.avatar.trim() !== '' && project.author.avatar !== '/api/placeholder/40/40' ? (
                    <img
                      src={project.author.avatar}
                      alt={project.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {project.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{project.author.name}</p>
                    <p className="text-xs text-muted-foreground">{project.createdAt}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
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
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    <span>❤️ {project.likes}</span>
                    <span>💬 {project.comments}</span>
                    <span>👁️ {project.views}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Project
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects to showcase yet. Be the first to add one!
              </p>
            </div>
          )}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Link href="/projects">
            <Button size="lg" variant="outline">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
