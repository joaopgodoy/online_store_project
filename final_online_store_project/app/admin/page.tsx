"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { produtos } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para usuários
const usuarios = [
  { id: "1", nome: "João Silva", email: "joao@exemplo.com", apartamento: "101" },
  { id: "2", nome: "Maria Souza", email: "maria@exemplo.com", apartamento: "202" },
  { id: "3", nome: "Pedro Santos", email: "pedro@exemplo.com", apartamento: "303" },
  { id: "4", nome: "Ana Oliveira", email: "ana@exemplo.com", apartamento: "404" },
  { id: "5", nome: "Carlos Pereira", email: "carlos@exemplo.com", apartamento: "505" },
]

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("usuarios")

  // Simulação de ações
  const handleDelete = (id: string, tipo: "usuario" | "produto") => {
    toast({
      title: `${tipo === "usuario" ? "Usuário" : "Produto"} excluído`,
      description: `O ${tipo} foi excluído com sucesso.`,
    })
  }

  const handleEdit = (id: string, tipo: "usuario" | "produto") => {
    toast({
      title: `Editar ${tipo === "usuario" ? "usuário" : "produto"}`,
      description: `Edição de ${tipo} iniciada.`,
    })
  }

  const handleAdd = (tipo: "usuario" | "produto") => {
    toast({
      title: `Adicionar novo ${tipo === "usuario" ? "usuário" : "produto"}`,
      description: `Adição de ${tipo} iniciada.`,
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Painel Administrativo</h1>

      <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <CardDescription>Gerencie os usuários cadastrados na plataforma.</CardDescription>
                </div>
                <Button onClick={() => handleAdd("usuario")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Apartamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.apartamento}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(usuario.id, "usuario")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(usuario.id, "usuario")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produtos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Produtos</CardTitle>
                  <CardDescription>Gerencie os produtos disponíveis na loja.</CardDescription>
                </div>
                <Button onClick={() => handleAdd("produto")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Disponibilidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                      <TableCell>{produto.disponivel ? "Disponível" : "Indisponível"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(produto.id, "produto")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(produto.id, "produto")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
