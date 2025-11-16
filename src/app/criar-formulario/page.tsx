"use client";

import TemplateFormBuilder from "@/modules/forms/components/builder/TemplateFormBuilder";
import LoadingState from "@/shared/components/LoadingState";
import { useTemplate, useUpdateTemplate } from "@/modules/templates/hooks/useTemplates";
import type { TemplateFormField } from "@/modules/templates/types";
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

  const handleSave = async (formulario: TemplateFormField[]) => {
    try {
      if (!template) {
        setError("Nenhum template selecionado para editar");
        return;
      }

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

  if (isLoading) {
    return <LoadingState message="Carregando template..." />;
  }

  if (!template) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Template não encontrado.</Alert>
      </Box>
    );
  }

  if (!template.chaves || template.chaves.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          Este template não possui chaves mapeadas. Por favor, mapeie o template primeiro.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TemplateFormBuilder
        template={template}
        onSave={handleSave}
        isLoading={updateMutation.isPending}
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
