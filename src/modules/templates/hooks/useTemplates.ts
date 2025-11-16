import { templateService } from '@/modules/templates/service';
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest
} from '@/modules/templates/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Query keys for templates
 * Follows TanStack Query best practices for key organization
 */
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: string) => [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

/**
 * Hook to fetch all templates
 */
export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: templateService.getAll,
  });
}

/**
 * Hook to fetch a single template by ID
 * @param id - Template ID (can be null to disable the query)
 */
export function useTemplate(id: string | null | undefined) {
  return useQuery({
    queryKey: templateKeys.detail(id!),
    queryFn: () => templateService.getById(id!),
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to create a new template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateService.create(data),
    onSuccess: () => {
      // Invalidate and refetch templates list
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateRequest }) =>
      templateService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific template and the list
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

/**
 * Hook to delete a template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templateService.delete(id),
    onSuccess: () => {
      // Invalidate templates list after deletion
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
