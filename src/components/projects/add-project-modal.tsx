"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { projectStorage } from '@/lib/storage'
import toast from 'react-hot-toast'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded?: () => void
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    githubUrl: '',
    liveUrl: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please log in to add a project')
      return
    }

    try {
      setLoading(true)

      const projectData = {
        title: formData.title,
        description: formData.description,
        image: formData.image.trim() || '/api/placeholder/400/300',
        authorId: user.id,
        author: {
          name: user.name,
          avatar: user.avatar || ''
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined
      }

      projectStorage.create(projectData)
      toast.success('Project added successfully!')

      // Reset form
      setFormData({
        title: '',
        description: '',
        image: '',
        tags: '',
        githubUrl: '',
        liveUrl: ''
      })

      onProjectAdded?.()
      onClose()
    } catch (error) {
      toast.error('Failed to add project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>
            Share your amazing project with the DeveloperHUB community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your project title"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, its features, and what makes it special..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background h-32 resize-none"
                required
              />
            </div>

            {/* Project Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Image</label>
              <div className="space-y-2">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL or upload below"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
                <div className="text-center">
                  <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-input rounded-md cursor-pointer hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Project preview"
                      className="w-full h-48 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Technologies/Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Technologies Used *</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. React, Node.js, MongoDB, TypeScript (comma separated)"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate technologies with commas
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Live Demo URL</label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-project.com"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Adding Project...' : 'Add Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
