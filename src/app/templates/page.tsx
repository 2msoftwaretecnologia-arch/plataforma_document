'use client';

import AddTemplateModal, {
  type TemplateFormData,
} from '@/modules/templates/components/AddTemplateModal';
import EmptyState from '@/shared/components/EmptyState';
import ErrorState from '@/shared/components/ErrorState';
import LoadingState from '@/shared/components/LoadingState';
import {
  useTemplates,
  useCreateTemplate,
} from '@/modules/templates/hooks/useTemplates';
import type { Template, TemplateStatus } from '@/modules/templates/types';
import {
  CheckCircle,
  Edit,
  FileCheck,
  FileText,
  Map,
  Plus,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/modules/modals';

export default function Templates() {
  const router = useRouter();
  const addModal = useModal<null, TemplateFormData>(AddTemplateModal);

  // TanStack Query hooks
  const { data: templates, isLoading, error, refetch } = useTemplates();
  const createMutation = useCreateTemplate();

  const getTemplateStatus = (template: Template): TemplateStatus => {
    return {
      isMapped: template.chaves.length > 0,
      hasForm: template.formulario.length > 0,
    };
  };

  const handleCreateTemplate = async () => {
    const data = await addModal.open();
    if (data) {
      await createMutation.mutateAsync({
        ...data,
        arquivo_original: 'template_temp.docx', // Fake value for now
      });
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState message="Carregando templates..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Empty state
  if (!templates || templates.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-16 h-16 text-muted-foreground" />}
        title="Nenhum template encontrado"
        message="Crie seu primeiro template para começar"
        action={
          <button
            onClick={handleCreateTemplate}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Template
          </button>
        }
      />
    );
  }

  return (
    <div className="bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Templates</h1>
          <p className="text-muted-foreground">
            Gerencie seus templates de documentos
          </p>
        </div>

        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => {
            const status = getTemplateStatus(template);
            return (
              <div
                key={template.id}
                className="bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex gap-1.5">
                      {status.isMapped ? (
                        <div title="Mapeado" className="p-1 bg-green-500/10 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      ) : (
                        <div title="Não mapeado" className="p-1 bg-muted rounded">
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      {status.hasForm ? (
                        <div title="Formulário criado" className="p-1 bg-blue-500/10 rounded">
                          <FileCheck className="w-4 h-4 text-blue-500" />
                        </div>
                      ) : (
                        <div title="Sem formulário" className="p-1 bg-muted rounded">
                          <FileCheck className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {template.nome}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {template.descricao}
                  </p>

                  {/* Status Info */}
                  <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`font-medium ${template.ativo ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {template.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Mapeamento:</span>
                      <span
                        className={`font-medium ${status.isMapped ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {status.isMapped
                          ? `${template.chaves.length} campos`
                          : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Formulário:</span>
                      <span
                        className={`font-medium ${status.hasForm ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {status.hasForm ? 'Criado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 border-t border-border flex gap-1.5 justify-end flex-shrink-0 bg-muted/30">
                  <button
                    onClick={() =>
                      router.push(`/criar-formulario?templateId=${template.id}`)
                    }
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Editar formulário"
                  >
                    <Edit className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Mapear campos"
                  >
                    <Map className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/criar-formulario?templateId=${template.id}`)
                    }
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Criar formulário"
                  >
                    <FileCheck className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Template Card */}
          <button
            onClick={handleCreateTemplate}
            className="bg-card border-2 border-dashed border-border rounded-xl shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[300px] group"
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-12 h-12 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">
              Novo Template
            </span>
          </button>
        </div>
      </div>

      {/* Add Template Modal */}
      <addModal.Modal />
    </div>
  );
}
