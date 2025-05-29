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
  refreshUser: () => Promise<void>
  validateUser: () => Promise<boolean>
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
      console.error("Erro no login:", error)
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

  const refreshUser = async () => {
    if (!token) return

    try {
      console.log('Refreshing user data...')
      const response = await api.get("/api/users/me")

      if (response.status === 200) {
        const userData = response.data
        console.log('Updated user data received:', userData)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        console.log('User state and localStorage updated')
      }
    } catch (error: any) {
      console.error('Error refreshing user data:', error)
      
      // Se o erro for 401 (Unauthorized) ou 404 (Not Found), 
      // significa que o token é inválido ou o usuário não existe mais
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log('User no longer exists or token is invalid during refresh, logging out...')
        logout()
        throw error // Re-throw para que o componente saiba que houve erro de autenticação
      }
    }
  }

  const validateUser = async (): Promise<boolean> => {
    if (!token) {
      console.log('No token found, user not authenticated')
      return false
    }

    try {
      console.log('Validating user existence...')
      const response = await api.get("/api/users/me")

      if (response.status === 200) {
        const userData = response.data
        console.log('User validated and data updated:', userData)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
    } catch (error: any) {
      console.error('Error validating user:', error)
      
      // Se o erro for 401 (Unauthorized) ou 404 (Not Found), 
      // significa que o token é inválido ou o usuário não existe mais
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log('User no longer exists or token is invalid, logging out...')
        logout()
        return false
      }
    }
    
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshUser,
        validateUser,
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
