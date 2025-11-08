import { env } from '@/config/env';
import type {
  Template,
  TemplatesResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from '@/types/api/template';

/**
 * Template service for Django API
 */

const TEMPLATES_BASE = `${env.API_BASE_URL}/templates`;

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add JWT token if available (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Get all templates
 */
export async function getTemplates(): Promise<Template[]> {
  const response = await fetch(`${TEMPLATES_BASE}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to fetch templates',
    }));
    throw new Error(error.message || 'Failed to fetch templates');
  }

  const data: TemplatesResponse = await response.json();
  return data.data;
}

/**
 * Get single template by ID
 */
export async function getTemplate(id: string): Promise<Template> {
  const response = await fetch(`${TEMPLATES_BASE}/${id}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to fetch template',
    }));
    throw new Error(error.message || 'Failed to fetch template');
  }

  const data = await response.json();
  console.log('API Response for getTemplate:', data);

  // Check if response is wrapped in a data field (like getTemplates)
  return data.data || data;
}

/**
 * Alias for getTemplate (for consistency)
 */
export const getTemplateById = getTemplate;

/**
 * Create new template
 */
export async function createTemplate(
  data: CreateTemplateRequest,
): Promise<Template> {
  const response = await fetch(`${TEMPLATES_BASE}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to create template',
    }));
    throw new Error(error.message || 'Failed to create template');
  }

  return response.json();
}

/**
 * Update template
 */
export async function updateTemplate(
  id: string,
  data: UpdateTemplateRequest,
): Promise<Template> {
  const response = await fetch(`${TEMPLATES_BASE}/${id}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to update template',
    }));
    throw new Error(error.message || 'Failed to update template');
  }

  return response.json();
}

/**
 * Delete template
 */
export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`${TEMPLATES_BASE}/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to delete template',
    }));
    throw new Error(error.message || 'Failed to delete template');
  }
}
