# Plataforma Document

Uma plataforma moderna de gerenciamento de documentos construída com Next.js 15, React 19 e Tailwind CSS v4.

## Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
- [Status de Implementação](#status-de-implementação)
- [Scripts Disponíveis](#scripts-disponíveis)

## Visão Geral

Plataforma Document é um sistema de gerenciamento de documentos projetado para ajudar usuários a criar, organizar e rastrear formulários e documentos. A plataforma possui uma interface moderna e responsiva com navegação lateral recolhível.

## Stack Tecnológica

### Framework Principal
- **Next.js 15.5.4** - Framework React com App Router
- **React 19.1.0** - Biblioteca para construção de interfaces
- **TypeScript 5** - JavaScript com tipagem estática

### Estilização
- **Tailwind CSS v4** - Framework CSS utilitário (nova versão com configuração via CSS)
- **@tailwindcss/postcss** - Integração com PostCSS
- **Material-UI (MUI) 7.3.4** - Biblioteca de componentes e ícones
  - `@mui/material` - Componentes principais do Material UI
  - `@mui/icons-material` - Ícones do Material Design
  - `@emotion/react` & `@emotion/styled` - Estilização CSS-in-JS (requerido pelo MUI)

### Qualidade de Código
- **ESLint 9** - Linter com integração Next.js e Prettier
- **Prettier 3.6.2** - Formatação automática de código com ordenação de classes Tailwind
- **TypeScript** - Verificação estática de tipos

## Como Executar

### Pré-requisitos

- Node.js 20+ (recomendado)
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd plataforma_document
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Estrutura do Projeto

```
plataforma_document/
├── src/
│   ├── app/                      # Páginas do Next.js App Router
│   │   ├── layout.tsx           # Layout raiz com sidebar
│   │   ├── page.tsx             # Página Dashboard/Home
│   │   ├── globals.css          # Estilos globais e config do Tailwind
│   │   ├── mapeamento/          # Página de mapeamento
│   │   ├── criar-formulario/    # Página de criação de formulário
│   │   ├── historico/           # Página de histórico
│   │   └── plano/               # Página de planos
│   └── components/
│       ├── home.tsx             # Componente Home
│       └── sidebar/
│           ├── Sidebar.tsx      # Navegação lateral principal
│           └── SidebarItem.tsx  # Item individual do menu lateral
├── public/                       # Arquivos estáticos
├── .prettierrc                  # Configuração do Prettier
├── eslint.config.mjs            # Configuração do ESLint
├── next.config.ts               # Configuração do Next.js
├── postcss.config.mjs           # Configuração do PostCSS
├── tsconfig.json                # Configuração do TypeScript
└── package.json                 # Dependências do projeto
```

## Ferramentas de Desenvolvimento

### Tailwind CSS v4

Framework CSS utilitário que permite estilizar componentes usando classes prontas diretamente no JSX/TSX. Utilizamos a versão 4, que possui configuração baseada em CSS (sem arquivo `tailwind.config.js`). A personalização do tema é feita no arquivo `src/app/globals.css`.

**Por que usamos:**
- Desenvolvimento rápido com classes utilitárias
- Design consistente e responsivo
- Fácil manutenção e customização via variáveis CSS

### ESLint

Ferramenta de análise estática de código que identifica problemas, padrões inconsistentes e possíveis bugs no código JavaScript/TypeScript.

**Por que usamos:**
- Mantém consistência no código do projeto
- Detecta erros antes da execução
- Integração com Next.js e Prettier para evitar conflitos

**Comandos:**
```bash
npm run lint        # Verificar problemas
npm run lint:fix    # Corrigir automaticamente
```

### Prettier

Formatador de código automático que garante estilo consistente em todo o projeto.

**Por que usamos:**
- Formatação automática e consistente
- Elimina discussões sobre estilo de código
- Ordena classes Tailwind automaticamente para melhor legibilidade

**Comando:**
```bash
npm run format      # Formatar todos os arquivos
```

### TypeScript

JavaScript com tipagem estática que adiciona verificação de tipos durante o desenvolvimento.

**Por que usamos:**
- Detecta erros em tempo de desenvolvimento
- Melhor autocomplete e IntelliSense
- Código mais seguro e documentado
- Refatoração mais confiável

## Sistema de Temas

A aplicação possui um sistema de temas claro/escuro integrado com Tailwind CSS e Material-UI.

### Variáveis CSS Disponíveis

```css
/* Cores principais */
--background          /* Fundo principal da aplicação */
--foreground          /* Cor principal do texto */
--border              /* Cor das bordas */

/* Cores de destaque */
--primary             /* Cor primária (botões, links) */
--primary-foreground  /* Texto sobre cor primária */

/* Cores secundárias */
--secondary           /* Cor secundária (backgrounds alternativos) */
--secondary-foreground /* Texto sobre cor secundária */

/* Cores discretas */
--muted               /* Fundo discreto/suave */
--muted-foreground    /* Texto discreto/secundário */
```

### Como Usar com Tailwind

**Classes personalizadas (recomendado):**
```jsx
<div className="bg-background text-foreground border-border">
  <h1 className="text-foreground">Título</h1>
  <p className="text-muted-foreground">Descrição</p>
  <button className="bg-primary text-primary-foreground">Ação</button>
</div>
```

**Classes com prefixo dark: (para controle fino):**
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Conteúdo que muda entre light/dark
</div>
```

### Alternador de Tema

O alternador está disponível na sidebar (ícone de sol/lua). O tema escolhido é salvo no `localStorage` e persiste entre sessões.

## Autenticação

Sistema de autenticação JWT com rotas protegidas e API server-side.

### Credenciais de Teste

- **Email:** `admin@example.com`
- **Password:** `password123`

### Funcionalidades

- Login com validação de formulário (React Hook Form + Zod)
- Alternador de visibilidade de senha
- Rotas protegidas com redirecionamento automático
- Persistência de sessão via localStorage
- Logout com limpeza de dados
- Validação de token via servidor

### API Routes (Provisórias)

> ⚠️ **Nota**: As API routes atuais são **provisórias** e servem apenas para **simular** um backend real durante o desenvolvimento. Elas usam dados mockados e devem ser substituídas por uma API real em produção.

#### Arquitetura Atual

```
Client (AuthContext) → API Client → Next.js API Routes → Mock Database
```

#### Endpoints Disponíveis

**POST `/api/auth/login`**
- Autentica usuário com email e senha
- Retorna JWT token e dados do usuário
- Status: 200 (sucesso) | 401 (credenciais inválidas)

```typescript
// Request
{
  "email": "admin@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

**POST `/api/auth/validate`**
- Valida token JWT
- Retorna dados do usuário se token válido
- Status: 200 (válido) | 401 (inválido/expirado)

```typescript
// Request
{
  "token": "eyJhbGc..."
}

// Response
{
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### Estrutura de Arquivos

```
src/
├── app/api/auth/          # API Routes (server-side) - PROVISÓRIAS
│   ├── login/route.ts     # Endpoint de login
│   └── validate/route.ts  # Endpoint de validação de token
├── lib/
│   └── apiClient.ts       # Client-side API helper
├── contexts/
│   └── AuthContext.tsx    # Gerenciamento de estado de autenticação
└── types/
    └── auth.ts            # Tipos TypeScript
```

### Migração Futura

Para conectar a uma API real em produção:

1. Atualizar URLs em `src/lib/apiClient.ts` para apontar para API externa
2. Remover pasta `src/app/api/auth/` (mock routes)
3. Ajustar tipos de resposta se necessário
4. Configurar CORS e autenticação adequados

## Status de Implementação

### ✅ Implementado

#### Autenticação
- Sistema completo de autenticação JWT
- Página de login com validação (React Hook Form + Zod)
- API Routes server-side para login e validação (provisórias/mock)
- Rotas protegidas com redirecionamento automático
- Gerenciamento de sessão com persistência
- Arquitetura client-server preparada para migração

#### Temas
- Alternador light/dark mode
- Persistência de tema
- Integração Tailwind + Material-UI
- Transições suaves entre temas

#### Componentes UI
- **Navegação Lateral (Sidebar)**
  - Sidebar recolhível
  - Alternador de tema integrado
  - Informações do usuário logado
  - Botão de logout funcional
  - Destaque da página ativa
  - Integração com ícones do Material-UI

#### Páginas
- **Login** (`/login/loginpage`) - Autenticação com formulário validado
- **Dashboard** (`/`) - Página inicial (placeholder)
- **Mapeamento** (`/mapeamento`) - Placeholder
- **Criar Formulário** (`/criar-formulario`) - Placeholder
- **Histórico** (`/historico`) - Placeholder
- **Plano** (`/plano`) - Placeholder

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento em http://localhost:3000 |
| `npm run build` | Cria a build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint para verificar problemas no código |
| `npm run lint:fix` | Executa o ESLint e corrige problemas automaticamente |
| `npm run format` | Formata o código com Prettier |

## Boas Práticas

### Estilo de Código
- Use TypeScript para todos os novos arquivos
- Siga as regras do ESLint e Prettier
- Use componentes funcionais com hooks
- Prefira named exports para componentes
- Mantenha componentes pequenos e focados

### Estilização
- Use classes utilitárias do Tailwind para estilização
- Use `clsx` para classes condicionais
- Aproveite variáveis CSS para temas
- Siga o design mobile-first (responsivo)

### Workflow Git
- Escreva mensagens de commit claras e descritivas
- Mantenha commits focados e atômicos
- Use branches de feature para novos desenvolvimentos

## Saiba Mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React](https://react.dev)
- [Documentação do Tailwind CSS v4](https://tailwindcss.com/docs)
- [Documentação do Material-UI](https://mui.com/material-ui/)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)

## Licença

Este projeto é privado e proprietário.
