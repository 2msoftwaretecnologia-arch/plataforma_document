"use client";

import React, { useState } from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import DynamicListBuilder from "../../components/forms/DynamicListBuilder";

interface ListData {
  lists: Array<{
    name: string;
    options: Array<{ value: string }>;
  }>;
}

export default function CriarFormulario() {
  const [savedData, setSavedData] = useState<ListData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (data: ListData) => {
    setSavedData(data);
    setShowSuccess(true);
    console.log("Listas salvas:", data);
    
    // Aqui você pode implementar a lógica para salvar no backend
    // Por exemplo: await saveListsToAPI(data);
  };

  const handlePreview = (data: ListData) => {
    console.log("Preview das listas:", data);
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
          Listas salvas com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}
