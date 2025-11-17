'use client';

import { CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useModal } from './useModal';
import { BaseModal } from './BaseModal';

export interface AlertModalData {
  title: string;
  message: string;
  variant?: 'success' | 'info' | 'warning';
  confirmText?: string;
}

interface AlertModalProps {
  isOpen: boolean;
  data?: AlertModalData | null;
  onClose: () => void;
}

function AlertModal({ isOpen, data, onClose }: AlertModalProps) {
  if (!data) return null;

  const { title, message, variant = 'info', confirmText = 'Ok' } = data;

  const variantStyles = {
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
      buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
  };

  const { icon, buttonClass } = variantStyles[variant];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
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

        {/* Action */}
        <button
          onClick={onClose}
          className={`px-8 py-2 rounded-lg transition-colors ${buttonClass}`}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
}

/**
 * Hook for alert/info modals with promise-based API.
 *
 * @example
 * ```tsx
 * const alert = useAlertModal();
 *
 * const handleSave = async () => {
 *   await saveData();
 *
 *   await alert.open({
 *     title: 'Sucesso!',
 *     message: 'Template salvo com sucesso.',
 *     variant: 'success'
 *   });
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleSave}>Save</button>
 *     <alert.Modal />
 *   </>
 * );
 * ```
 */
export function useAlertModal() {
  return useModal<AlertModalData, void>(AlertModal);
}
