"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [senhaError, setSenhaError] = useState("")
  const [loading, setLoading] = useState(false)

  // redireciona se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/perfil")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSenhaError("")
    setLoading(true)

    try {
      const success = await login(email, senha)

      if (!success) {
        setSenhaError("E-mail ou senha incorreto(s). Verifique e tente novamente.")
        setLoading(false)
        return
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Você foi autenticado com sucesso.",
      })
      router.push("/perfil")
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um problema. Tente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => {
                  setSenha(e.target.value)
                  setSenhaError("")
                }}
                required
              />
              {senhaError && (
                <p className="text-sm text-destructive">{senhaError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
