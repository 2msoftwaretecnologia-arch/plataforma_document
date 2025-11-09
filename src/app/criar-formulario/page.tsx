"use client";

import { formDataToTemplate, templateToFormData } from "@/lib/formMapper";
import { getTemplateById, updateTemplate } from "@/services/templateService";
import type { Template } from "@/types/api/template";
import type { FormData } from "@/types/ui/form";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FormBuilder from "../../components/forms/builder/FormBuilder";

function CriarFormularioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('templateId');

  const [template, setTemplate] = useState<Template | null>(null);
  const [initialData, setInitialData] = useState<FormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!templateId);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Carregando template ID:', id);
      const data = await getTemplateById(id);
      console.log('Template carregado:', data);

      if (!data || !data.id) {
        throw new Error('Template inválido ou ID não encontrado');
      }

      setTemplate(data);
      setInitialData(templateToFormData(data.formulario));
    } catch (err) {
      console.error('Erro ao carregar template:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: FormData) => {
    try {
      if (template) {
        const formulario = formDataToTemplate(data);
        console.log('Salvando formulário:', { templateId: template.id, formulario });
        await updateTemplate(template.id, { formulario });
        setShowSuccess(true);

        // Redirect to templates page after 1.5 seconds
        setTimeout(() => {
          router.push('/templates');
        }, 1500);
      } else {
        setError('Nenhum template selecionado para editar');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar formulário');
    }
  };

  const handlePreview = (data: FormData) => {
    console.log("Preview do formulário:", data);
    // TODO: Implementar preview modal ou navegação
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <FormBuilder
        onSave={handleSave}
        onPreview={handlePreview}
        initialData={initialData}
        templateId={template?.id}
        templateName={template?.nome}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Formulário salvo com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function CriarFormulario() {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    }>
      <CriarFormularioContent />
    </Suspense>
  );
}
