"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save, X } from "lucide-react"
import { projectStorage } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
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
  createdAt: string
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: [] as string[],
    githubUrl: '',
    liveUrl: ''
  })

  useEffect(() => {
    const projectId = params.id as string
    const projectData = projectStorage.getById(projectId)

    if (!projectData) {
      router.push('/projects')
      return
    }

    // Check if user owns this project
    if (!user || user.id !== projectData.authorId) {
      toast.error('You can only edit your own projects')
      router.push(`/projects/${projectId}`)
      return
    }

    setProject(projectData)
    setFormData({
      title: projectData.title,
      description: projectData.description,
      image: projectData.image,
      tags: projectData.tags,
      githubUrl: projectData.githubUrl || '',
      liveUrl: projectData.liveUrl || ''
    })
    setLoading(false)
  }, [params.id, user, router])

  const handleTagsChange = (tagsText: string) => {
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData({ ...formData, tags })
  }

  const handleSave = async () => {
    if (!project || !user) return

    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Project description is required')
      return
    }

    setSaving(true)
    try {
      const updatedProject = projectStorage.update(project.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || '/api/placeholder/400/300',
        tags: formData.tags,
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined
      })

      if (updatedProject) {
        toast.success('Project updated successfully!')
        router.push(`/projects/${project.id}`)
      } else {
        toast.error('Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/projects/${project?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The project you&apos;re trying to edit doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
          <h1 className="text-4xl font-bold mb-2">Edit Project</h1>
          <p className="text-muted-foreground">
            Update your project information and details.
          </p>
        </div>

        {/* Edit Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Project Details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none"
                  placeholder="Enter your project title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none resize-none"
                  rows={4}
                  placeholder="Describe your project..."
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use default placeholder image
                </p>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Technologies & Tags
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none"
                  placeholder="React, Node.js, TypeScript, MongoDB"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate technologies with commas
                </p>
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none"
                  placeholder="https://github.com/username/repository"
                />
              </div>

              {/* Live URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary outline-none"
                  placeholder="https://your-project.com"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
