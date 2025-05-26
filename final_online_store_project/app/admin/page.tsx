"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Plus, Package, Users, Shield, User } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  availableQuantity: number
  sold: number
}

interface ProductFormData {
  name: string
  description: string
  price: string
  image: string
  category: string
  inStock: boolean
  availableQuantity: string
}

interface User {
  _id: string
  name: string
  email: string
  apartment: string
  admin: boolean
  createdAt: string
}

interface UserFormData {
  name: string
  email: string
  apartment: string
  admin: boolean
  password: string
}

const CATEGORIES = [
  "Alimentos e Bebidas",
  "Higiene e Cuidados",
  "Limpeza",
  "Farmácia e Bem-estar"
]

export default function AdminPage() {
  // Estados para produtos
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    inStock: true,
    availableQuantity: ""
  })
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)

  // Estados para usuários
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: "",
    email: "",
    apartment: "",
    admin: false,
    password: ""
  })
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    fetchUsers()
  }, [])

  // Funções para produtos (mantidas as mesmas)
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      const data = await response.json()
      
      const transformedData = data.map((product: any) => ({
        _id: product.id || product._id || "",
        name: product.name || "",
        description: product.descricao || product.description || "",
        price: Number(product.preco || product.price || 0),
        image: product.imagem || product.image || "",
        category: product.categoria || product.category || "",
        inStock: Boolean(product.disponivel !== undefined ? product.disponivel : product.inStock !== undefined ? product.inStock : true),
        availableQuantity: Number(product.estoque || product.availableQuantity || 0),
        sold: Number(product.vendidos || product.sold || 0)
      }))
      
      setProducts(transformedData)
    } catch (error) {
      console.error('Erro no fetchProducts:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      })
    } finally {
      setLoadingProducts(false)
    }
  }

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      inStock: true,
      availableQuantity: ""
    })
    setEditingProduct(null)
  }

  const openAddProductDialog = () => {
    resetProductForm()
    setIsProductFormOpen(true)
  }

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product)
    setProductFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? product.price.toString() : "0",
      image: product.image || "",
      category: product.category || "",
      inStock: Boolean(product.inStock),
      availableQuantity: product.availableQuantity ? product.availableQuantity.toString() : "0"
    })
    setIsProductFormOpen(true)
  }

  const updateStockStatus = (quantity: string, currentInStock: boolean) => {
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty <= 0) {
      return false
    }
    return currentInStock
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productFormData.name || !productFormData.description || !productFormData.price || !productFormData.category || !productFormData.availableQuantity) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const price = parseFloat(productFormData.price)
    const quantity = parseInt(productFormData.availableQuantity)

    if (isNaN(price) || price < 0) {
      toast({
        title: "Erro",
        description: "Preço deve ser um número válido",
        variant: "destructive"
      })
      return
    }

    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser um número válido",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingProduct(true)

    try {
      const finalInStock = quantity > 0 ? productFormData.inStock : false

      const productData = {
        name: productFormData.name,
        description: productFormData.description,
        price: price,
        image: productFormData.image || "/placeholder.svg?height=300&width=300",
        category: productFormData.category,
        inStock: finalInStock,
        availableQuantity: quantity
      }

      let response
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar produto')
      }

      if (quantity === 0 && productFormData.inStock) {
        toast({
          title: "Produto salvo com aviso",
          description: "Produto foi marcado como indisponível devido ao estoque zero",
          variant: "default"
        })
      } else {
        toast({
          title: "Sucesso",
          description: editingProduct ? "Produto atualizado com sucesso" : "Produto criado com sucesso"
        })
      }

      setIsProductFormOpen(false)
      resetProductForm()
      fetchProducts()

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar produto",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  const handleProductDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir produto')
      }

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso"
      })

      fetchProducts()

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive"
      })
    }
  }

  // Funções para usuários
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro no fetchUsers:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  const resetUserForm = () => {
    setUserFormData({
      name: "",
      email: "",
      apartment: "",
      admin: false,
      password: ""
    })
    setEditingUser(null)
  }

  const openAddUserDialog = () => {
    resetUserForm()
    setIsUserFormOpen(true)
  }

  const openEditUserDialog = (user: User) => {
    setEditingUser(user)
    setUserFormData({
      name: user.name || "",
      email: user.email || "",
      apartment: user.apartment || "",
      admin: Boolean(user.admin),
      password: "" // Senha sempre vazia na edição
    })
    setIsUserFormOpen(true)
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userFormData.name || !userFormData.email || !userFormData.apartment) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Validar senha apenas para novos usuários
    if (!editingUser && !userFormData.password) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória para novos usuários",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingUser(true)

    try {
      const userData = {
        name: userFormData.name,
        email: userFormData.email,
        apartment: userFormData.apartment,
        admin: userFormData.admin,
        ...(userFormData.password && { password: userFormData.password }) // Incluir senha apenas se fornecida
      }

      let response
      if (editingUser) {
        response = await fetch(`/api/users/${editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
      } else {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar usuário')
      }

      toast({
        title: "Sucesso",
        description: editingUser ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso"
      })

      setIsUserFormOpen(false)
      resetUserForm()
      fetchUsers()

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar usuário",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingUser(false)
    }
  }

  const handleUserDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir usuário')
      }

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso"
      })

      fetchUsers()

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie produtos e usuários da loja</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
        </TabsList>
        
        {/* Aba de Produtos */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Gerenciar Produtos</h2>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos</p>
            </div>
            <Button onClick={openAddProductDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Produtos ({products.length})
              </CardTitle>
              <CardDescription>
                Lista de todos os produtos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Carregando produtos...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vendidos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={product.availableQuantity === 0 ? "text-red-600 font-medium" : ""}>
                            {product.availableQuantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.inStock && product.availableQuantity > 0 ? "default" : "destructive"}>
                            {product.inStock && product.availableQuantity > 0 ? "Disponível" : "Indisponível"}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditProductDialog(product)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProductDelete(product._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Usuários */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
              <p className="text-muted-foreground">Adicione, edite ou remova usuários</p>
            </div>
            <Button onClick={openAddUserDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Usuários ({users.length})
              </CardTitle>
              <CardDescription>
                Lista de todos os usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Carregando usuários...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Apartamento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.admin ? (
                                <Shield className="w-5 h-5 text-primary" />
                              ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.apartment}</TableCell>
                        <TableCell>
                          <Badge variant={user.admin ? "default" : "secondary"}>
                            {user.admin ? "Administrador" : "Cliente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserDelete(user._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Produtos */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Faça as alterações necessárias no produto"
                : "Preencha os dados do novo produto"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nome do Produto *</Label>
                <Input
                  id="product-name"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">Descrição *</Label>
                <Textarea
                  id="product-description"
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  placeholder="Descrição do produto"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Preço (R$) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-quantity">Quantidade *</Label>
                  <Input
                    id="product-quantity"
                    type="number"
                    min="0"
                    value={productFormData.availableQuantity}
                    onChange={(e) => {
                      const newQuantity = e.target.value
                      setProductFormData({
                        ...productFormData, 
                        availableQuantity: newQuantity,
                        inStock: updateStockStatus(newQuantity, productFormData.inStock)
                      })
                    }}
                    placeholder="0"
                    required
                  />
                  {parseInt(productFormData.availableQuantity) === 0 && (
                    <p className="text-sm text-orange-600">
                      ⚠️ Produtos com estoque 0 serão automaticamente marcados como indisponíveis
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-category">Categoria *</Label>
                <Select
                  value={productFormData.category}
                  onValueChange={(value) => setProductFormData({...productFormData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-image">URL da Imagem</Label>
                <Input
                  id="product-image"
                  value={productFormData.image}
                  onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="product-inStock"
                  checked={productFormData.inStock}
                  disabled={parseInt(productFormData.availableQuantity) === 0}
                  onChange={(e) => setProductFormData({...productFormData, inStock: e.target.checked})}
                />
                <Label htmlFor="product-inStock" className={parseInt(productFormData.availableQuantity) === 0 ? "text-muted-foreground" : ""}>
                  Produto disponível
                  {parseInt(productFormData.availableQuantity) === 0 && " (desabilitado - estoque zero)"}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProductFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmittingProduct}>
                {isSubmittingProduct 
                  ? "Salvando..." 
                  : editingProduct 
                    ? "Atualizar" 
                    : "Criar"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para Usuários */}
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Faça as alterações necessárias no usuário"
                : "Preencha os dados do novo usuário"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUserSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome Completo *</Label>
                <Input
                  id="user-name"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  placeholder="Nome completo do usuário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-apartment">Apartamento *</Label>
                <Input
                  id="user-apartment"
                  value={userFormData.apartment}
                  onChange={(e) => setUserFormData({...userFormData, apartment: e.target.value})}
                  placeholder="Ex: 101, 202A, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-password">
                  {editingUser ? "Nova Senha (deixe vazio para manter atual)" : "Senha *"}
                </Label>
                <Input
                  id="user-password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  placeholder="Digite a senha"
                  required={!editingUser}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="user-admin"
                  checked={userFormData.admin}
                  onChange={(e) => setUserFormData({...userFormData, admin: e.target.checked})}
                />
                <Label htmlFor="user-admin">
                  Usuário administrador
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmittingUser}>
                {isSubmittingUser 
                  ? "Salvando..." 
                  : editingUser 
                    ? "Atualizar" 
                    : "Criar"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}