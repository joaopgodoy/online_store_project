"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

interface User {
  _id: string
  name: string
  email: string
  apartment: string
  admin: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Criar uma instância do axios com configuração base
const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
      
      // Configurar o token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      })

      const { user: userData, token: authToken } = response.data
      
      setUser(userData)
      setToken(authToken)
      
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", authToken)
      
      // Configurar o token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      
      return true
    } catch (error) {
      // Don't log expected authentication errors (401)
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        console.error("Erro no login:", error)
      }
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    
    // Remover o token do axios
    delete api.defaults.headers.common['Authorization']
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
