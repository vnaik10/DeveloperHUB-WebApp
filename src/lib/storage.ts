// Local storage-based data management for DeveloperHUB
// This provides full functionality without requiring external services

export interface User {
  id: string
  email: string
  password?: string // Simple password storage for demo, optional in session
  name: string
  title: string
  bio: string
  location: string
  skills: string[]
  avatar: string
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  authorId: string
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
  isLiked?: boolean
}

export interface Comment {
  id: string
  projectId: string
  authorId: string
  author: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'developerhub_users',
  PROJECTS: 'developerhub_projects',
  COMMENTS: 'developerhub_comments',
  CURRENT_USER: 'developerhub_current_user',
  LIKES: 'developerhub_likes'
}

// Sample projects to demonstrate the platform
const getSampleProjects = (): Project[] => [
  {
    id: 'sample-1',
    title: 'AI-Powered Task Manager',
    description: 'A smart task management app that uses AI to prioritize your tasks and suggest optimal scheduling. Built with React, Node.js, and OpenAI API.',
    image: '/api/placeholder/400/300',
    authorId: 'sample-user-1',
    author: {
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['React', 'Node.js', 'AI', 'TypeScript', 'MongoDB'],
    likes: 42,
    comments: 8,
    views: 156,
    githubUrl: 'https://github.com/alexchen/ai-task-manager',
    liveUrl: 'https://ai-tasks.demo.com',
    createdAt: '2024-01-15',
    isLiked: false
  },
  {
    id: 'sample-2',
    title: 'Real-time Collaboration Whiteboard',
    description: 'A collaborative whiteboard application with real-time synchronization, perfect for remote teams. Features include drawing tools, sticky notes, and video chat integration.',
    image: '/api/placeholder/400/300',
    authorId: 'sample-user-2',
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['Vue.js', 'Socket.io', 'Canvas', 'WebRTC'],
    likes: 38,
    comments: 12,
    views: 203,
    githubUrl: 'https://github.com/sarahjohnson/collab-whiteboard',
    liveUrl: 'https://whiteboard.demo.com',
    createdAt: '2024-01-10',
    isLiked: false
  },
  {
    id: 'sample-3',
    title: 'Cryptocurrency Portfolio Tracker',
    description: 'Track your crypto investments with real-time price updates, portfolio analytics, and profit/loss calculations. Supports 100+ cryptocurrencies.',
    image: '/api/placeholder/400/300',
    authorId: 'sample-user-3',
    author: {
      name: 'Mike Rodriguez',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['React', 'Python', 'FastAPI', 'Chart.js', 'PostgreSQL'],
    likes: 29,
    comments: 6,
    views: 89,
    githubUrl: 'https://github.com/mikerodriguez/crypto-tracker',
    liveUrl: 'https://crypto-portfolio.demo.com',
    createdAt: '2024-01-08',
    isLiked: false
  }
]

// Initialize with sample data if empty
const initializeData = () => {
  if (typeof window === 'undefined') return

  // Initialize users (empty - only real registered users)
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
  }

  // Initialize projects with sample data to demonstrate the platform
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(getSampleProjects()))
  }

  // Initialize comments
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify([]))
  }

  // Initialize likes
  if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify({}))
  }
}

// User management
export const userStorage = {
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): User => {
    initializeData()
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')

    // Check if email already exists
    if (users.find((u: User) => u.email === userData.email)) {
      throw new Error('Email already exists')
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))

    return newUser
  },

  login: (email: string, password: string): User => {
    initializeData()
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      throw new Error('User not found')
    }

    if (user.password !== password) {
      throw new Error('Invalid password')
    }

    // Don't store password in current user session
    const userSession = { ...user }
    delete userSession.password
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession))
    return userSession
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },

  updateProfile: (userId: string, updates: Partial<User>): User => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const userIndex = users.findIndex((u: User) => u.id === userId)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

    const currentUser = userStorage.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]))
    }

    return users[userIndex]
  },

  getAllUsers: (): User[] => {
    initializeData()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  },

  getUser: (userId: string): User | null => {
    initializeData()
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    return users.find((u: User) => u.id === userId) || null
  }
}

// Project management
export const projectStorage = {
  create: (projectData: Omit<Project, 'id' | 'createdAt' | 'likes' | 'comments' | 'views'>): Project => {
    initializeData()
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date().toISOString()
    }

    projects.unshift(newProject) // Add to beginning
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))

    return newProject
  },

  getAll: (): Project[] => {
    initializeData()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
  },

  getById: (id: string): Project | null => {
    const projects = projectStorage.getAll()
    return projects.find(p => p.id === id) || null
  },

  getByAuthor: (authorId: string): Project[] => {
    const projects = projectStorage.getAll()
    return projects.filter(p => p.authorId === authorId)
  },

  like: (projectId: string, userId: string): void => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
    const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}')

    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)
    if (projectIndex === -1) return

    const likeKey = `${userId}_${projectId}`

    if (likes[likeKey]) {
      // Unlike
      delete likes[likeKey]
      projects[projectIndex].likes--
    } else {
      // Like
      likes[likeKey] = true
      projects[projectIndex].likes++
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes))
  },

  isLiked: (projectId: string, userId: string): boolean => {
    if (!userId) return false
    const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}')
    return !!likes[`${userId}_${projectId}`]
  },

  incrementViews: (projectId: string): void => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

    if (projectIndex !== -1) {
      projects[projectIndex].views++
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    }
  },

  update: (projectId: string, updates: Partial<Project>): Project | null => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

    if (projectIndex === -1) return null

    projects[projectIndex] = { ...projects[projectIndex], ...updates }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    return projects[projectIndex]
  },

  delete: (projectId: string): boolean => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

    if (projectIndex === -1) return false

    projects.splice(projectIndex, 1)
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    return true
  }
}

// Clear all data (for development/reset)
export const clearAllData = () => {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  initializeData()
}

// Development helper to clear data from console
if (typeof window !== 'undefined') {
  (window as unknown as { clearDeveloperHubData: () => void }).clearDeveloperHubData = clearAllData
}

// Initialize data on import
if (typeof window !== 'undefined') {
  initializeData()
}
