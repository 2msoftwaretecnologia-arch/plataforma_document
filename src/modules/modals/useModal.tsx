'use client';

import { ComponentType, useMemo } from 'react';
import { useModalState, UseModalStateReturn } from './useModalState';

export interface ModalComponentProps<TInput, TOutput> {
  isOpen: boolean;
  data?: TInput | null;
  onClose: (result?: TOutput) => void;
}

export interface UseModalReturn<TInput, TOutput> {
  Modal: ComponentType<Partial<ModalComponentProps<TInput, TOutput>>>;
  open: (
    data?: TInput,
    onCloseCallback?: (result?: TOutput) => void
  ) => Promise<TOutput | undefined>;
  close: (result?: TOutput) => void;
  state: UseModalStateReturn<TInput, TOutput>;
}

/**
 * High-level modal hook with auto-wired component rendering.
 *
 * @example
 * ```tsx
 * // Define modal component
 * interface EditUserModalProps {
 *   isOpen: boolean;
 *   data?: { userId: string };
 *   onClose: (user?: User) => void;
 * }
 *
 * function EditUserModal({ isOpen, data, onClose }: EditUserModalProps) {
 *   // ... modal implementation
 * }
 *
 * // Use in page component
 * function UsersPage() {
 *   const editModal = useModal<{ userId: string }, User>(EditUserModal);
 *
 *   const handleEdit = async (userId: string) => {
 *     const user = await editModal.open({ userId });
 *     if (user) {
 *       console.log('User updated:', user);
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => handleEdit('123')}>Edit User</button>
 *       <editModal.Modal />
 *     </>
 *   );
 * }
 * ```
 */
export function useModal<TInput = void, TOutput = void>(
  ModalComponent: ComponentType<ModalComponentProps<TInput, TOutput>>
): UseModalReturn<TInput, TOutput> {
  const state = useModalState<TInput, TOutput>();

  // Memoize the Modal wrapper to prevent unnecessary re-renders
  const Modal = useMemo(() => {
    const ModalWrapper = (props: Partial<ModalComponentProps<TInput, TOutput>>) => {
      return (
        <ModalComponent
          isOpen={state.isOpen}
          data={state.data}
          onClose={state.close}
          {...props}
        />
      );
    };

    // Set display name for better debugging
    ModalWrapper.displayName = `Modal(${ModalComponent.displayName || ModalComponent.name || 'Component'})`;

    return ModalWrapper;
  }, [state.isOpen, state.data, state.close, ModalComponent]);

  return {
    Modal,
    open: state.open,
    close: state.close,
    state,
  };
}

// Re-export useModalState for convenience
export { useModalState } from './useModalState';
export type { UseModalStateReturn } from './useModalState';
