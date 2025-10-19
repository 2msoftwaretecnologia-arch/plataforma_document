"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Alert,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

interface ListOption {
  value: string;
}

interface ListData {
  name: string;
  options: ListOption[];
}

interface TextFieldData {
  name: string;
  value?: string;
}

interface NumberFieldData {
  name: string;
  value?: number;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
  required?: boolean;
}

interface FormPreviewProps {
  lists?: ListData[];
  textFields?: TextFieldData[];
  numberFields?: NumberFieldData[];
}

export default function FormPreview({ lists = [], textFields = [], numberFields = [] }: FormPreviewProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Estado para controlar os valores selecionados em cada campo
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>({});

  // Handler para mudanças nos selects
  const handleSelectChange = (fieldKey: string) => (event: SelectChangeEvent) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: event.target.value
    }));
  };

  // Handler para mudanças nos campos de texto e número
  const handleInputChange = (fieldKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: event.target.value
    }));
  };

  // Verificar se há pelo menos um campo válido
  const validLists = lists.filter((list) => {
    if (!list.name || list.name.trim() === "") return false;
    if (!list.options || list.options.length === 0) return false;
    
    const hasValidOption = list.options.some(
      (option) => option.value && option.value.trim() !== ""
    );
    return hasValidOption;
  });

  const validTextFields = textFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );

  const validNumberFields = numberFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );

  const hasAnyValidFields = validLists.length > 0 || validTextFields.length > 0 || validNumberFields.length > 0;

  if (!hasAnyValidFields) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
          border: isDarkMode ? '1px solid' : 'none',
          borderColor: isDarkMode ? 'grey.700' : 'transparent'
        }}
      >
        <Alert severity="info">
          Adicione pelo menos um campo (lista, texto ou número) para visualizar o preview do formulário.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        border: isDarkMode ? '1px solid' : 'none',
        borderColor: isDarkMode ? 'grey.700' : 'transparent'
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Visibility sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" component="h3">
          Preview do Formulário
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Renderizar listas válidas */}
        {validLists.map((list, index) => {
          const validOptions = list.options.filter(
            (option) => option.value && option.value.trim() !== ""
          );

          return (
            <FormControl key={`list-${index}`} fullWidth>
              <InputLabel id={`select-label-${index}`}>
                {list.name}
              </InputLabel>
              <Select
                labelId={`select-label-${index}`}
                id={`select-${index}`}
                value={selectedValues[`list-${index}`] || ""}
                label={list.name}
                onChange={handleSelectChange(`list-${index}`)}
              >
                {validOptions.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}

        {/* Renderizar campos de texto válidos */}
        {validTextFields.map((field, index) => (
          <TextField
            key={`text-${index}`}
            fullWidth
            label={field.name}
            variant="outlined"
            multiline
            rows={3}
            value={selectedValues[`text-${index}`] || ""}
            onChange={handleInputChange(`text-${index}`)}
            placeholder={`Digite ${field.name.toLowerCase()}...`}
          />
        ))}

        {/* Renderizar campos numéricos válidos */}
        {validNumberFields.map((field, index) => (
          <TextField
            key={`number-${index}`}
            fullWidth
            label={field.name}
            variant="outlined"
            type="number"
            value={selectedValues[`number-${index}`] || ""}
            onChange={handleInputChange(`number-${index}`)}
            placeholder={`Digite ${field.name.toLowerCase()}...`}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.allowDecimals ? "any" : "1",
            }}
            required={field.required}
            helperText={
              field.min !== undefined && field.max !== undefined
                ? `Valor entre ${field.min} e ${field.max}`
                : field.min !== undefined
                ? `Valor mínimo: ${field.min}`
                : field.max !== undefined
                ? `Valor máximo: ${field.max}`
                : undefined
            }
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          fontStyle: "italic",
          textAlign: "center"
        }}
      >
        Este é um preview interativo do seu formulário. Os usuários poderão preencher estes campos.
      </Typography>
    </Paper>
  );
}