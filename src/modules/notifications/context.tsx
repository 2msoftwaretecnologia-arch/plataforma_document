'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Toast, ToastContextValue, ToastSeverity, ToastOptions } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 6000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, severity: ToastSeverity, options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const duration = options?.duration ?? DEFAULT_DURATION;

      const newToast: Toast = {
        id,
        message,
        severity,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'success', options);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'error', options);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'warning', options);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'info', options);
    },
    [showToast]
  );

  const value: ToastContextValue = {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    hideToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}
