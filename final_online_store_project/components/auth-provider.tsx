"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

export interface User {
  _id: string
  name: string
  email: string
  apartment: string
  admin: boolean
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

    // configura o header pras próximas chamadas
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

    // tenta buscar o perfil
    axios
      .get<User>("/api/users/me")
      .then(res => setUser(res.data))
      .catch(() => {
        // token inválido ou expirado
        logout()
      })
  }, [])

const login = async (email: string, senha: string): Promise<boolean> => {
  try {
    const { data } = await axios.post<{ user: User; token: string }>(
      "/api/users/login",
      { email, password: senha }
    )

    const { user: loggedUser, token } = data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(loggedUser))
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(loggedUser)
    return true
  } catch (error: any) {
    // debug temporário
    if (axios.isAxiosError(error)) {
      console.log("erro axios", error.response?.status)
    }

    // erro 401 → senha ou email inválido
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return false
    }

    // outro erro inesperado
    console.error("erro inesperado no login:", error)
    throw error
  }
}


  const logout = () => {
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
