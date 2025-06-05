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

// Criar uma instância do axios com configuração base
const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    
    if (savedToken && savedUser) {
      try {
        // Verificar se o token parece válido (formato básico)
        if (typeof savedToken !== 'string' || savedToken.split('.').length !== 3) {
          throw new Error('Token inválido');
        }
        
        const userData = JSON.parse(savedUser)
        
        setToken(savedToken)
        setUser(userData)
        
        // Configurar o token no axios
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        
        // Marcar como inicializado - não buscar dados do servidor automaticamente
        setIsInitialized(true)
      } catch (error) {
        console.error("Erro ao restaurar a sessão:", error)
        logout() // Limpar a sessão inválida
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
        // Adicionar timeout para evitar requisições pendentes
        timeout: 5000
      })
      
      const userData = response.data
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      // Se falhou ao buscar dados do usuário, fazer logout
      console.error("Erro ao buscar dados do usuário:", error)
      
      // Limpar completamente o estado de autenticação
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      
      // Remover headers de autenticação
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
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error)
      // Se houver erro de autenticação, fazer logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout()
      }
    }
  }

  const logout = () => {
    // Criar um array com todas as keys do localStorage que queremos remover
    const keysToRemove = ["user", "token", "cart"];
    
    // Remover todos os itens
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Limpar axios e todas as suas instâncias
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
    
    // Adicionar um interceptor para cancelar requisições futuras
    const interceptorId = axios.interceptors.request.use(
      config => {
        // Rejeitar todas as requisições até que seja removido
        return Promise.reject(new Error('Operação cancelada - usuário deslogado'));
      }
    );
    
    // Após um pequeno delay, remover o interceptor
    setTimeout(() => {
      axios.interceptors.request.eject(interceptorId);
    }, 500);
    
    // Limpar estado de autenticação
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
