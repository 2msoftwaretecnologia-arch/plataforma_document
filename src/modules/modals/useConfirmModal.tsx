'use client';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useModal } from './useModal';
import { BaseModal } from './BaseModal';

export interface ConfirmModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'default';
}

interface ConfirmModalProps {
  isOpen: boolean;
  data?: ConfirmModalData | null;
  onClose: (confirmed?: boolean) => void;
}

function ConfirmModal({ isOpen, data, onClose }: ConfirmModalProps) {
  if (!data) return null;

  const {
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'default',
  } = data;

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
      confirmClass: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    default: {
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
      confirmClass: 'bg-primary hover:opacity-90 text-primary-foreground',
    },
  };

  const { icon, confirmClass } = variantStyles[variant];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      size="md"
      closeOnBackdrop={true}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">{icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>

        {/* Message */}
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 border-2 border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => onClose(true)}
            className={`px-6 py-2 rounded-lg transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

/**
 * Hook for confirmation dialogs with promise-based API.
 *
 * @example
 * ```tsx
 * const confirm = useConfirmModal();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm.open({
 *     title: 'Deletar Template?',
 *     message: 'Esta ação não pode ser desfeita.',
 *     confirmText: 'Deletar',
 *     variant: 'danger'
 *   });
 *
 *   if (confirmed) {
 *     await deleteTemplate();
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <confirm.Modal />
 *   </>
 * );
 * ```
 */
export function useConfirmModal() {
  return useModal<ConfirmModalData, boolean>(ConfirmModal);
}
