# Yellow Duck TCG — Controle de Estoque

Sistema web de controle de estoque para a loja Yellow Duck TCG (cards Pokémon).

Stack: React + Vite + Tailwind CSS, Supabase (banco de dados, auth e storage), deploy na Vercel.

## 1. Rodar localmente

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha com as credenciais do seu projeto Supabase (veja abaixo).

## 2. Configurar o Supabase

1. Crie um projeto em https://supabase.com.
2. Em **Project Settings > API**, copie a **Project URL** e a **anon public key** para `.env.local`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Em **SQL Editor**, rode o script [`supabase/schema.sql`](supabase/schema.sql) inteiro. Ele cria:
   - tabela `products` (estoque)
   - tabela `stock_movements` (histórico de saídas)
   - RLS liberando acesso completo para qualquer usuário autenticado (o estoque é compartilhado entre os 2 usuários, sem isolamento por dono)
   - bucket público `product-photos` no Storage, com policies de leitura pública e escrita autenticada

4. **Criar os 2 usuários autorizados** (a loja não deve ter cadastro público):
   - Vá em **Authentication > Users > Add user** e crie manualmente o e-mail/senha de cada um dos 2 usuários.
   - Em **Authentication > Providers > Email**, desative "Allow new users to sign up" para garantir que ninguém mais consiga se cadastrar sozinho.

## 3. Sincronização entre computadores

Os dados ficam no Supabase (nuvem), então qualquer PC ou celular que rodar o app com as mesmas variáveis de ambiente e logar com um dos 2 usuários vê o mesmo estoque em tempo real.

## 4. Deploy na Vercel

1. Suba o projeto para o GitHub (veja abaixo).
2. Na Vercel, importe o repositório.
3. Configure as environment variables `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no projeto da Vercel (Settings > Environment Variables).
4. Deploy. O mesmo link funciona em qualquer dispositivo (inclusive celular, é mobile-friendly).

## 5. Subir para o GitHub e clonar no outro PC

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create yellow-duck-tcg --private --source=. --remote=origin --push
```

No outro computador:

```bash
git clone <url-do-repo>
cd yellow_duck_tcg
npm install
# criar .env.local com as mesmas credenciais do Supabase
npm run dev
```

## Estrutura

```
src/
  components/   # Layout, ProtectedRoute, ProductForm, StockOutModal, Modal
  context/      # AuthContext (Supabase Auth)
  hooks/        # useProducts (CRUD + registro de saída)
  lib/          # supabase client, constantes, formatação
  pages/        # Login, Dashboard, Products
supabase/
  schema.sql    # schema completo do banco (rodar no SQL Editor)
```
