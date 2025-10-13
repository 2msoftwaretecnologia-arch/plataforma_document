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

## Status de Implementação

### ✅ Implementado

#### Componentes UI
- **Navegação Lateral (Sidebar)**
  - Sidebar recolhível com estados aberto/fechado
  - Destaque da página ativa
  - Efeitos de hover com background e sombra
  - Transições e animações suaves
  - Botão de toggle responsivo
  - Integração com ícones do Material-UI

#### Páginas
- **Dashboard** (`/`) - Página inicial com placeholder
- **Mapeamento** (`/mapeamento`) - Página de mapeamento (placeholder)
- **Criar Formulário** (`/criar-formulario`) - Página de criação de formulário (placeholder)
- **Histórico** (`/historico`) - Página de histórico (placeholder)
- **Plano** (`/plano`) - Página de planos/preços (placeholder)

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
