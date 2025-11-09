import { apiClient } from '@/lib/apiClient';
import type {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from '@/types/api/template';

/**
 * Template service using enhanced apiClient
 * Endpoints point to Django backend (configured in env.ts)
 */

export const templateService = {
  /**
   * Get all templates
   */
  getAll: () => apiClient.get<Template[]>('/templates/'),

  /**
   * Get single template by ID
   */
  getById: (id: string) => apiClient.get<Template>(`/templates/${id}/`),

  /**
   * Create new template
   */
  create: (data: CreateTemplateRequest) =>
    apiClient.post<Template>('/templates/', data),

  /**
   * Update template (PATCH)
   */
  update: (id: string, data: UpdateTemplateRequest) =>
    apiClient.patch<Template>(`/templates/${id}/`, data),

  /**
   * Delete template
   */
  delete: (id: string) => apiClient.delete<void>(`/templates/${id}/`),
};

// Backward compatibility exports
export const getTemplates = templateService.getAll;
export const getTemplate = templateService.getById;
export const getTemplateById = templateService.getById;
export const createTemplate = templateService.create;
export const updateTemplate = templateService.update;
export const deleteTemplate = templateService.delete;
