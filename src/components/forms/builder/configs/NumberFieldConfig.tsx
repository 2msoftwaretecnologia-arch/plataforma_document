"use client";

import React from "react";
import { TextField, Box, FormControlLabel, Checkbox } from "@mui/material";
import type { NumberFieldData } from "@/types/ui/form";

interface NumberFieldConfigProps {
  config: Partial<NumberFieldData>;
  onChange: (config: Partial<NumberFieldData>) => void;
}

export default function NumberFieldConfig({ config, onChange }: NumberFieldConfigProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Valor Mínimo"
          type="number"
          variant="outlined"
          value={config.min ?? ''}
          onChange={(e) => onChange({ ...config, min: e.target.value ? Number(e.target.value) : undefined })}
          fullWidth
        />
        <TextField
          label="Valor Máximo"
          type="number"
          variant="outlined"
          value={config.max ?? ''}
          onChange={(e) => onChange({ ...config, max: e.target.value ? Number(e.target.value) : undefined })}
          fullWidth
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.allowDecimals ?? true}
              onChange={(e) => onChange({ ...config, allowDecimals: e.target.checked })}
            />
          }
          label="Permitir Decimais"
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
