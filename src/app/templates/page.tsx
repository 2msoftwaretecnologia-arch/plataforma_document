'use client';

import { useEffect, useState } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Edit, Map, FileCheck } from 'lucide-react';
import { getTemplates, createTemplate } from '@/services/templateService';
import type { Template, TemplateStatus } from '@/types/api/template';
import AddTemplateModal from '@/components/templates/AddTemplateModal';

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateStatus = (template: Template): TemplateStatus => {
    return {
      isMapped: template.chaves.length > 0,
      hasForm: template.formulario.length > 0,
    };
  };

  const handleCreateTemplate = async (data: { nome: string; descricao: string }) => {
    try {
      await createTemplate({
        ...data,
        arquivo_original: 'template_temp.docx', // Fake value for now
      });
      await loadTemplates();
      setIsModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Erro ao carregar templates</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={loadTemplates}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
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
                className="bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col aspect-square"
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
                      <span className={`font-medium ${template.ativo ? 'text-green-600' : 'text-red-600'}`}>
                        {template.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Mapeamento:</span>
                      <span className={`font-medium ${status.isMapped ? 'text-green-600' : 'text-orange-600'}`}>
                        {status.isMapped ? `${template.chaves.length} campos` : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Formulário:</span>
                      <span className={`font-medium ${status.hasForm ? 'text-green-600' : 'text-orange-600'}`}>
                        {status.hasForm ? 'Criado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 border-t border-border flex gap-1.5 justify-end flex-shrink-0 bg-muted/30">
                  <button
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Editar"
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
            onClick={() => setIsModalOpen(true)}
            className="bg-card border-2 border-dashed border-border rounded-xl shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col items-center justify-center aspect-square group"
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
      <AddTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTemplate}
      />
    </div>
  );
}
