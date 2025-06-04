import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  Users, 
  Rocket, 
  Heart, 
  Github, 
  Twitter, 
  Linkedin,
  Mail,
  Target,
  Lightbulb,
  Globe
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Code,
    title: "Project Showcase",
    description: "Display your projects with rich media, live demos, and detailed documentation to attract potential collaborators and employers."
  },
  {
    icon: Users,
    title: "Developer Networking",
    description: "Connect with like-minded developers, find mentors, and build meaningful professional relationships in the tech community."
  },
  {
    icon: Rocket,
    title: "Career Growth",
    description: "Accelerate your career with portfolio visibility, skill recognition, and opportunities to collaborate on exciting projects."
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "Get feedback on your projects, share knowledge, and contribute to a supportive developer ecosystem."
  }
]

const stats = [
  { label: "Active Developers", value: "10,000+" },
  { label: "Projects Shared", value: "25,000+" },
  { label: "Code Reviews", value: "100,000+" },
  { label: "Countries", value: "150+" }
]

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "Former Google engineer passionate about building developer communities.",
    avatar: "/api/placeholder/100/100"
  },
  {
    name: "Sarah Kim",
    role: "CTO",
    bio: "Full-stack developer with 10+ years experience in scalable platforms.",
    avatar: "/api/placeholder/100/100"
  },
  {
    name: "Michael Chen",
    role: "Head of Community",
    bio: "Developer advocate focused on creating inclusive tech communities.",
    avatar: "/api/placeholder/100/100"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}DeveloperHUB
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're building the world's largest community platform for developers to showcase their work, 
            connect with peers, and accelerate their careers through collaboration and knowledge sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Join Our Community
            </Button>
            <Button variant="outline" size="lg">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              To democratize access to opportunities in tech by creating a platform where every developer, 
              regardless of background or experience level, can showcase their skills, learn from others, 
              and build meaningful connections that advance their careers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Growing Global Community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p className="text-muted-foreground">
                We believe in creating an inclusive environment where developers from all backgrounds can thrive and contribute.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We encourage creative thinking and innovative solutions that push the boundaries of what's possible.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, from code quality to community building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start showcasing your projects, connecting with developers, and accelerating your career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
