import { useCallback, useRef, useState } from 'react';

export interface UseModalStateReturn<TInput = void, TOutput = void> {
  isOpen: boolean;
  data: TInput | null;
  open: (
    data?: TInput,
    onCloseCallback?: (result?: TOutput) => void
  ) => Promise<TOutput | undefined>;
  close: (result?: TOutput) => void;
}

/**
 * Low-level hook for managing modal state with promise and callback support.
 *
 * @example
 * ```tsx
 * const modal = useModalState<{ userId: string }, User>();
 *
 * // Promise-based usage
 * const user = await modal.open({ userId: '123' });
 * if (user) console.log(user.name);
 *
 * // Callback-based usage
 * modal.open({ userId: '123' }, (user) => {
 *   if (user) console.log(user.name);
 * });
 *
 * // Manual JSX
 * <EditUserModal
 *   isOpen={modal.isOpen}
 *   data={modal.data}
 *   onClose={modal.close}
 * />
 * ```
 */
export function useModalState<TInput = void, TOutput = void>(): UseModalStateReturn<
  TInput,
  TOutput
> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TInput | null>(null);

  // Use refs to avoid stale closures
  const promiseRef = useRef<{
    resolve: (value: TOutput | undefined) => void;
    reject: (error?: Error) => void;
  } | null>(null);

  const callbackRef = useRef<((result?: TOutput) => void) | undefined>(undefined);

  const open = useCallback(
    (modalData?: TInput, onCloseCallback?: (result?: TOutput) => void): Promise<TOutput | undefined> => {
      // Set data if provided
      if (modalData !== undefined) {
        setData(modalData as TInput);
      }

      // Store callback in ref to avoid stale closures
      callbackRef.current = onCloseCallback;

      // Open modal
      setIsOpen(true);

      // Return promise
      return new Promise<TOutput | undefined>((resolve, reject) => {
        promiseRef.current = { resolve, reject };
      });
    },
    []
  );

  const close = useCallback((result?: TOutput) => {
    // Close modal immediately
    setIsOpen(false);

    // Resolve promise with result
    if (promiseRef.current) {
      promiseRef.current.resolve(result);
      promiseRef.current = null;
    }

    // Call callback with result
    if (callbackRef.current) {
      callbackRef.current(result);
      callbackRef.current = undefined;
    }

    // Cleanup data after animation
    setTimeout(() => {
      setData(null);
    }, 300);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
  };
}
