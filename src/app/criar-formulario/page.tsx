"use client";

import React, { useState } from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import DynamicListBuilder from "../../components/forms/DynamicListBuilder";

interface FormData {
  lists?: Array<{
    name: string;
    options: Array<{ value: string }>;
  }>;
  textFields?: Array<{
    name: string;
    value?: string;
  }>;
  numberFields?: Array<{
    name: string;
    value?: number;
    min?: number;
    max?: number;
    allowDecimals?: boolean;
    required?: boolean;
  }>;
}

export default function CriarFormulario() {
  const [savedData, setSavedData] = useState<FormData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (data: FormData) => {
    setSavedData(data);
    setShowSuccess(true);
    console.log("Formulário salvo:", data);
    
    // Aqui você pode implementar a lógica para salvar no backend
    // Por exemplo: await saveFormToAPI(data);
  };

  const handlePreview = (data: FormData) => {
    console.log("Preview do formulário:", data);
    // Aqui você pode implementar a lógica de preview
    // Por exemplo: abrir um modal ou navegar para uma página de preview
  };

  return (
    <Box>
      <DynamicListBuilder
        onSave={handleSave}
        onPreview={handlePreview}
        initialData={savedData || undefined}
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
    </Box>
  );
}
