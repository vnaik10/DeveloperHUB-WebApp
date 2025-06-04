"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, userStorage } from '@/lib/storage'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = userStorage.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const loggedInUser = userStorage.login(email, password)
      setUser(loggedInUser)
      toast.success('Welcome back!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }) => {
    try {
      setLoading(true)
      const newUser = userStorage.register(userData)
      setUser(newUser)
      toast.success('Welcome to DeveloperHUB!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    userStorage.logout()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    try {
      setLoading(true)
      const updatedUser = userStorage.updateProfile(user.id, updates)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
