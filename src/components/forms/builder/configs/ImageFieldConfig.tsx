"use client";

import React from "react";
import { TextField, Box, FormControlLabel, Checkbox } from "@mui/material";
import type { ImageFieldData } from "@/types/ui/form";

interface ImageFieldConfigProps {
  config: Partial<ImageFieldData>;
  onChange: (config: Partial<ImageFieldData>) => void;
}

export default function ImageFieldConfig({ config, onChange }: ImageFieldConfigProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Tamanho Máximo (MB)"
        type="number"
        variant="outlined"
        value={config.maxFileSize ?? 5}
        onChange={(e) => onChange({ ...config, maxFileSize: Number(e.target.value) })}
        helperText="Tamanho máximo do arquivo em megabytes"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.allowMultiple ?? false}
              onChange={(e) => onChange({ ...config, allowMultiple: e.target.checked })}
            />
          }
          label="Permitir Múltiplas Imagens"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.required ?? false}
              onChange={(e) => onChange({ ...config, required: e.target.checked })}
            />
          }
          label="Campo Obrigatório"
        />
      </Box>
    </Box>
  );
}
