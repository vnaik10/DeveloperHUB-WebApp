import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, ExternalLink, Github, Eye } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image: string
    author: {
      name: string
      avatar: string
    }
    tags: string[]
    likes: number
    comments: number
    views: number
    githubUrl?: string
    liveUrl?: string
    createdAt: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Overlay buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.githubUrl && (
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Github className="h-4 w-4" />
            </Button>
          )}
          {project.liveUrl && (
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <img
              src={project.author.avatar}
              alt={project.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{project.author.name}</p>
            <p className="text-xs text-muted-foreground">{project.createdAt}</p>
          </div>
        </div>

        {/* Project title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {project.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
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
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{project.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{project.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{project.views}</span>
          </div>
        </div>

        {/* View button */}
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost" size="sm">
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
