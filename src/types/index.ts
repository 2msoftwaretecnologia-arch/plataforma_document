/**
 * Central type exports
 * Barrel file for easy imports
 *
 * Usage:
 * import { Template, User, LoginCredentials } from '@/types';
 * import type { Template } from '@/types/api/template'; // Specific import
 */

// ==================== API TYPES ====================
// Types matching Django backend API responses/requests

export * from './api/auth';
export * from './api/template';

// ==================== UI TYPES ====================
// Frontend-specific types (forms, components, etc.)

export * from './ui/form';

// ==================== DOMAIN TYPES ====================
// Business logic types - to be added as needed
export * from './domain/document';
