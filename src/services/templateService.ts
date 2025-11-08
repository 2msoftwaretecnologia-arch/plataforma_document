import { env } from '@/config/env';
import type {
  Template,
  TemplatesResponse,
  CreateTemplateRequest,
} from '@/types/api/template';

/**
 * Template service for Django API
 */

const TEMPLATES_BASE = `${env.API_BASE_URL}/templates`;

/**
 * Get all templates
 */
export async function getTemplates(): Promise<Template[]> {
  const response = await fetch(`${TEMPLATES_BASE}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to fetch template',
    }));
    throw new Error(error.message || 'Failed to fetch template');
  }

  return response.json();
}

/**
 * Create new template
 */
export async function createTemplate(
  data: CreateTemplateRequest,
): Promise<Template> {
  const response = await fetch(`${TEMPLATES_BASE}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  data: Partial<CreateTemplateRequest>,
): Promise<Template> {
  const response = await fetch(`${TEMPLATES_BASE}/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
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
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to delete template',
    }));
    throw new Error(error.message || 'Failed to delete template');
  }
}
