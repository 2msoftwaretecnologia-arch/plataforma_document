# Gerenciamento de Recursos da API

## Visão Geral

Este projeto utiliza **TanStack Query (React Query)** para padronizar o gerenciamento de estado de recursos da API. Esta abordagem elimina 60-70% do código boilerplate relacionado a loading, erro e gerenciamento de dados.

## Arquitetura

```
Componente → Query Hook → Service → API Client → Backend
```

### Camadas

1. **API Client** (`src/lib/apiClient.ts`) - Wrapper genérico do fetch com auth JWT
2. **Service** (`src/services/*.ts`) - Define endpoints da API
3. **Query Hooks** (`src/hooks/queries/*.ts`) - Hooks reutilizáveis do TanStack Query
4. **Componentes** - Consomem hooks e renderizam UI

---

## Guia de Implementação

### 1. Criar um Service

**Arquivo:** `src/services/seuRecursoService.ts`

```typescript
import { apiClient } from '@/lib/apiClient';
import type { SeuRecurso, CreateRequest, UpdateRequest } from '@/types/api/seuRecurso';

export const seuRecursoService = {
  /**
   * Listar todos os recursos
   */
  getAll: () => apiClient.get<SeuRecurso[]>('/seu-recurso/'),

  /**
   * Buscar por ID
   */
  getById: (id: string) => apiClient.get<SeuRecurso>(`/seu-recurso/${id}/`),

  /**
   * Criar novo recurso
   */
  create: (data: CreateRequest) =>
    apiClient.post<SeuRecurso>('/seu-recurso/', data),

  /**
   * Atualizar recurso
   */
  update: (id: string, data: UpdateRequest) =>
    apiClient.patch<SeuRecurso>(`/seu-recurso/${id}/`, data),

  /**
   * Deletar recurso
   */
  delete: (id: string) => apiClient.delete<void>(`/seu-recurso/${id}/`),
};
```

**Características:**
- Métodos simples e declarativos
- Tipagem TypeScript completa
- Endpoints relativos (baseados em `env.API_BASE_URL`)

---

### 2. Criar Query Hooks

**Arquivo:** `src/hooks/queries/useSeuRecurso.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seuRecursoService } from '@/services/seuRecursoService';
import type { SeuRecurso, CreateRequest, UpdateRequest } from '@/types/api/seuRecurso';

/**
 * Query Keys - Organização hierárquica das chaves de cache
 */
export const seuRecursoKeys = {
  all: ['seu-recurso'] as const,
  lists: () => [...seuRecursoKeys.all, 'list'] as const,
  list: (filters?: string) => [...seuRecursoKeys.lists(), { filters }] as const,
  details: () => [...seuRecursoKeys.all, 'detail'] as const,
  detail: (id: string) => [...seuRecursoKeys.details(), id] as const,
};

/**
 * Hook para listar todos os recursos
 */
export function useSeuRecurso() {
  return useQuery({
    queryKey: seuRecursoKeys.lists(),
    queryFn: seuRecursoService.getAll,
  });
}

/**
 * Hook para buscar um recurso específico
 */
export function useSeuRecursoById(id: string | null) {
  return useQuery({
    queryKey: seuRecursoKeys.detail(id!),
    queryFn: () => seuRecursoService.getById(id!),
    enabled: !!id, // Só executa se ID existir
  });
}

/**
 * Hook para criar recurso
 */
export function useCreateSeuRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seuRecursoService.create,
    onSuccess: () => {
      // Invalida a lista para forçar refetch
      queryClient.invalidateQueries({ queryKey: seuRecursoKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar recurso
 */
export function useUpdateSeuRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequest }) =>
      seuRecursoService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida o item específico E a lista
      queryClient.invalidateQueries({ queryKey: seuRecursoKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: seuRecursoKeys.lists() });
    },
  });
}

/**
 * Hook para deletar recurso
 */
export function useDeleteSeuRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seuRecursoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seuRecursoKeys.lists() });
    },
  });
}
```

---

### 3. Usar nos Componentes

#### Exemplo: Página de Listagem

```typescript
'use client';

import { useSeuRecurso, useDeleteSeuRecurso } from '@/hooks/queries/useSeuRecurso';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import EmptyState from '@/components/shared/EmptyState';

export default function SeuRecursoPage() {
  // Query - busca dados automaticamente
  const { data: recursos, isLoading, error, refetch } = useSeuRecurso();

  // Mutation - ação manual
  const deleteMutation = useDeleteSeuRecurso();

  // Estados de UI padronizados
  if (isLoading) return <LoadingState message="Carregando recursos..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!recursos?.length) return <EmptyState title="Nenhum recurso encontrado" />;

  return (
    <div>
      {recursos.map(recurso => (
        <div key={recurso.id}>
          <h3>{recurso.nome}</h3>
          <button onClick={() => deleteMutation.mutate(recurso.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Exemplo: Formulário de Criação

```typescript
'use client';

import { useCreateSeuRecurso } from '@/hooks/queries/useSeuRecurso';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NovoRecursoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  const createMutation = useCreateSeuRecurso();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync(formData);
      // Após sucesso, lista já foi atualizada automaticamente!
      router.push('/seu-recurso');
    } catch (error) {
      console.error('Erro ao criar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.nome}
        onChange={e => setFormData({ ...formData, nome: e.target.value })}
      />
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Criando...' : 'Criar'}
      </button>
    </form>
  );
}
```

#### Exemplo: Página de Edição

```typescript
'use client';

import { useSeuRecursoById, useUpdateSeuRecurso } from '@/hooks/queries/useSeuRecurso';
import LoadingState from '@/components/shared/LoadingState';
import { useRouter, useParams } from 'next/navigation';

export default function EditarRecursoPage() {
  const router = useRouter();
  const { id } = useParams();

  // Busca dados do recurso
  const { data: recurso, isLoading } = useSeuRecursoById(id as string);
  const updateMutation = useUpdateSeuRecurso();

  const handleSave = async (data: UpdateRequest) => {
    await updateMutation.mutateAsync({ id: recurso!.id, data });
    router.push('/seu-recurso');
  };

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <h1>Editar: {recurso?.nome}</h1>
      {/* Seu formulário aqui */}
    </div>
  );
}
```

---

## Conceitos Importantes

### Queries vs Mutations

| Aspecto | Query (useQuery) | Mutation (useMutation) |
|---------|------------------|------------------------|
| **Propósito** | Buscar dados (GET) | Modificar dados (POST/PATCH/DELETE) |
| **Execução** | Automática ao montar | Manual via `.mutate()` ou `.mutateAsync()` |
| **Cache** | Sim, armazena resultado | Não |
| **Retorno** | `{ data, isLoading, error }` | `{ mutate, isPending, isError }` |

### Query Keys

Query keys são identificadores únicos para cada consulta. Organize hierarquicamente:

```typescript
{
  all: ['recursos'],                    // Base
  lists: ['recursos', 'list'],          // Listas
  list: ['recursos', 'list', { page: 1 }], // Lista filtrada
  details: ['recursos', 'detail'],      // Detalhes
  detail: ['recursos', 'detail', '123'] // Detalhe específico
}
```

**Por que importa:**
- Controle granular de invalidação de cache
- Evita refetches desnecessários
- Permite prefetching estratégico

### Cache Invalidation

```typescript
// Invalida TODA a hierarquia de listas
queryClient.invalidateQueries({ queryKey: ['recursos', 'list'] });

// Invalida apenas um item específico
queryClient.invalidateQueries({ queryKey: ['recursos', 'detail', '123'] });

// Invalida TUDO relacionado a recursos
queryClient.invalidateQueries({ queryKey: ['recursos'] });
```

**Quando invalidar:**
- **Create:** Invalide `lists()` - nova lista com item adicionado
- **Update:** Invalide `detail(id)` + `lists()` - item modificado reflete em ambos
- **Delete:** Invalide `lists()` - lista sem o item deletado

---

## Configuração Global

Configurações padrão em `src/providers/QueryProvider.tsx`:

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,        // Dados "frescos" por 1 minuto
    gcTime: 5 * 60 * 1000,        // Cache mantido por 5 minutos
    retry: 1,                     // Tenta 1 vez em caso de erro
    refetchOnWindowFocus: false,  // Não refetch ao focar janela
  },
  mutations: {
    retry: 0,                     // Não retry mutations
  },
}
```

### Quando customizar por query

```typescript
export function useSeuRecursoById(id: string) {
  return useQuery({
    queryKey: seuRecursoKeys.detail(id),
    queryFn: () => seuRecursoService.getById(id),
    staleTime: 5 * 60 * 1000, // Customizar: dados frescos por 5 minutos
    gcTime: 10 * 60 * 1000,   // Cache por 10 minutos
  });
}
```

---

## Componentes Compartilhados

Use os componentes padronizados para estados de UI:

### LoadingState
```typescript
import LoadingState from '@/components/shared/LoadingState';

<LoadingState message="Carregando dados..." />
```

### ErrorState
```typescript
import ErrorState from '@/components/shared/ErrorState';

<ErrorState
  error={error}
  onRetry={refetch}
  title="Falha ao carregar"
/>
```

### EmptyState
```typescript
import EmptyState from '@/components/shared/EmptyState';

<EmptyState
  title="Nenhum item encontrado"
  message="Crie seu primeiro item para começar"
  action={<button>Criar Novo</button>}
/>
```

---

## API Client

### Métodos Disponíveis

```typescript
import { apiClient } from '@/lib/apiClient';

// GET
apiClient.get<ResponseType>('/endpoint')

// POST
apiClient.post<ResponseType>('/endpoint', { data })

// PATCH
apiClient.patch<ResponseType>('/endpoint', { data })

// PUT
apiClient.put<ResponseType>('/endpoint', { data })

// DELETE
apiClient.delete<void>('/endpoint')
```

### Características

- **Auto-autenticação:** Adiciona header `Authorization: Bearer {token}` automaticamente
- **Unwrapping:** Extrai `data.data` de respostas do Django REST Framework
- **Tipagem:** Suporte completo a TypeScript
- **Error handling:** Lança erros com mensagens consistentes

---

## Debugging

### React Query DevTools

Em desenvolvimento, pressione o ícone do React Query no canto inferior da tela para:
- Ver todas as queries ativas
- Inspecionar cache
- Forçar refetch manual
- Ver query keys e estados

### Console Logs

```typescript
const { data, isLoading, error } = useSeuRecurso();

console.log('Dados:', data);
console.log('Carregando:', isLoading);
console.log('Erro:', error);
```

---

## Boas Práticas

### ✅ Fazer

- Sempre definir query keys hierárquicas
- Invalidar caches após mutations
- Usar componentes compartilhados para estados
- Tipar todas as respostas da API
- Desabilitar queries condicionalmente (`enabled: !!id`)

### ❌ Evitar

- Gerenciar loading/error manualmente com useState
- Chamar APIs diretamente nos componentes
- Usar `refetch()` ao invés de invalidar cache
- Duplicar lógica de fetching entre componentes
- Esquecer de invalidar cache em mutations

---

## Exemplo Completo: Template

Para um exemplo completo e funcional, veja:

- **Service:** `src/services/templateService.ts`
- **Hooks:** `src/hooks/queries/useTemplates.ts`
- **Página de Lista:** `src/app/templates/page.tsx`
- **Página de Edição:** `src/app/criar-formulario/page.tsx`

---

## Troubleshooting

### Dados não atualizam após mutation

**Problema:** Esqueceu de invalidar o cache

**Solução:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: seuRecursoKeys.lists() });
}
```

### Query executa quando não deveria

**Problema:** Query não está desabilitada corretamente

**Solução:**
```typescript
useQuery({
  queryKey: seuRecursoKeys.detail(id!),
  queryFn: () => seuRecursoService.getById(id!),
  enabled: !!id, // Adicione esta linha
});
```

### Erro de autenticação 401

**Problema:** Token JWT não está no localStorage ou expirou

**Solução:** Verifique AuthContext e localStorage

---

## Recursos Adicionais

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

---

**Última atualização:** 2025-11-09
**Versão TanStack Query:** 5.x
