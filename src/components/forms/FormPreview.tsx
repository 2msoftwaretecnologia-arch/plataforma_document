"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  useTheme,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

// Importar tipos e utilitários
import { FormPreviewProps } from './types';
import { 
  getValidLists, 
  getValidTextFields, 
  getValidNumberFields, 
  getValidDateFields, 
  getValidImageFields, 
  hasValidFields 
} from './utils';

// Importar componentes
import ListField from './ListField';
import TextFieldComponent from './TextFieldComponent';
import NumberFieldComponent from './NumberFieldComponent';
import DateFieldComponent from './DateFieldComponent';
import ImageFieldComponent from './ImageFieldComponent';

export default function FormPreview({ lists = [], textFields = [], numberFields = [], dateFields = [], imageFields = [] }: FormPreviewProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Estado para controlar os valores selecionados em cada campo
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>({});
  
  // Estado para controlar drag and drop
  const [dragStates, setDragStates] = useState<{ [key: string]: boolean }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});

  // Handler genérico para mudanças de valores
  const handleValueChange = (fieldKey: string, value: any) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Handlers para drag and drop de imagens
  const handleDragStateChange = (fieldKey: string, isDragging: boolean) => {
    setDragStates(prev => ({ ...prev, [fieldKey]: isDragging }));
  };

  const handleFilesChange = (fieldKey: string, files: File[]) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldKey]: files
    }));
  };

  // Obter campos válidos
  const validLists = getValidLists(lists);
  const validTextFields = getValidTextFields(textFields);
  const validNumberFields = getValidNumberFields(numberFields);
  const validDateFields = getValidDateFields(dateFields);
  const validImageFields = getValidImageFields(imageFields);

  const hasAnyValidFields = hasValidFields(lists, textFields, numberFields, dateFields, imageFields);

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
          Adicione pelo menos um campo (lista, texto, número, data ou imagem) para visualizar o preview do formulário.
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
        {validLists.map((list, index) => (
          <ListField
            key={`list-${index}`}
            field={list}
            index={index}
            selectedValues={selectedValues}
            onValueChange={handleValueChange}
            isDarkMode={isDarkMode}
          />
        ))}

        {/* Renderizar campos de texto válidos */}
        {validTextFields.map((field, index) => (
          <TextFieldComponent
            key={`text-${index}`}
            field={field}
            index={index}
            selectedValues={selectedValues}
            onValueChange={handleValueChange}
            isDarkMode={isDarkMode}
          />
        ))}

        {/* Renderizar campos numéricos válidos */}
        {validNumberFields.map((field, index) => (
          <NumberFieldComponent
            key={`number-${index}`}
            field={field}
            index={index}
            selectedValues={selectedValues}
            onValueChange={handleValueChange}
            isDarkMode={isDarkMode}
          />
        ))}

        {/* Renderizar campos de data válidos */}
        {validDateFields.map((field, index) => (
          <DateFieldComponent
            key={`date-${index}`}
            field={field}
            index={index}
            selectedValues={selectedValues}
            onValueChange={handleValueChange}
            isDarkMode={isDarkMode}
          />
        ))}

        {/* Renderizar campos de imagem válidos */}
        {validImageFields.map((field, index) => (
          <ImageFieldComponent
            key={`image-${index}`}
            field={field}
            index={index}
            selectedValues={selectedValues}
            onValueChange={handleValueChange}
            isDarkMode={isDarkMode}
            dragStates={dragStates}
            uploadedFiles={uploadedFiles}
            onDragStateChange={handleDragStateChange}
            onFilesChange={handleFilesChange}
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