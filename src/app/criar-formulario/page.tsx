"use client";

import TemplateFormBuilder from "@/modules/forms/components/builder/TemplateFormBuilder";
import { useToast } from "@/modules/notifications";
import { useTemplate, useUpdateTemplate } from "@/modules/templates/hooks/useTemplates";
import type { TemplateFormField } from "@/modules/templates/types";
import LoadingState from "@/shared/components/LoadingState";
import { Alert, Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CriarFormularioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get("templateId");
  const toast = useToast();

  // TanStack Query hooks
  const { data: template, isLoading } = useTemplate(templateId);
  const updateMutation = useUpdateTemplate();

  const handleSave = async (formulario: TemplateFormField[]) => {
    try {
      if (!template) {
        toast.error("Nenhum template selecionado para editar");
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

      toast.success("Formulário salvo com sucesso!");
      router.push("/templates");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error(
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
