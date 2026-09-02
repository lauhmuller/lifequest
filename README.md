# LifeQuest — Guia de configuração (Etapa 2)

Este é o começo do seu app: login, cadastro, dashboard com XP e tarefas diárias,
registro de peso com gráfico, e troca de tema. Tudo já sincroniza de verdade entre
dispositivos, porque usa Supabase (banco de dados na nuvem) em vez do navegador.

Siga os passos na ordem. Não precisa entender o código para conseguir usar o app.

## Passo 1 — Criar sua conta gratuita no Supabase

1. Acesse **supabase.com** e clique em "Start your project".
2. Crie uma conta (pode ser com o Google).
3. Clique em "New project". Escolha um nome (ex.: `lifequest`) e uma senha para o
   banco de dados (guarde essa senha em local seguro).
4. Aguarde 1-2 minutos enquanto o projeto é criado.

## Passo 2 — Criar as tabelas do banco de dados

1. No painel do seu projeto Supabase, no menu lateral, clique em **SQL Editor**.
2. Clique em "New query".
3. Abra o arquivo `supabase/schema.sql` (está nesta mesma pasta que você recebeu),
   copie todo o conteúdo e cole no editor.
4. Clique em **Run**. Deve aparecer "Success. No rows returned".

Isso cria todas as tabelas, a segurança (cada pessoa só vê os próprios dados) e o
sistema que calcula XP e nível automaticamente.

## Passo 3 — Pegar suas chaves de conexão

1. No painel do Supabase, vá em **Project Settings → API**.
2. Copie o valor de **Project URL**.
3. Copie o valor de **anon public** (uma chave longa).

## Passo 4 — Configurar o projeto

1. Nesta pasta do projeto, duplique o arquivo `.env.example` e renomeie a cópia
   para `.env`.
2. Abra o `.env` e cole os valores que você copiou:

```
VITE_SUPABASE_URL=https://seuprojeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## Passo 5 — Rodar no seu computador (para testar)

Você vai precisar do **Node.js** instalado (baixe em nodejs.org, versão LTS).
Depois, abra um terminal dentro desta pasta e rode:

```
npm install
npm run dev
```

Isso abre o site em `http://localhost:5173`. Crie sua conta pela tela de cadastro
(vai chegar um e-mail de confirmação do Supabase).

## Passo 6 — Colocar no ar de verdade (para acessar do celular também)

O jeito mais simples e gratuito é o **Vercel**:

1. Crie uma conta em **vercel.com** (pode ser com GitHub).
2. Suba esta pasta do projeto para um repositório no GitHub (o Vercel tem um
   passo a passo visual para isso, ou você pode arrastar a pasta se preferir usar
   o "Vercel CLI" — posso te ajudar com isso quando chegarmos lá).
3. No Vercel, clique em "New Project", escolha o repositório, e nos campos de
   **Environment Variables** cole as mesmas duas variáveis do seu `.env`.
4. Clique em "Deploy". Em cerca de 1 minuto você recebe um link (ex.:
   `lifequest.vercel.app`) que funciona tanto no computador quanto no celular.
5. No celular, abra esse link pelo navegador e use "Adicionar à tela inicial" —
   ele vai se comportar como um app instalado.

## O que já funciona nesta etapa

- Cadastro, login, logout e recuperação de senha (de verdade, via Supabase Auth)
- Dashboard com nível, XP, moedas e streak
- Cadastro de tarefas diárias e checklist que **grava XP de verdade** no banco
- Sincronização em tempo real: marque uma tarefa no celular e ela aparece marcada
  no computador sem precisar recarregar a página
- Registro de peso com gráfico de evolução real
- 7 temas de cor (Coquette Rosa, Rosa Pastel, Lilás, Dark, Minimalista, Sage
  Green, Azul), salvos por conta

## O que ainda falta (próximas etapas, como combinamos)

- Etapa 3: Saúde (checklists por categoria, metas semanais/mensais), Autocuidado,
  Conhecimento, IMC e medidas corporais, upload de fotos de evolução
- Etapa 4: Calendário, Conquistas, Loja de recompensas funcionando de verdade
- Etapa 5: Estatísticas com filtros, mascote virtual, missões especiais

Qualquer erro que aparecer ao seguir os passos, me mande a mensagem exata que eu
te ajudo a resolver.
