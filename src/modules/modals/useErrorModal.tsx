'use client';

import { XCircle } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { useModal } from './useModal';

export interface ErrorModalData {
  title?: string;
  message: string;
  error?: Error | unknown;
  showDetails?: boolean;
  confirmText?: string;
}

interface ErrorModalProps {
  isOpen: boolean;
  data?: ErrorModalData | null;
  onClose: () => void;
}

function ErrorModal({ isOpen, data, onClose }: ErrorModalProps) {
  if (!data) return null;

  const title: string = data.title ?? 'Erro';
  const message: string = data.message;
  const error = data.error;
  const showDetails: boolean = data.showDetails ?? false;
  const confirmText: string = data.confirmText ?? 'Fechar';

  const errorDetails =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error) ?? 'Erro desconhecido';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnBackdrop={true}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* @ts-ignore - TypeScript incorrectly infers title as unknown despite explicit string type */}
        <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>

        <p className="text-muted-foreground mb-4">{message}</p>

        {/* Error Details */}
        {showDetails && error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 dark:text-red-200 break-words">
              {errorDetails}
            </p>
          </div>
        )}

        {/* Action */}
        <button
          onClick={onClose}
          className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
}

/**
 * Hook for error display modals with promise-based API.
 *
 * @example
 * ```tsx
 * const errorModal = useErrorModal();
 *
 * const handleAction = async () => {
 *   try {
 *     await riskyOperation();
 *   } catch (error) {
 *     await errorModal.open({
 *       title: 'Erro ao salvar',
 *       message: 'Não foi possível salvar o template.',
 *       error,
 *       showDetails: true
 *     });
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleAction}>Execute</button>
 *     <errorModal.Modal />
 *   </>
 * );
 * ```
 */
export function useErrorModal() {
  return useModal<ErrorModalData, void>(ErrorModal);
}
