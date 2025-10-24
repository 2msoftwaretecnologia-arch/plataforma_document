"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  useTheme,
  TextField as MuiTextField,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

// Importar tipos e utilitários
import { FormPreviewProps } from "./types";
import {
  getValidLists,
  getValidTextFields,
  getValidNumberFields,
  getValidDateFields,
  getValidImageFields,
  hasValidFields,
} from "./utils";

// Importar componentes
import ListField from "./ListField";
import TextFieldComponent from "./TextFieldComponent";
import NumberFieldComponent from "./NumberFieldComponent";
import DateFieldComponent from "./DateFieldComponent";
import ImageFieldComponent from "./ImageFieldComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValues = Record<string, any>;

interface DynamicFormRendererProps extends FormPreviewProps {
  /**
   * Modo de renderização do formulário
   * - "preview": Modo interativo de preview (como criar-formulario)
   * - "editable": Modo preenchível com campos desabilitados até ativar edição
   */
  mode?: "preview" | "editable";

  /**
   * Valores iniciais do formulário (usado em modo editable)
   */
  initialValues?: FormValues;

  /**
   * Se true, ativa o modo de edição (modo editable)
   */
  isEditing?: boolean;

  /**
   * Callback quando o usuário quer ativar edição
   */
  onEditModeChange?: (isEditing: boolean) => void;

  /**
   * Callback quando valores mudam (modo editable e isEditing=true)
   */
  onValuesChange?: (values: FormValues) => void;

  /**
   * Título customizado do formulário
   */
  title?: string;

  /**
   * Mostrar a mensagem de rodapé padrão
   */
  showFooterMessage?: boolean;

  /**
   * Mostrar o ícone e titulo de preview
   */
  showHeader?: boolean;
}

export default function DynamicFormRenderer({
  lists = [],
  textFields = [],
  numberFields = [],
  dateFields = [],
  imageFields = [],
  mode = "preview",
  initialValues = {},
  isEditing = false,
  onValuesChange,
  title,
  showFooterMessage = mode === "preview",
  showHeader = mode === "preview",
}: DynamicFormRendererProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Estado para modo preview (comportamento original)
  const [previewValues, setPreviewValues] = useState<FormValues>({});
  const [dragStates, setDragStates] = useState<{ [key: string]: boolean }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File[];
  }>({});

  // Estado para modo editable
  const [editableValues, setEditableValues] =
    useState<FormValues>(initialValues);

  // Usar valores apropriados baseado no modo
  const selectedValues = mode === "preview" ? previewValues : editableValues;

  // Handler genérico para mudanças de valores
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (fieldKey: string, value: any) => {
    if (mode === "preview") {
      setPreviewValues((prev) => ({
        ...prev,
        [fieldKey]: value,
      }));
    } else {
      // Modo editable
      const newValues = { ...editableValues, [fieldKey]: value };
      setEditableValues(newValues);
      if (onValuesChange) {
        onValuesChange(newValues);
      }
    }
  };

  // Handlers para drag and drop de imagens
  const handleDragStateChange = (fieldKey: string, isDragging: boolean) => {
    setDragStates((prev) => ({ ...prev, [fieldKey]: isDragging }));
  };

  const handleFilesChange = (fieldKey: string, files: File[]) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldKey]: files,
    }));
  };

  // Obter campos válidos
  const validLists = getValidLists(lists);
  const validTextFields = getValidTextFields(textFields);
  const validNumberFields = getValidNumberFields(numberFields);
  const validDateFields = getValidDateFields(dateFields);
  const validImageFields = getValidImageFields(imageFields);

  const hasAnyValidFields = hasValidFields(
    lists,
    textFields,
    numberFields,
    dateFields,
    imageFields
  );

  if (!hasAnyValidFields) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          bgcolor: isDarkMode ? "grey.900" : "grey.50",
          border: isDarkMode ? "1px solid" : "none",
          borderColor: isDarkMode ? "grey.700" : "transparent",
        }}
      >
        <Alert severity="info">
          Adicione pelo menos um campo (lista, texto, número, data ou imagem)
          para visualizar o formulário.
        </Alert>
      </Paper>
    );
  }

  // Renderização do modo preview
  if (mode === "preview") {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          bgcolor: isDarkMode ? "grey.900" : "grey.50",
          border: isDarkMode ? "1px solid" : "none",
          borderColor: isDarkMode ? "grey.700" : "transparent",
        }}
      >
        {showHeader && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Visibility sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" component="h3">
                {title || "Preview do Formulário"}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

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

        {showFooterMessage && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Este é um preview interativo do seu formulário. Os usuários poderão
              preencher estes campos.
            </Typography>
          </>
        )}
      </Paper>
    );
  }

  // Renderização do modo editable (preenchimento real)
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {showHeader && (
        <>
          <Typography variant="h6">
            {title || "Dados do Formulário"}
          </Typography>
          <Divider />
        </>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Renderizar campos de texto */}
        {validTextFields.map((field) => (
          <MuiTextField
            key={`text-${field.name}`}
            label={field.name}
            value={editableValues[field.name] || ""}
            onChange={(e) => handleValueChange(field.name, e.target.value)}
            disabled={!isEditing}
            fullWidth
            variant={isEditing ? "outlined" : "standard"}
          />
        ))}

        {/* Renderizar campos numéricos */}
        {validNumberFields.map((field) => (
          <MuiTextField
            key={`number-${field.name}`}
            label={field.name}
            type="number"
            value={editableValues[field.name] || ""}
            onChange={(e) =>
              handleValueChange(
                field.name,
                e.target.value ? parseFloat(e.target.value) : ""
              )
            }
            disabled={!isEditing}
            fullWidth
            variant={isEditing ? "outlined" : "standard"}
            slotProps={{
              htmlInput: {
                step: field.allowDecimals ? "0.01" : "1",
                min: field.min,
                max: field.max,
              },
            }}
          />
        ))}

        {/* Renderizar campos de data */}
        {validDateFields.map((field) => (
          <MuiTextField
            key={`date-${field.name}`}
            label={field.name}
            type={field.dateType}
            value={editableValues[field.name] || ""}
            onChange={(e) => handleValueChange(field.name, e.target.value)}
            disabled={!isEditing}
            fullWidth
            variant={isEditing ? "outlined" : "standard"}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        ))}

        {/* Renderizar listas */}
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

        {/* Renderizar campos de imagem */}
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
    </Box>
  );
}
