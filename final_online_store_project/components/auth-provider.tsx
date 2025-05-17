"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import jwtDecode from "jwt-decode"

interface TokenPayload {
  sub: string
  name: string
  email: string
  exp: number
}

interface User {
  _id: string
  name: string
  email: string
  apartment: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
  
    // configura o header para chamadas seguintes
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  
    // verifica com o backend
    axios
      .get<User>("/api/users/me")
      .then((res) => {
        setUser(res.data)
      })
      .catch(() => {
        // token expirou ou inválido
        logout()
      })
  }, [])


  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const { data } = await axios.post("/api/users/login", { email, password: senha })
      const { user: loggedUser, token } = data as { user: User; token: string }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(loggedUser))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(loggedUser)
      return true
    } catch (err) {
      console.error("Erro no login:", err)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}