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
  click Home "https://github.com/joaopgodoy/online_store_project/blob/main/mockups/index_01.png" _blank
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

Sem código funcional no momento — apenas HTML/CSS estáticos.

---

## 🧪 5. Plano de Testes

Pretendemos usar Postman para testar o backend futuramente.  
Na fase atual, apenas validamos visualmente os elementos HTML/CSS.

---

## ✅ 6. Resultados dos Testes

Sem testes automatizados até o momento.

---

## 🛠 7. Procedimentos de Build

Para visualizar o projeto localmente:

1. Baixe o projeto.
2. Abra o arquivo `index.html` no navegador.
3. Use os links de navegação nas páginas para acessar as abas (somente Login, Carrinho e Página Inicial possuem abas finalizados).

---

## ⚠️ 8. Problemas

Nenhum problema encontrado até agora.

---

## 💡 9. Comentários

Estamos abertos a sugestões para melhorar o layout, acessibilidade e usabilidade das interfaces.

---

## 🔗 HTMLs Feitos

- [`index.html`](index.html): Tela inicial da loja, com principais produtos
- [`login.html`](login.html): Tela de login do usuário
- [`cart.html`](cart.html): Tela de carrinho para ver produtos escolhidos e finalizar a compra
