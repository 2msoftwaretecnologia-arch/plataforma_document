"use client";

import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Box } from "@mui/material";
import type { DateFieldData } from "@/modules/forms/types";

interface DateFieldConfigProps {
  config: Partial<DateFieldData>;
  onChange: (config: Partial<DateFieldData>) => void;
}

export default function DateFieldConfig({ config, onChange }: DateFieldConfigProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Tipo de Data</InputLabel>
        <Select
          value={config.dateType || 'date'}
          label="Tipo de Data"
          onChange={(e) => onChange({ ...config, dateType: e.target.value as DateFieldData['dateType'] })}
        >
          <MenuItem value="date">Data (DD/MM/AAAA)</MenuItem>
          <MenuItem value="datetime-local">Data e Hora</MenuItem>
          <MenuItem value="time">Apenas Hora</MenuItem>
          <MenuItem value="month">Mês e Ano</MenuItem>
        </Select>
      </FormControl>
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
  );
}
