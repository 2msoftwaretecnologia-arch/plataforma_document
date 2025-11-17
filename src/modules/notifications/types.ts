export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
}

export interface ToastOptions {
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, severity: ToastSeverity, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  hideToast: (id: string) => void;
}
