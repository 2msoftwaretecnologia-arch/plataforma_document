'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Base modal component with consistent styling and behavior.
 *
 * @example
 * ```tsx
 * <BaseModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Edit User"
 *   size="md"
 * >
 *   <form>...</form>
 * </BaseModal>
 * ```
 */
export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: BaseModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative bg-background border-2 border-border rounded-xl shadow-2xl w-full ${sizeClasses[size]} mx-4 z-10 animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="modal-title" className="text-2xl font-bold text-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-3 justify-end p-6 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
