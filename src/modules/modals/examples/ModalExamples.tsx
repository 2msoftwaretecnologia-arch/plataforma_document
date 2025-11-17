/**
 * Modal System Examples
 *
 * This file demonstrates various modal patterns.
 * Copy and adapt these examples for your use cases.
 */

'use client';

import { useAlertModal, useConfirmModal, useErrorModal, useModal } from '@/modules/modals';
import { BaseModal } from '@/modules/modals/BaseModal';

// ============================================================================
// Example 1: Built-in Confirmation Modal
// ============================================================================

export function ConfirmExample() {
  const confirm = useConfirmModal();

  const handleDelete = async () => {
    const confirmed = await confirm.open({
      title: 'Deletar Template?',
      message: 'Esta ação não pode ser desfeita.',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      variant: 'danger'
    });

    if (confirmed) {
      console.log('User confirmed deletion');
      // Perform delete operation
    } else {
      console.log('User cancelled');
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Delete Template</button>
      <confirm.Modal />
    </>
  );
}

// ============================================================================
// Example 2: Built-in Alert Modal
// ============================================================================

export function AlertExample() {
  const alert = useAlertModal();

  const handleSave = async () => {
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    await alert.open({
      title: 'Sucesso!',
      message: 'Template salvo com sucesso.',
      variant: 'success'
    });

    console.log('User acknowledged success');
  };

  return (
    <>
      <button onClick={handleSave}>Save Template</button>
      <alert.Modal />
    </>
  );
}

// ============================================================================
// Example 3: Built-in Error Modal
// ============================================================================

export function ErrorExample() {
  const errorModal = useErrorModal();

  const handleRiskyOperation = async () => {
    try {
      throw new Error('Network request failed');
    } catch (error) {
      await errorModal.open({
        title: 'Erro ao Salvar',
        message: 'Não foi possível salvar o template.',
        error,
        showDetails: true
      });
    }
  };

  return (
    <>
      <button onClick={handleRiskyOperation}>Risky Operation</button>
      <errorModal.Modal />
    </>
  );
}

// ============================================================================
// Example 4: Custom Modal with useModal
// ============================================================================

interface EditUserData {
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  data?: EditUserData | null;
  onClose: (user?: User) => void;
}

function EditUserModal({ isOpen, data, onClose }: EditUserModalProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSave = () => {
    const updatedUser: User = {
      id: data?.userId || '',
      name,
      email
    };
    onClose(updatedUser);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Edit User"
      size="md"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={() => onClose()}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </BaseModal>
  );
}

export function CustomModalExample() {
  const editModal = useModal<EditUserData, User>(EditUserModal);

  const handleEdit = async () => {
    // Promise-based
    const user = await editModal.open({ userId: '123' });
    if (user) {
      console.log('User updated:', user);
    }
  };

  const handleEditCallback = () => {
    // Callback-based
    editModal.open({ userId: '123' }, (user) => {
      if (user) {
        console.log('User updated (callback):', user);
      }
    });
  };

  return (
    <>
      <button onClick={handleEdit}>Edit User (Promise)</button>
      <button onClick={handleEditCallback}>Edit User (Callback)</button>
      <editModal.Modal />
    </>
  );
}

// ============================================================================
// Example 5: Sequential Modals
// ============================================================================

export function SequentialModalsExample() {
  const confirm = useConfirmModal();
  const alert = useAlertModal();
  const errorModal = useErrorModal();

  const handleComplexFlow = async () => {
    // Step 1: Confirm action
    const confirmed = await confirm.open({
      title: 'Iniciar Processo?',
      message: 'Isso irá processar todos os templates.',
      variant: 'warning'
    });

    if (!confirmed) return;

    // Step 2: Perform operation
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Show success
      await alert.open({
        title: 'Concluído!',
        message: 'Todos os templates foram processados.',
        variant: 'success'
      });
    } catch (error) {
      // Step 3 (error path): Show error
      await errorModal.open({
        title: 'Erro no Processamento',
        message: 'Ocorreu um erro ao processar os templates.',
        error,
        showDetails: true
      });
    }
  };

  return (
    <>
      <button onClick={handleComplexFlow}>Start Complex Flow</button>
      <confirm.Modal />
      <alert.Modal />
      <errorModal.Modal />
    </>
  );
}

// ============================================================================
// Example 6: Using useModalState for Manual Control
// ============================================================================

import { useModalState } from '@/modules/modals';
import React from 'react';

export function ManualControlExample() {
  const modal = useModalState<{ message: string }, string>();

  const handleOpen = async () => {
    const result = await modal.open({ message: 'Hello from modal!' });
    console.log('Modal returned:', result);
  };

  return (
    <>
      <button onClick={handleOpen}>Open Modal</button>

      {/* Manual JSX with full control */}
      <BaseModal
        isOpen={modal.isOpen}
        onClose={() => modal.close()}
        title="Manual Control"
      >
        <p>{modal.data?.message}</p>
        <button onClick={() => modal.close('User clicked OK')}>
          OK
        </button>
      </BaseModal>
    </>
  );
}
