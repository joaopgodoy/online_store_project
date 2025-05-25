"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

// Tipos para os dados
interface Usuario {
  _id: string
  name: string
  email: string
  apartment: string
  admin: boolean
}

interface Produto {
  _id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  availableQuantity: number
  image: string
  // Optional Portuguese properties for backward compatibility
  categoria?: string
  preco?: number
  estoque?: number
  quantidade?: number
  disponivel?: boolean
  descricao?: string
  imagem?: string
  stock?: number
  id?: string
}

interface EditUsuario {
  name: string
  email: string
  apartment: string
  admin: boolean
}

interface EditProduto {
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  availableQuantity: number
  image: string
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("usuarios")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para edição
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editUserData, setEditUserData] = useState<EditUsuario>({
    name: '',
    email: '',
    apartment: '',
    admin: false
  })
  const [editProductData, setEditProductData] = useState<EditProduto>({
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: true,
    availableQuantity: 0,
    image: ''
  })
  
  // Estados para controlar os modais
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)

  // Helper functions for product data extraction
  const getProductName = (produto: Produto): string => {
    return produto.name || "Produto sem nome"
  }

  const getProductCategory = (produto: Produto): string => {
    return produto.category || produto.categoria || "-"
  }

  const getProductPrice = (produto: Produto): number => {
    return produto.price ?? produto.preco ?? 0
  }

  const getProductStock = (produto: Produto): number => {
    return produto.availableQuantity ?? produto.quantidade ?? produto.stock ?? produto.estoque ?? 0
  }

  const getProductAvailability = (produto: Produto): boolean => {
    return produto.inStock ?? produto.disponivel ?? false
  }

  const getProductDescription = (produto: Produto): string => {
    return produto.description || produto.descricao || ''
  }

  const getProductImage = (produto: Produto): string => {
    return produto.image || produto.imagem || ''
  }

  const getProductId = (produto: Produto): string => {
    return produto._id || produto.id || ''
  }

  // Buscar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar usuários",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão ao buscar usuários",
        variant: "destructive"
      })
    }
  }

  // Buscar produtos
  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar produtos",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão ao buscar produtos",
        variant: "destructive"
      })
    }
  }

  // Carregar dados ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsuarios(), fetchProdutos()])
      setLoading(false)
    }
    loadData()
  }, [])

  // Deletar usuário
  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUsuarios(usuarios.filter(user => user._id !== id))
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: "Falha ao excluir usuário",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão ao excluir usuário",
        variant: "destructive"
      })
    }
  }

  // Deletar produto
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProdutos(produtos.filter(product => getProductId(product) !== id))
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: "Falha ao excluir produto",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão ao excluir produto",
        variant: "destructive"
      })
    }
  }

  // Iniciar edição de usuário (abre o modal)
  const handleEditUser = (usuario: Usuario) => {
    setEditUserData({
      name: usuario.name || '',
      email: usuario.email || '',
      apartment: usuario.apartment || '',
      admin: usuario.admin || false
    })
    setEditingUser(usuario._id)
    setIsEditUserDialogOpen(true)
  }

  // Iniciar edição de produto (abre o modal)
  const handleEditProduct = (produto: Produto) => {
    console.log('🔧 handleEditProduct called with produto:', produto);
    
    const productData = {
      name: getProductName(produto),
      description: getProductDescription(produto),
      price: getProductPrice(produto),
      category: getProductCategory(produto),
      inStock: getProductAvailability(produto),
      availableQuantity: getProductStock(produto),
      image: getProductImage(produto)
    }

    console.log('🔧 Product data extracted:', productData);

    setEditProductData(productData)
    
    const productId = getProductId(produto)
    if (productId) {
      console.log('✅ Using product ID:', productId);
      setEditingProduct(productId);
      setIsEditProductDialogOpen(true);
    } else {
      console.error('❌ Product has no valid ID:', produto);
      toast({
        title: "Erro",
        description: "Produto não possui ID válido para edição",
        variant: "destructive"
      });
    }
  }

  // Salvar edição de usuário
  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUserData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsuarios(usuarios.map(user => 
          user._id === editingUser ? { ...user, ...updatedUser } : user
        ))
        setEditingUser(null)
        setIsEditUserDialogOpen(false)
        toast({
          title: "Usuário atualizado",
          description: "Os dados do usuário foram atualizados com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: "Falha ao atualizar usuário",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão ao atualizar usuário",
        variant: "destructive"
      })
    }
  }

  // Salvar edição de produto
  const handleSaveProduct = async () => {
    console.log('🚀 Starting handleSaveProduct');
    console.log('editingProduct:', editingProduct);
    console.log('editProductData:', editProductData);
    
    if (!editingProduct) {
      toast({
        title: "Erro",
        description: "Nenhum produto selecionado para edição",
        variant: "destructive"
      });
      return;
    }

    // Validação básica dos dados obrigatórios
    if (!editProductData.name || !editProductData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!editProductData.price || editProductData.price <= 0) {
      toast({
        title: "Erro", 
        description: "O preço deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    const productId = editingProduct;
    console.log('Using product ID:', productId);

    // Formatar os dados do produto para a API
    const productDataForApi = {
      name: editProductData.name.trim(),
      description: editProductData.description?.trim() || '',
      price: Number(editProductData.price),
      category: editProductData.category || '',
      inStock: Boolean(editProductData.inStock),
      availableQuantity: Number(editProductData.availableQuantity) || 0,
      image: editProductData.image?.trim() || ''
    };

    console.log('Sending API request to:', `/api/products/${productId}`);
    console.log('Request data:', productDataForApi);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productDataForApi)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('Product updated successfully:', updatedProduct);
        
        // Update the local products array
        setProdutos(produtos.map(product => 
          getProductId(product) === productId ? { 
            ...product, 
            ...productDataForApi,
            _id: getProductId(product) // Keep original ID
          } : product
        ));
        
        // Clear states and close modal
        setEditingProduct(null);
        setIsEditProductDialogOpen(false);
        
        toast({
          title: "Produto atualizado",
          description: "Os dados do produto foram atualizados com sucesso.",
        });
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || "Falha ao atualizar produto";
        
        console.log('API error:', response.status, errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Erro de Conexão",
        description: "Erro de conexão ao atualizar produto",
        variant: "destructive"
      });
    }
  }

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditingProduct(null)
    setIsEditProductDialogOpen(false)
    setIsEditUserDialogOpen(false)
  }

  const handleAdd = (tipo: "usuario" | "produto") => {
    toast({
      title: `Adicionar novo ${tipo === "usuario" ? "usuário" : "produto"}`,
      description: `Adição de ${tipo} iniciada.`,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dados...</div>
        </div>
      </div>
    )
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
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario._id}>
                      <TableCell className="font-medium">{usuario.name}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.apartment}</TableCell>
                      <TableCell>{usuario.admin ? "Admin" : "Cliente"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(usuario)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(usuario._id)}
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
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto, index) => {
                    const uniqueKey = getProductId(produto) || `produto-${index}`;
                    
                    return (
                      <TableRow key={uniqueKey}>
                        <TableCell className="font-medium">{getProductName(produto)}</TableCell>
                        <TableCell>{getProductCategory(produto)}</TableCell>
                        <TableCell>R$ {getProductPrice(produto).toFixed(2)}</TableCell>
                        <TableCell>{getProductStock(produto)}</TableCell>
                        <TableCell>
                          {getProductAvailability(produto) ? "Disponível" : "Indisponível"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(produto)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(getProductId(produto) || uniqueKey)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para edição de usuário */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e salve para atualizar o usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userName">Nome completo</Label>
              <Input
                id="userName"
                value={editUserData.name}
                onChange={(e) => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do usuário"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userEmail">E-mail</Label>
              <Input
                id="userEmail"
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userApartment">Apartamento</Label>
              <Input
                id="userApartment"
                value={editUserData.apartment}
                onChange={(e) => setEditUserData(prev => ({ ...prev, apartment: e.target.value }))}
                placeholder="Ex: 101, 202, etc."
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="userAdmin"
                checked={editUserData.admin}
                onCheckedChange={(checked) => 
                  setEditUserData(prev => ({ ...prev, admin: checked === true }))
                }
              />
              <Label htmlFor="userAdmin">Usuário administrador</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
            <Button onClick={handleSaveUser}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para edição de produto */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e salve para atualizar o produto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do produto</Label>
              <Input
                id="name"
                value={editProductData.name}
                onChange={(e) => setEditProductData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do produto"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editProductData.description}
                onChange={(e) => setEditProductData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editProductData.price || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setEditProductData(prev => ({ ...prev, price: value }))
                  }}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={editProductData.category}
                  onValueChange={(value) => setEditProductData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="higiene">Higiene</SelectItem>
                    <SelectItem value="bebidas">Bebidas</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="availableQuantity">Estoque disponível</Label>
                <Input
                  id="availableQuantity"
                  type="number"
                  value={editProductData.availableQuantity}
                  onChange={(e) => setEditProductData(prev => ({ ...prev, availableQuantity: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">URL da imagem</Label>
                <Input
                  id="image"
                  value={editProductData.image}
                  onChange={(e) => setEditProductData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="inStock"
                checked={editProductData.inStock}
                onCheckedChange={(checked) => 
                  setEditProductData(prev => ({ ...prev, inStock: checked === true }))
                }
              />
              <Label htmlFor="inStock">Produto disponível para venda</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                console.log('Save button clicked');
                handleSaveProduct();
              }}
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}