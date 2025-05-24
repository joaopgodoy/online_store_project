// app/(...) /cadastro/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [apartamento, setApartamento] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [senhaError, setSenhaError] = useState('')

  // redireciona se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/perfil')
    }
  }, [isAuthenticated, router])

  const validarSenha = (senha: string) => {
    if (senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres'
    if (!/[A-Za-z]/.test(senha)) return 'A senha deve conter pelo menos uma letra'
    if (!/\d/.test(senha)) return 'A senha deve conter pelo menos um número'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha))
      return 'A senha deve conter pelo menos um símbolo'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!nome || !email || !apartamento || !senha || !confirmaSenha) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (senha !== confirmaSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    const erroSenha = validarSenha(senha)
    if (erroSenha) {
      setSenhaError(erroSenha)
      return
    }

    setLoading(true)

    try {
      // Fazer chamada real para a API
      const response = await axios.post('/api/users', {
        name: nome,
        email,
        apartment: apartamento,
        password: senha,
        paymentMethod: null, // Sempre nulo no cadastro
        order: [] // Inicializar com array vazio
      })

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso",
      })

      // Redirecionar para login
      router.push('/login')
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      
      const errorMessage = error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente."
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Se já estiver autenticado, redirecionar
  if (isAuthenticated) {
    router.push('/perfil')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartamento">Apartamento</Label>
              <Input
                id="apartamento"
                type="text"
                value={apartamento}
                onChange={(e) => setApartamento(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  setSenhaError('')
                }}
                required
              />
              {senhaError && (
                <p className="text-sm text-red-600">{senhaError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmaSenha">Confirmar senha</Label>
              <Input
                id="confirmaSenha"
                type="password"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
            
            <p className="text-sm text-center">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}