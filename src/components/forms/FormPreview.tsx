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

interface FormPreviewProps {
  lists: ListData[];
}

export default function FormPreview({ lists }: FormPreviewProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Estado para controlar os valores selecionados em cada select
  const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});

  // Handler para mudanças nos selects
  const handleSelectChange = (index: number) => (event: SelectChangeEvent) => {
    setSelectedValues(prev => ({
      ...prev,
      [index]: event.target.value
    }));
  };

  if (!lists || lists.length === 0) {
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
          Adicione pelo menos uma lista para visualizar o preview do formulário.
        </Alert>
      </Paper>
    );
  }

  // Filtrar apenas listas válidas - critério mais flexível
  const validLists = lists.filter((list) => {
    if (!list.name || list.name.trim() === "") return false;
    if (!list.options || list.options.length === 0) return false;
    
    // Pelo menos uma opção deve ter valor
    const hasValidOption = list.options.some(
      (option) => option.value && option.value.trim() !== ""
    );
    return hasValidOption;
  });

  if (validLists.length === 0) {
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
        <Alert severity="warning">
          Complete pelo menos uma lista com nome e opções para visualizar o preview.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
        border: isDarkMode ? '1px solid' : 'none',
        borderColor: isDarkMode ? 'grey.700' : 'transparent'
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Visibility sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" color="primary">
          Preview do Formulário
        </Typography>
      </Box>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        Assim é como suas listas aparecerão no formulário final:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {validLists.map((list, index) => {
          // Filtrar opções válidas
          const validOptions = list.options.filter(
            (option) => option.value && option.value.trim() !== ""
          );

          if (validOptions.length === 0) return null;

          return (
            <FormControl key={index} fullWidth>
              <InputLabel 
                id={`select-${index}-label`}
                sx={{
                  color: isDarkMode ? 'grey.300' : 'inherit',
                  '&.Mui-focused': {
                    color: 'primary.main'
                  }
                }}
              >
                {list.name}
              </InputLabel>
              <Select
                labelId={`select-${index}-label`}
                id={`select-${index}`}
                value={selectedValues[index] || ""}
                label={list.name}
                onChange={handleSelectChange(index)}
                sx={{ 
                  bgcolor: isDarkMode ? 'grey.800' : 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'grey.600' : 'grey.300'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'grey.500' : 'grey.400'
                  },
                  '& .MuiSelect-select': {
                    color: isDarkMode ? 'grey.200' : 'text.primary'
                  }
                }}
              >
                {validOptions.map((option, optionIndex) => (
                  <MenuItem 
                    key={optionIndex} 
                    value={option.value}
                    sx={{
                      color: isDarkMode ? 'grey.200' : 'text.primary',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'grey.700' : 'grey.100'
                      }
                    }}
                  >
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}
      </Box>

      <Divider sx={{ my: 3, borderColor: isDarkMode ? 'grey.700' : 'grey.300' }} />

      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          display: 'block',
          textAlign: 'center',
          color: isDarkMode ? 'grey.400' : 'text.secondary'
        }}
      >
        💡 Este é um preview interativo. Você pode testar selecionando as opções.
      </Typography>
    </Paper>
  );
}