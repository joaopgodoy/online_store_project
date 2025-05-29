# 🛒 Projeto: Mercado de Condomínio - Near Market

<img src="https://i.imgur.com/InlGHZg.png" width="300">

### Grupo:
- João Pedro Alves Notari Godoy – NUSP: 14582076  
- Ayrton da Costa Ganem Filho – NUSP: 14560190  
- Pedro Louro Fernandes – NUSP: 13672446  

---

## 📌 1. Requisitos

### Usuários:
- **Clientes**: compram produtos
- **Administradores**: gerenciam produtos, clientes e outros admins

### Requisitos principais:
- Login (cliente/admin)
- Cadastro de produtos (nome, id, foto, descrição, preço, estoque, vendidos)
- Cadastro de clientes e admins (nome, id, email, telefone, endereço)
- Carrinho de compras (cliente escolhe produto, quantidade, compra com cartão (qualquer número aceito))
- CRUD de produtos (admin)
- Funcionalidade específica: Código de segurança gerado para a retirada dos produtos presencialmente

---

## 📝 2. Descrição do Projeto

O projeto será uma Single-Page Application (SPA) desenvolvida usando HTML5, CSS3 e JavaScript. Na primeira fase, desenvolvemos **mockups estáticos** para planejar o visual e a navegação do sistema.

### Funcionalidades planejadas:
- Tela inicial com login
- Tela de listagem de produtos para clientes
- Telas individuais para cada categoria de produto (Farmácia, Alimentos, etc)
- Tela administrativa para cadastro de produtos
- Tela de carrinho com os produtos selecionados pelos clientes
- Tela de pagamento e checkout dos produtos
- Navegação SPA simulada entre as telas

### Informações salvas no servidor (futuramente):
- Usuários (admin e clientes)
- Produtos (detalhes e estoque)
- Pedidos realizados

---

## 🧭 3. Diagrama de Navegação

```mermaid
graph TD
  Home[Home]
  Alimentos[Alimentos e Bebidas]
  Higiene[Higiene e Cuidados Pessoais]
  Limpeza[Limpeza]
  Farmacia[Farmácia]
  Produto[Produto]
  Carrinho[Carrinho]
  Login[Login]
  Usuario[Usuário]
  Admin[Admin]
  Dashboard[Dashboard do Admin]
  PainelUsuarios[Painel de usuários]
  PainelProdutos[Painel de produtos]
  TodosProdutos[Todos os produtos]
  Checkout[Checkout]
  CodigoGerado[Código gerado]

  %% Ligações
  Home <--> Alimentos
  Home <--> Higiene
  Home <--> Limpeza
  Home <--> Farmacia
  Home <--> Carrinho
  Home <--> Login
  Home <--> TodosProdutos

  Alimentos <--> Produto
  Higiene <--> Produto
  Limpeza <--> Produto
  Farmacia <--> Produto

  Produto <--> Carrinho
  Produto <--> Login

  Login <--> Usuario
  Usuario <--> Carrinho
  TodosProdutos <--> Carrinho
  Carrinho <--> Checkout
  Checkout <--> CodigoGerado

  Login <--> Admin
  Admin <--> Dashboard

  Dashboard <--> PainelUsuarios
  Dashboard <--> PainelProdutos

  %% Links nos nós
  click Home "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/index.png" _blank
  click Carrinho "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/cart.png" _blank
  click Login "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/login.png" _blank
  click Alimentos "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/alimentos.jpeg" _blank
  click Higiene "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/higiene.jpeg" _blank
  click Limpeza "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/limpeza.jpeg" _blank
  click Farmacia "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/farmacia.jpeg" _blank
  click Produto "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/product.jpeg" _blank
  click Usuario "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/user.jpeg" _blank
  click PainelUsuarios "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/admin_dashboard_users.jpeg" _blank
  click PainelProdutos "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/admin_dashboard_products.jpeg" _blank
  click TodosProdutos "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/all_products.jpeg" _blank
  click Checkout "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/card.jpeg" _blank
  click CodigoGerado "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/code.jpeg" _blank
```

---

## 💬 4. Comentários sobre o código

Funcionamento completo. No momento, apenas procurando bugs pontuais que podem existir no código.
---

## 🧪 5. Testes

### 5.1 Testes de Cadastro e Login

Foram realizados **testes extensivos** do sistema de cadastro e autenticação:

- **Cadastro de usuários**: Testamos múltiplos cadastros preenchendo todos os campos obrigatórios (nome, email, apartamento, senha)
- **Validações de senha**: Confirmamos que o sistema respeita as restrições de segurança:
  - Mínimo de 8 caracteres
  - Pelo menos uma letra
  - Pelo menos um número  
  - Pelo menos um símbolo especial
- **Validação de email**: Sistema impede cadastros com emails duplicados
- **Login funcional**: Todos os usuários cadastrados conseguem fazer login com sucesso
- **Redirecionamento**: Usuários autenticados são redirecionados corretamente para suas páginas de perfil

### 5.2 Testes do Sistema de Carrinho

O sistema de carrinho foi **rigorosamente testado** com foco na segurança e usabilidade:

- **Restrição de acesso**: Usuários não logados são **automaticamente redirecionados** para a página de login ao tentar adicionar produtos
- **Apenas usuários autenticados** podem adicionar produtos ao carrinho
- **Testes de quantidade**: Realizamos múltiplos testes:
  - Adição de várias quantidades do mesmo produto
  - Adição de produtos diferentes simultaneamente
  - Aumento e diminuição de quantidades diretamente no carrinho
  - Remoção completa de produtos do carrinho
- **Validação de estoque**: Sistema impede adicionar quantidades superiores ao disponível
- **Checkout seguro**: Não é possível finalizar compras sem um cartão cadastrado no perfil

### 5.3 Testes da Página Administrativa

A interface administrativa foi **completamente validada**:

- **Gerenciamento de usuários**: 
  - Alteração de dados de usuários existentes
  - Exclusão de usuários do sistema
  - Promoção/rebaixamento de privilégios administrativos
- **Gerenciamento de produtos**:
  - Edição de informações (nome, descrição, preço)
  - Upload e alteração de imagens
  - Modificação de quantidades em estoque
  - Alteração de status de disponibilidade
  - Criação de novos produtos
  - Exclusão de produtos existentes

### 5.4 Testes da Funcionalidade Específica do Grupo

O **sistema de código de retirada** foi testado com sucesso:

- **Geração automática**: A cada compra finalizada, um código único é gerado
- **Apresentação clara**: O código é exibido ao usuário de forma destacada
- **Persistência**: Os códigos ficam salvos no histórico de pedidos do usuário
- **QR Code**: Sistema gera QR codes para facilitar a retirada presencial

### 5.5 Testes do Perfil de Usuário

A página de perfil foi **amplamente testada**:

- **Cadastro de cartões**: Sistema permite adicionar múltiplos cartões de pagamento
- **Validações de cartão**: 
  - Verificação de número do cartão (13-19 dígitos)
  - Validação de data de validade (formato MM/AA)
  - Verificação de CVC (mínimo 3 dígitos)
- **Histórico de pedidos**: Todos os pedidos realizados aparecem corretamente
- **Gerenciamento de cartões**: Usuários podem excluir cartões salvos
- **Confirmação de retirada**: Sistema permite confirmar quando pedidos foram retirados

---

## 🛠 6. Procedimentos de Build

### Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **MongoDB** (local ou MongoDB Atlas)

### Configuração do Ambiente

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd online_store_project/final_online_store_project
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**:
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```env
   MONGODB_URI=mongodb://localhost:27017/online_store
   # ou para MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/online_store
   
   JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
   NEXTAUTH_SECRET=seu_nextauth_secret_aqui
   NEXTAUTH_URL=http://localhost:3000
   ```

### Executando o Projeto

#### Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O servidor estará disponível em: `http://localhost:3000`

#### Modo de Produção

1. **Build do projeto**:
   ```bash
   npm run build
   # ou
   yarn build
   ```

2. **Iniciar servidor de produção**:
   ```bash
   npm start
   # ou
   yarn start
   ```

### Estrutura do Projeto

```
final_online_store_project/
├── app/                    # Páginas e rotas da aplicação
│   ├── admin/             # Painel administrativo
│   ├── api/               # API routes (backend)
│   ├── carrinho/          # Página do carrinho
│   ├── login/             # Página de login/cadastro
│   ├── perfil/            # Página de perfil do usuário
│   └── produtos/          # Páginas de produtos
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos React (Auth, Cart)
├── hooks/                 # Hooks customizados
├── lib/                   # Utilitários e configurações
├── models/                # Modelos do MongoDB
├── public/                # Arquivos estáticos
└── types/                 # Definições de tipos TypeScript
```

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linting do código
- `npm run type-check` - Verifica tipos TypeScript

### Primeiros Passos Após Instalação

1. **Acesse a aplicação** em `http://localhost:3000`

2. **Crie uma conta de administrador**:
   - Vá para `/login`
   - Cadastre um usuário
   - No banco de dados, altere o campo `admin` para `true`

3. **Adicione produtos**:
   - Faça login como admin
   - Acesse o painel administrativo
   - Cadastre produtos com imagens, preços e estoque

4. **Teste o sistema**:
   - Crie contas de usuários normais
   - Adicione produtos ao carrinho
   - Cadastre cartões de pagamento
   - Finalize compras

### Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Banco de Dados**: MongoDB com Mongoose
- **Autenticação**: JWT com bcryptjs
- **Upload de Imagens**: Sistema de upload local
- **UI Components**: Radix UI, Lucide Icons

### Deploy

Para deploy em produção, recomendamos:

1. **Vercel** (recomendado para Next.js):
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Docker** (opcional):
   ```dockerfile
   # Exemplo de Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

### Troubleshooting

**Erro de conexão com MongoDB**:
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env.local`

**Erro de dependências**:
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

**Erro de build**:
- Verifique se todas as variáveis de ambiente estão configuradas
- Execute `npm run type-check` para verificar erros de TypeScript
