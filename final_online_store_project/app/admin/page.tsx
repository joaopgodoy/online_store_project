"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Plus, Package, Users, Shield, User, Upload, X } from "lucide-react"
import Image from "next/image"

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

interface User {
  _id: string
  name: string
  email: string
  apartment: string
  admin: boolean
  createdAt: string
}

const CATEGORIES = ["Alimentos e Bebidas", "Higiene e Cuidados", "Limpeza", "Farmácia e Bem-estar"]

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState({ products: true, users: true })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Form states
  const [productForm, setProductForm] = useState({
    open: false,
    data: { name: "", description: "", price: "", image: "", category: "", inStock: true, availableQuantity: "" },
    editing: null as Product | null,
    submitting: false
  })
  
  const [userForm, setUserForm] = useState({
    open: false,
    data: { name: "", email: "", apartment: "", admin: false, password: "" },
    editing: null as User | null,
    submitting: false
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchProducts(), fetchUsers()])
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Erro ao carregar produtos')
      
      const data = await response.json()
      const transformedData = data.map((product: any) => ({
        _id: product.id || product._id || "",
        name: product.name || "",
        description: product.descricao || product.description || "",
        price: Number(product.preco || product.price || 0),
        image: product.imagem || product.image || "",
        category: product.categoria || product.category || "",
        inStock: Boolean(product.disponivel ?? product.inStock ?? true),
        availableQuantity: Number(product.estoque || product.availableQuantity || 0),
        sold: Number(product.vendidos || product.sold || 0)
      }))
      
      setProducts(transformedData)
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os produtos", variant: "destructive" })
    } finally {
      setLoading(prev => ({ ...prev, products: false }))
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Erro ao carregar usuários')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os usuários", variant: "destructive" })
    } finally {
      setLoading(prev => ({ ...prev, users: false }))
    }
  }

  const resetProductForm = () => {
    setProductForm({
      open: false,
      data: { name: "", description: "", price: "", image: "", category: "", inStock: true, availableQuantity: "" },
      editing: null,
      submitting: false
    })
  }

  const resetUserForm = () => {
    setUserForm({
      open: false,
      data: { name: "", email: "", apartment: "", admin: false, password: "" },
      editing: null,
      submitting: false
    })
  }

  const openProductForm = (product?: Product) => {
    if (product) {
      setProductForm({
        open: true,
        editing: product,
        submitting: false,
        data: {
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          availableQuantity: product.availableQuantity.toString()
        }
      })
    } else {
      setProductForm(prev => ({ ...prev, open: true }))
    }
  }

  const openUserForm = (user?: User) => {
    if (user) {
      setUserForm({
        open: true,
        editing: user,
        submitting: false,
        data: {
          name: user.name,
          email: user.email,
          apartment: user.apartment,
          admin: user.admin,
          password: ""
        }
      })
    } else {
      setUserForm(prev => ({ ...prev, open: true }))
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, editing } = productForm

    if (!data.name || !data.description || !data.price || !data.category || !data.availableQuantity) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" })
      return
    }

    const price = parseFloat(data.price)
    const quantity = parseInt(data.availableQuantity)

    if (isNaN(price) || price < 0 || isNaN(quantity) || quantity < 0) {
      toast({ title: "Erro", description: "Preço e quantidade devem ser números válidos", variant: "destructive" })
      return
    }

    setProductForm(prev => ({ ...prev, submitting: true }))

    try {
      const productData = {
        name: data.name,
        description: data.description,
        price,
        image: data.image || "/placeholder.jpg?height=300&width=300",
        category: data.category,
        inStock: quantity > 0 ? data.inStock : false,
        availableQuantity: quantity
      }

      const url = editing ? `/api/products/${editing._id}` : '/api/products'
      const method = editing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar produto')
      }

      toast({
        title: "Sucesso",
        description: editing ? "Produto atualizado com sucesso" : "Produto criado com sucesso"
      })

      resetProductForm()
      fetchProducts()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar produto",
        variant: "destructive"
      })
    } finally {
      setProductForm(prev => ({ ...prev, submitting: false }))
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, editing } = userForm

    if (!data.name || !data.email || !data.apartment || (!editing && !data.password)) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" })
      return
    }

    setUserForm(prev => ({ ...prev, submitting: true }))

    try {
      const userData = {
        name: data.name,
        email: data.email,
        apartment: data.apartment,
        admin: data.admin,
        ...(data.password && { password: data.password })
      }

      const url = editing ? `/api/users/${editing._id}` : '/api/users'
      const method = editing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar usuário')
      }

      toast({
        title: "Sucesso",
        description: editing ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso"
      })

      resetUserForm()
      fetchUsers()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar usuário",
        variant: "destructive"
      })
    } finally {
      setUserForm(prev => ({ ...prev, submitting: false }))
    }
  }

  const handleDelete = async (type: 'product' | 'user', id: string) => {
    if (!confirm(`Tem certeza que deseja excluir este ${type === 'product' ? 'produto' : 'usuário'}?`)) return

    try {
      const response = await fetch(`/api/${type === 'product' ? 'products' : 'users'}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`Erro ao excluir ${type === 'product' ? 'produto' : 'usuário'}`)

      toast({ title: "Sucesso", description: `${type === 'product' ? 'Produto' : 'Usuário'} excluído com sucesso` })
      
      if (type === 'product') fetchProducts()
      else fetchUsers()
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível excluir o ${type === 'product' ? 'produto' : 'usuário'}`,
        variant: "destructive"
      })
    }
  }

  const LoadingSpinner = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2">{text}</span>
    </div>
  )

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer upload')
      }

      const data = await response.json()
      
      // Atualizar o campo de imagem no formulário
      setProductForm(prev => ({
        ...prev,
        data: { ...prev.data, image: data.url }
      }))

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!"
      })

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer upload da imagem",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = () => {
    setProductForm(prev => ({
      ...prev,
      data: { ...prev.data, image: "" }
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie produtos e usuários da loja</p>
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
        
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Gerenciar Produtos</h2>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos</p>
            </div>
            <Button onClick={() => openProductForm()}>
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
              <CardDescription>Lista de todos os produtos cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.products ? (
                <LoadingSpinner text="Carregando produtos..." />
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
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 border">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
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
                            <Button variant="outline" size="sm" onClick={() => openProductForm(product)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('product', product._id)}
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

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
              <p className="text-muted-foreground">Adicione, edite ou remova usuários</p>
            </div>
            <Button onClick={() => openUserForm()}>
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
              <CardDescription>Lista de todos os usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.users ? (
                <LoadingSpinner text="Carregando usuários..." />
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
                        <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openUserForm(user)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('user', user._id)}
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

      {/* Product Dialog */}
      <Dialog open={productForm.open} onOpenChange={(open) => !open && resetProductForm()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productForm.editing ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
            <DialogDescription>
              {productForm.editing ? "Faça as alterações necessárias no produto" : "Preencha os dados do novo produto"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nome do Produto *</Label>
                <Input
                  id="product-name"
                  value={productForm.data.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">Descrição *</Label>
                <Textarea
                  id="product-description"
                  value={productForm.data.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
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
                    value={productForm.data.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, data: { ...prev.data, price: e.target.value } }))}
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
                    value={productForm.data.availableQuantity}
                    onChange={(e) => {
                      const newQuantity = e.target.value
                      const quantity = parseInt(newQuantity)
                      setProductForm(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          availableQuantity: newQuantity,
                          inStock: quantity > 0 ? prev.data.inStock : false
                        }
                      }))
                    }}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-category">Categoria *</Label>
                <Select
                  value={productForm.data.category}
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, data: { ...prev.data, category: value } }))}
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

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Imagem do Produto</Label>
                
                {/* Current Image Preview */}
                {productForm.data.image && (
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={productForm.data.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0 shadow-md"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Upload Controls */}
                <div className="space-y-3">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 w-full"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? "Enviando..." : "Escolher Imagem"}
                  </Button>
                  
                  {!productForm.data.image && (
                    <div className="space-y-2">
                      <Label htmlFor="product-image-url" className="text-sm text-muted-foreground">
                        Ou insira uma URL da imagem
                      </Label>
                      <Input
                        id="product-image-url"
                        value={productForm.data.image}
                        onChange={(e) => setProductForm(prev => ({ ...prev, data: { ...prev.data, image: e.target.value } }))}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB. Recomendado: 300x300px
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="product-inStock"
                  checked={productForm.data.inStock}
                  disabled={parseInt(productForm.data.availableQuantity) === 0}
                  onChange={(e) => setProductForm(prev => ({ ...prev, data: { ...prev.data, inStock: e.target.checked } }))}
                />
                <Label htmlFor="product-inStock">Produto disponível</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => resetProductForm()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={productForm.submitting || uploadingImage}>
                {productForm.submitting ? "Salvando..." : productForm.editing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={userForm.open} onOpenChange={(open) => !open && resetUserForm()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{userForm.editing ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
            <DialogDescription>
              {userForm.editing ? "Faça as alterações necessárias no usuário" : "Preencha os dados do novo usuário"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUserSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome Completo *</Label>
                <Input
                  id="user-name"
                  value={userForm.data.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                  placeholder="Nome completo do usuário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.data.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, data: { ...prev.data, email: e.target.value } }))}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-apartment">Apartamento *</Label>
                <Input
                  id="user-apartment"
                  value={userForm.data.apartment}
                  onChange={(e) => setUserForm(prev => ({ ...prev, data: { ...prev.data, apartment: e.target.value } }))}
                  placeholder="Ex: 101, 202A, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-password">
                  {userForm.editing ? "Nova Senha (deixe vazio para manter atual)" : "Senha *"}
                </Label>
                <Input
                  id="user-password"
                  type="password"
                  value={userForm.data.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, data: { ...prev.data, password: e.target.value } }))}
                  placeholder="Digite a senha"
                  required={!userForm.editing}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="user-admin"
                  checked={userForm.data.admin}
                  onChange={(e) => setUserForm(prev => ({ ...prev, data: { ...prev.data, admin: e.target.checked } }))}
                />
                <Label htmlFor="user-admin">Usuário administrador</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => resetUserForm()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={userForm.submitting}>
                {userForm.submitting ? "Salvando..." : userForm.editing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}