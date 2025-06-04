import { Card, CardContent } from "@/components/ui/card"
import { Users, Code, Star, Globe } from "lucide-react"

const features = [
  {
    icon: Users,
    label: "Developer Community",
    description: "Connect with like-minded developers and share your expertise",
    color: "text-blue-600"
  },
  {
    icon: Code,
    label: "Project Showcase",
    description: "Display your best work and discover amazing projects",
    color: "text-green-600"
  },
  {
    icon: Star,
    label: "Skill Recognition",
    description: "Get recognized for your contributions and technical skills",
    color: "text-yellow-600"
  },
  {
    icon: Globe,
    label: "Global Network",
    description: "Build connections with developers from around the world",
    color: "text-purple-600"
  }
]

export function CommunityStats() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose DeveloperHUB?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a platform designed by developers, for developers. Showcase your work,
            connect with peers, and grow your professional network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="font-semibold mb-3 text-lg">{feature.label}</div>
                <div className="text-sm text-muted-foreground">{feature.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
