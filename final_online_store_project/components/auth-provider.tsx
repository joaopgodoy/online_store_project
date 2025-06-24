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
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsInitialized(true)
      return
    }

    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    
    if (savedToken && savedUser) {
      try {
        // Check if token looks valid (basic format)
        if (typeof savedToken !== 'string' || savedToken.split('.').length !== 3) {
          throw new Error('Token inválido');
        }
        
        const userData = JSON.parse(savedUser)
        
        setToken(savedToken)
        setUser(userData)
        
        // Configure token in axios
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        
        // Mark as initialized - don't fetch server data automatically
        setIsInitialized(true)
      } catch (error) {
        console.error("Erro ao restaurar a sessão:", error)
        logout() // Clean invalid session
        setIsInitialized(true)
      }
    } else {
      setIsInitialized(true)
    }
  }, [])

  const fetchUserData = async (authToken: string) => {
    try {
      const response = await api.get("/api/users/me", {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        // Add timeout to avoid pending requests
        timeout: 5000
      })
      
      const userData = response.data
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData))
      }
    } catch (error) {
      // If failed to fetch user data, logout
      console.error("Erro ao buscar dados do usuário:", error)
      
      // Completely clear authentication state
      setUser(null)
      setToken(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
      
      // Remove authentication headers
      delete api.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      })

      const { user: userData, token: authToken } = response.data
      
      setUser(userData)
      setToken(authToken)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", authToken)
      }
      
      // Configure token in axios
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

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const response = await api.get("/api/users/me", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const userData = response.data
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData))
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error)
      // If there's authentication error, logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout()
      }
    }
  }

  const logout = () => {
    // Only interact with localStorage on client side
    if (typeof window !== 'undefined') {
      // Create an array with all localStorage keys we want to remove
      const keysToRemove = ["user", "token", "cart"];
      
      // Remove all items
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    
    // Clear axios and all its instances
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
    
    // Add an interceptor to cancel future requests
    const interceptorId = axios.interceptors.request.use(
      config => {
        // Reject all requests until removed
        return Promise.reject(new Error('Operação cancelada - usuário deslogado'));
      }
    );
    
    // After a small delay, remove the interceptor
    setTimeout(() => {
      axios.interceptors.request.eject(interceptorId);
    }, 500);
    
    // Clear authentication state
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshUser,
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
