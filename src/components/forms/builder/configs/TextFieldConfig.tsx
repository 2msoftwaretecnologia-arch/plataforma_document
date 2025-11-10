"use client";

import React from "react";
import { TextField, Box } from "@mui/material";
import type { TextFieldData } from "@/types/ui/form";

interface TextFieldConfigProps {
  config: Partial<TextFieldData>;
  onChange: (config: Partial<TextFieldData>) => void;
}

export default function TextFieldConfig({ config, onChange }: TextFieldConfigProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Valor Padrão (Opcional)"
        placeholder="Texto pré-preenchido..."
        variant="outlined"
        multiline
        rows={2}
        value={config.value || ''}
        onChange={(e) => onChange({ ...config, value: e.target.value })}
        helperText="Texto que aparecerá pré-preenchido no campo"
      />
    </Box>
  );
}
