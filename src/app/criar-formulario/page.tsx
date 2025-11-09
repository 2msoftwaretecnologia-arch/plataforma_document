"use client";

import FormBuilder from "@/components/forms/builder/FormBuilder";
import LoadingState from "@/components/shared/LoadingState";
import { useTemplate, useUpdateTemplate } from "@/hooks/queries/useTemplates";
import { formDataToTemplate, templateToFormData } from "@/lib/formMapper";
import type { FormData } from "@/types/ui/form";
import { Alert, Box, Snackbar } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CriarFormularioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get("templateId");

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TanStack Query hooks
  const { data: template, isLoading } = useTemplate(templateId);
  const updateMutation = useUpdateTemplate();

  const handleSave = async (data: FormData) => {
    try {
      if (!template) {
        setError("Nenhum template selecionado para editar");
        return;
      }

      const formulario = formDataToTemplate(data);
      console.log("Salvando formulário:", {
        templateId: template.id,
        formulario,
      });

      await updateMutation.mutateAsync({
        id: template.id,
        data: { formulario },
      });

      setShowSuccess(true);

      // Redirect to templates page after 1.5 seconds
      setTimeout(() => {
        router.push("/templates");
      }, 1500);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao salvar formulário"
      );
    }
  };

  const handlePreview = (data: FormData) => {
    console.log("Preview do formulário:", data);
    // TODO: Implementar preview modal ou navegação
  };

  if (isLoading) {
    return <LoadingState message="Carregando template..." />;
  }

  return (
    <Box>
      <FormBuilder
        onSave={handleSave}
        onPreview={handlePreview}
        initialData={
          template ? templateToFormData(template.formulario) : undefined
        }
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
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function CriarFormulario() {
  return (
    <Suspense fallback={<LoadingState message="Carregando..." />}>
      <CriarFormularioContent />
    </Suspense>
  );
}
