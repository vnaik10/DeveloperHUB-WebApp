"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Star,
  Users,
  Code,
  ExternalLink,
  Edit,
  Save,
  X,
  Trash2
} from "lucide-react"
import { userStorage, projectStorage } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"

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

interface Developer {
  id: string
  name: string
  title: string
  avatar?: string
  location?: string
  bio?: string
  skills: string[]
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  joinedAt: string
}

export default function DeveloperProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    skills: [] as string[],
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: ''
  })

  useEffect(() => {
    const developerId = params.id as string

    // Get developer data
    const userData = userStorage.getUser(developerId)
    if (!userData) {
      setLoading(false)
      return
    }

    // Transform user data to developer format
    const developerData: Developer = {
      id: userData.id,
      name: userData.name,
      title: userData.title || 'Developer',
      avatar: userData.avatar,
      location: userData.location,
      bio: userData.bio,
      skills: userData.skills || [],
      githubUrl: userData.githubUrl,
      linkedinUrl: userData.linkedinUrl,
      websiteUrl: userData.websiteUrl,
      joinedAt: userData.createdAt || new Date().toISOString()
    }

    setDeveloper(developerData)

    // Initialize edit form with current data
    setEditForm({
      name: developerData.name,
      title: developerData.title || '',
      bio: developerData.bio || '',
      location: developerData.location || '',
      skills: developerData.skills || [],
      githubUrl: developerData.githubUrl || '',
      linkedinUrl: developerData.linkedinUrl || '',
      websiteUrl: developerData.websiteUrl || ''
    })

    // Get developer's projects
    const userProjects = projectStorage.getByAuthor(developerId)
    setProjects(userProjects)
    setLoading(false)
  }, [params.id])

  const handleEditToggle = () => {
    if (isEditing && developer) {
      // Reset form to current data when canceling
      setEditForm({
        name: developer.name,
        title: developer.title || '',
        bio: developer.bio || '',
        location: developer.location || '',
        skills: developer.skills || [],
        githubUrl: developer.githubUrl || '',
        linkedinUrl: developer.linkedinUrl || '',
        websiteUrl: developer.websiteUrl || ''
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    if (!user || !developer || user.id !== developer.id) return

    try {
      await updateProfile({
        name: editForm.name,
        title: editForm.title,
        bio: editForm.bio,
        location: editForm.location,
        skills: editForm.skills,
        githubUrl: editForm.githubUrl,
        linkedinUrl: editForm.linkedinUrl,
        websiteUrl: editForm.websiteUrl
      })

      // Update local developer state
      setDeveloper({
        ...developer,
        ...editForm
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    setEditForm({ ...editForm, skills })
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!user || !confirm('Are you sure you want to delete this project?')) return

    try {
      const success = projectStorage.delete(projectId)
      if (success) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const isOwner = user && developer && user.id === developer.id

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading developer profile...</p>
        </div>
      </div>
    )
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Developer Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The developer profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/developers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developers
          </Button>
        </div>
      </div>
    )
  }

  const joinedDate = new Date(developer.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/developers')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Developers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* Avatar and Basic Info */}
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    {developer.avatar && developer.avatar.trim() !== '' && developer.avatar !== '/api/placeholder/80/80' ? (
                      <Image
                        src={developer.avatar}
                        alt={developer.name}
                        fill
                        className="rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold">
                        {developer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full text-2xl font-bold text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                        placeholder="Your name"
                      />
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full text-lg text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none text-muted-foreground"
                        placeholder="Your title"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold mb-2">{developer.name}</h1>
                      <p className="text-lg text-muted-foreground mb-4">{developer.title}</p>
                    </>
                  )}

                  {/* Location and Join Date */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="bg-transparent border-b border-gray-300 focus:border-primary outline-none text-center"
                          placeholder="Your location"
                        />
                      </div>
                    ) : (
                      developer.location && (
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{developer.location}</span>
                        </div>
                      )
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">About</h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary outline-none resize-none"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {developer.bio || 'No bio available.'}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Skills & Technologies</h3>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editForm.skills.join(', ')}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary outline-none"
                        placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {developer.skills.length > 0 ? (
                        developer.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills listed.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Connect</h3>
                    {isOwner && (
                      <div className="flex gap-1">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={handleSaveProfile} className="h-8 px-2">
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleEditToggle} className="h-8 px-2">
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={handleEditToggle} className="h-8 px-2">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">GitHub URL</label>
                        <input
                          type="url"
                          value={editForm.githubUrl}
                          onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary outline-none"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">LinkedIn URL</label>
                        <input
                          type="url"
                          value={editForm.linkedinUrl}
                          onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary outline-none"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Website URL</label>
                        <input
                          type="url"
                          value={editForm.websiteUrl}
                          onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary outline-none"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {developer.githubUrl && developer.githubUrl.trim() !== '' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(developer.githubUrl, '_blank')}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub Profile
                          <ExternalLink className="ml-auto h-3 w-3" />
                        </Button>
                      )}
                      {developer.linkedinUrl && developer.linkedinUrl.trim() !== '' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(developer.linkedinUrl, '_blank')}
                        >
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn Profile
                          <ExternalLink className="ml-auto h-3 w-3" />
                        </Button>
                      )}
                      {developer.websiteUrl && developer.websiteUrl.trim() !== '' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(developer.websiteUrl, '_blank')}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Personal Website
                          <ExternalLink className="ml-auto h-3 w-3" />
                        </Button>
                      )}
                      {!developer.githubUrl && !developer.linkedinUrl && !developer.websiteUrl && (
                        <p className="text-sm text-muted-foreground">No social links added.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{projects.length}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{developer.skills.length}</div>
                    <div className="text-xs text-muted-foreground">Skills</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Projects Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="grid gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          {project.image && project.image !== '/api/placeholder/400/300' && (
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="rounded-md object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.tags.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.tags.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 4} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {project.githubUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(project.githubUrl, '_blank')}
                                  title="View on GitHub"
                                >
                                  <Github className="h-4 w-4" />
                                </Button>
                              )}
                              {project.liveUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(project.liveUrl, '_blank')}
                                  title="View Live Demo"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              {isOwner && (
                                <>
                                  <Link href={`/projects/${project.id}/edit`}>
                                    <Button size="sm" variant="ghost" title="Edit Project">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isOwner ? "You haven't shared any projects yet." : `${developer.name} hasn't shared any projects yet.`}
                    </p>
                    {isOwner && (
                      <Link href="/projects/new">
                        <Button>
                          Add Your First Project
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
