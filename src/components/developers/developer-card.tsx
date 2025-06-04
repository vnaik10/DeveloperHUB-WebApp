import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Github, Linkedin, Globe, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DeveloperCardProps {
  developer: {
    id: string
    name: string
    title: string
    avatar: string
    location: string
    bio: string
    skills: string[]
    projects: number
    followers: number
    rating: number
    githubUrl?: string
    linkedinUrl?: string
    websiteUrl?: string
    isFollowing?: boolean
  }
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center pb-4">
        {/* Avatar */}
        <div className="relative mx-auto mb-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden mx-auto bg-gray-200 flex items-center justify-center">
            {developer.avatar && developer.avatar.trim() !== '' && developer.avatar !== '/api/placeholder/80/80' ? (
              <Image
                src={developer.avatar}
                alt={developer.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {developer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Name and Title */}
        <div>
          <h3 className="font-semibold text-lg">{developer.name}</h3>
          <p className="text-sm text-muted-foreground">{developer.title}</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{developer.location}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Bio */}
        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
          {developer.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {developer.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {developer.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{developer.skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold">{developer.projects}</div>
            <div className="text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="font-semibold">{developer.followers}</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{developer.rating}</span>
            </div>
            <div className="text-muted-foreground">Rating</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-col gap-3">
        {/* Social Links */}
        <div className="flex justify-center gap-2">
          {developer.githubUrl && developer.githubUrl.trim() !== '' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(developer.githubUrl, '_blank')}
              title="View GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </Button>
          )}
          {developer.linkedinUrl && developer.linkedinUrl.trim() !== '' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(developer.linkedinUrl, '_blank')}
              title="View LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          )}
          {developer.websiteUrl && developer.websiteUrl.trim() !== '' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(developer.websiteUrl, '_blank')}
              title="Visit Website"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Link href={`/developers/${developer.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Button
            size="sm"
            variant={developer.isFollowing ? "secondary" : "default"}
            className="flex-1"
          >
            <Users className="mr-1 h-3 w-3" />
            {developer.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
