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
    // validação
    const senhaValidationError = validarSenha(senha)
    if (senhaValidationError) {
      setSenhaError(senhaValidationError)
      return
    }
    if (senha !== confirmaSenha) {
      setSenhaError('As senhas não coincidem')
      return
    }

    setSenhaError('')
    setLoading(true)
    try {
      await axios.post('/api/users', {
        name: nome,
        email,
        apartment: apartamento,
        password: senha,
      })
      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso.',
      })
      router.push('/login')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao cadastrar',
        description:
          err.response?.data?.message ||
          'Ocorreu um problema ao criar sua conta. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* campos de nome, email e apartamento */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="apartamento">Apartamento</Label>
              <Input
                id="apartamento"
                placeholder="Ex: 101"
                value={apartamento}
                onChange={e => setApartamento(e.target.value)}
                required
              />
            </div>
            {/* campos de senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={e => {
                  setSenha(e.target.value)
                  setSenhaError('')
                }}
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, 1 letra, 1 número e 1 símbolo.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmaSenha">Confirmar Senha</Label>
              <Input
                id="confirmaSenha"
                type="password"
                value={confirmaSenha}
                onChange={e => {
                  setConfirmaSenha(e.target.value)
                  setSenhaError('')
                }}
                required
              />
              {senhaError && <p className="text-sm text-destructive">{senhaError}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}