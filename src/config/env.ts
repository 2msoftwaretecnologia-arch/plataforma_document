/**
 * Environment configuration
 * Centralizes all environment variables for the application
 */

export const env = {
  /**
   * Base URL for the main API (Django backend)
   * Default: http://localhost:8000/api
   */
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',

  /**
   * Base URL for Next.js API routes (mock/auth)
   * Default: /api
   */
  NEXT_API_BASE_URL: process.env.NEXT_PUBLIC_NEXT_API_BASE_URL || '/api',
} as const;

/**
 * Check if we're running on the client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if we're in development mode
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProd = process.env.NODE_ENV === 'production';
