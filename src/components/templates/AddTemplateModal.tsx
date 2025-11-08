'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const templateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TemplateFormData) => Promise<void>;
}

export default function AddTemplateModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTemplateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const handleFormSubmit = async (data: TemplateFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar template');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Novo Template</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Nome Field */}
          <div className="mb-4">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Nome do Template
            </label>
            <input
              id="nome"
              type="text"
              {...register('nome')}
              className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="Ex: Contrato de Prestação de Serviços"
              disabled={isSubmitting}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nome.message}
              </p>
            )}
          </div>

          {/* Descrição Field */}
          <div className="mb-6">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={4}
              {...register('descricao')}
              className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground resize-none"
              placeholder="Descreva brevemente o propósito deste template..."
              disabled={isSubmitting}
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.descricao.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border-2 border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting ? 'Criando...' : 'Criar Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
