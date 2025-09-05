"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'ADMIN' | 'CUSTOMER'
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      // Map NextAuth session to our user format
      const mappedUser: User = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        firstName: session.user.name?.split(' ')[0] || null,
        lastName: session.user.name?.split(' ').slice(1).join(' ') || null,
      }
      setUser(mappedUser)
    } else {
      setUser(null)
    }
  }, [session])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return false
      }

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signup = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          email: userData.email,
          password: userData.password,
        }),
      })

      if (!response.ok) {
        return false
      }

      // Auto-login after successful signup
      const loginResult = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: false,
      })

      return !loginResult?.error
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    await signOut({ redirect: false })
  }

  const refreshUser = async (): Promise<void> => {
    // This would typically refetch user data from the API
    // For now, we rely on NextAuth session updates
    if (session?.user) {
      const mappedUser: User = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        firstName: session.user.name?.split(' ')[0] || null,
        lastName: session.user.name?.split(' ').slice(1).join(' ') || null,
      }
      setUser(mappedUser)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading: status === "loading", 
        login, 
        signup, 
        logout, 
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
