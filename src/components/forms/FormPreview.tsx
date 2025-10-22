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
  Chip,
  OutlinedInput,
  Autocomplete,
  Button,
} from "@mui/material";
import { Visibility, CloudUpload } from "@mui/icons-material";

// Função para gerar placeholders baseados no tipo de data
const getPlaceholderForDateType = (dateType: string): string => {
  const now = new Date();
  
  switch (dateType) {
    case "date":
      return now.toLocaleDateString('pt-BR'); // DD/MM/AAAA
    case "datetime-local":
      return `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`; // DD/MM/AAAA HH:MM
    case "time":
      return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // HH:MM
    case "month":
      return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`; // MM/AAAA
    default:
      return "";
  }
};

interface ListOption {
  value: string;
}

interface ListData {
  name: string;
  options: ListOption[];
  multiSelect?: boolean; // Adiciona suporte para seleção múltipla
  allowCustomValues?: boolean; // Permite valores personalizados
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

interface DateFieldData {
  name: string;
  dateType: "date" | "datetime-local" | "time" | "month";
  value?: string;
  required?: boolean;
  helperText?: string;
}

interface ImageFieldData {
  name: string;
  allowMultiple?: boolean;
  required?: boolean;
  helperText?: string;
  acceptedFormats?: string[];
  maxFileSize?: number;
}

interface FormPreviewProps {
  lists?: ListData[];
  textFields?: TextFieldData[];
  numberFields?: NumberFieldData[];
  dateFields?: DateFieldData[];
  imageFields?: ImageFieldData[];
}

export default function FormPreview({ lists = [], textFields = [], numberFields = [], dateFields = [], imageFields = [] }: FormPreviewProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Estado para controlar os valores selecionados em cada campo
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>({});
  
  // Estado para controlar drag and drop
  const [dragStates, setDragStates] = useState<{ [key: string]: boolean }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});

  // Handler para mudanças nos selects (seleção única)
  const handleSelectChange = (fieldKey: string) => (event: SelectChangeEvent) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: event.target.value
    }));
  };

  // Handler para mudanças nos selects múltiplos
  const handleMultiSelectChange = (fieldKey: string) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  // Handler para mudanças nos campos de texto e número
  const handleInputChange = (fieldKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldKey]: event.target.value
    }));
  };

  // Handlers para drag and drop
  const handleDragOver = (fieldKey: string) => (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (fieldKey: string) => (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragStates(prev => ({ ...prev, [fieldKey]: true }));
  };

  const handleDragLeave = (fieldKey: string) => (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Só remove o estado se realmente saiu da área
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragStates(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleDrop = (fieldKey: string, field: ImageFieldData) => async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragStates(prev => ({ ...prev, [fieldKey]: false }));

    const items = Array.from(event.dataTransfer.items);
    const allFiles: File[] = [];

    // Função para processar entradas de diretório recursivamente
    const processEntry = async (entry: FileSystemEntry): Promise<File[]> => {
      const files: File[] = [];
      
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        return new Promise((resolve) => {
          fileEntry.file((file) => {
            // Verifica se é uma imagem
            if (field.acceptedFormats && field.acceptedFormats.length > 0) {
              const isValidFormat = field.acceptedFormats.some(format => 
                file.type.includes(format.replace('*', '').replace('.', ''))
              );
              if (isValidFormat) {
                files.push(file);
              }
            } else if (file.type.startsWith('image/')) {
              files.push(file);
            }
            resolve(files);
          });
        });
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const dirReader = dirEntry.createReader();
        
        return new Promise((resolve) => {
          const readEntries = async () => {
            dirReader.readEntries(async (entries) => {
              if (entries.length === 0) {
                resolve(files);
                return;
              }
              
              for (const subEntry of entries) {
                const subFiles = await processEntry(subEntry);
                files.push(...subFiles);
              }
              
              // Continue lendo se há mais entradas
              await readEntries();
            });
          };
          readEntries();
        });
      }
      
      return files;
    };

    // Processa todos os itens (arquivos e pastas)
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          const files = await processEntry(entry);
          allFiles.push(...files);
        }
      }
    }

    // Se não encontrou arquivos via webkitGetAsEntry, tenta o método tradicional
    if (allFiles.length === 0) {
      const files = Array.from(event.dataTransfer.files);
      const imageFiles = files.filter(file => {
        if (field.acceptedFormats && field.acceptedFormats.length > 0) {
          return field.acceptedFormats.some(format => 
            file.type.includes(format.replace('*', '').replace('.', ''))
          );
        }
        return file.type.startsWith('image/');
      });
      allFiles.push(...imageFiles);
    }

    if (allFiles.length > 0) {
      // Verifica tamanho dos arquivos
      const maxSize = (field.maxFileSize || 5) * 1024 * 1024; // MB para bytes
      const validFiles = allFiles.filter(file => file.size <= maxSize);
      
      if (validFiles.length > 0) {
        if (field.allowMultiple) {
          setUploadedFiles(prev => ({
            ...prev,
            [fieldKey]: [...(prev[fieldKey] || []), ...validFiles]
          }));
        } else {
          setUploadedFiles(prev => ({
            ...prev,
            [fieldKey]: [validFiles[0]]
          }));
        }
      }
      
      // Mostra feedback se alguns arquivos foram rejeitados
      const rejectedCount = allFiles.length - validFiles.length;
      if (rejectedCount > 0) {
        console.warn(`${rejectedCount} arquivo(s) foram rejeitados por excederem o tamanho máximo de ${field.maxFileSize || 5}MB`);
      }
    }
  };

  const handleFileSelect = (fieldKey: string, field: ImageFieldData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      if (field.allowMultiple) {
        setUploadedFiles(prev => ({
          ...prev,
          [fieldKey]: [...(prev[fieldKey] || []), ...files]
        }));
      } else {
        setUploadedFiles(prev => ({
          ...prev,
          [fieldKey]: [files[0]]
        }));
      }
    }
  };

  const removeFile = (fieldKey: string, fileIndex: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldKey]: prev[fieldKey]?.filter((_, index) => index !== fileIndex) || []
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

  const validDateFields = dateFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );

  const validImageFields = imageFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );

  const hasAnyValidFields = validLists.length > 0 || validTextFields.length > 0 || validNumberFields.length > 0 || validDateFields.length > 0 || validImageFields.length > 0;

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
        {validLists.map((list, index) => {
          const validOptions = list.options.filter(
            (option) => option.value && option.value.trim() !== ""
          );

          const fieldKey = `list-${index}`;
          const isMultiSelect = list.multiSelect === true;
          const allowCustomValues = list.allowCustomValues === true;

          // Se permite valores personalizados, usar Autocomplete
          if (allowCustomValues) {
            const optionValues = validOptions.map(option => option.value);
            
            return (
              <Autocomplete
                key={fieldKey}
                multiple={isMultiSelect}
                freeSolo
                options={optionValues}
                value={isMultiSelect ? (selectedValues[fieldKey] || []) : (selectedValues[fieldKey] || "")}
                onChange={(event, newValue) => {
                  setSelectedValues(prev => ({
                    ...prev,
                    [fieldKey]: newValue
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      size="small"
                      sx={{
                        bgcolor: isDarkMode ? 'primary.dark' : 'primary.light',
                        color: isDarkMode ? 'primary.contrastText' : 'primary.contrastText'
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`${list.name} ${isMultiSelect ? "(Múltipla seleção)" : ""} - Valores personalizados`}
                    placeholder={isMultiSelect ? "Selecione ou digite valores..." : "Selecione ou digite um valor..."}
                  />
                )}
              />
            );
          }

          // Caso contrário, usar Select tradicional
          return (
            <FormControl key={fieldKey} fullWidth>
              <InputLabel id={`select-label-${index}`}>
                {list.name} {isMultiSelect && "(Múltipla seleção)"}
              </InputLabel>
              <Select
                labelId={`select-label-${index}`}
                id={`select-${index}`}
                multiple={isMultiSelect}
                value={isMultiSelect ? (selectedValues[fieldKey] || []) : (selectedValues[fieldKey] || "")}
                label={`${list.name} ${isMultiSelect ? "(Múltipla seleção)" : ""}`}
                onChange={isMultiSelect ? handleMultiSelectChange(fieldKey) : handleSelectChange(fieldKey)}
                input={isMultiSelect ? <OutlinedInput label={`${list.name} (Múltipla seleção)`} /> : undefined}
                renderValue={isMultiSelect ? (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        size="small"
                        sx={{
                          bgcolor: isDarkMode ? 'primary.dark' : 'primary.light',
                          color: isDarkMode ? 'primary.contrastText' : 'primary.contrastText'
                        }}
                      />
                    ))}
                  </Box>
                ) : undefined}
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

        {/* Renderizar campos de data válidos */}
        {validDateFields.map((field, index) => (
          <TextField
            key={`date-${index}`}
            fullWidth
            label={field.name}
            variant="outlined"
            type={field.dateType || "date"}
            value={selectedValues[`date-${index}`] || ""}
            onChange={handleInputChange(`date-${index}`)}
            placeholder={getPlaceholderForDateType(field.dateType || "date")}
            helperText={field.helperText}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        ))}

        {/* Renderizar campos de imagem válidos */}
        {validImageFields.map((field, index) => {
          const fieldKey = `image-${index}`;
          const isDragging = dragStates[fieldKey];
          const files = uploadedFiles[fieldKey] || [];
          
          return (
            <Box key={fieldKey} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {field.name} {field.required && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              
              <Box
                onDragOver={handleDragOver(fieldKey)}
                onDragEnter={handleDragEnter(fieldKey)}
                onDragLeave={handleDragLeave(fieldKey)}
                onDrop={handleDrop(fieldKey, field)}
                sx={{
                  border: `2px dashed ${
                    isDragging 
                      ? 'primary.main' 
                      : isDarkMode ? 'grey.600' : 'grey.400'
                  }`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: isDragging 
                    ? (isDarkMode ? 'primary.dark' : 'primary.light')
                    : (isDarkMode ? 'grey.800' : 'grey.50'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    bgcolor: isDragging 
                      ? (isDarkMode ? 'primary.dark' : 'primary.light')
                      : (isDarkMode ? 'grey.700' : 'grey.100'),
                    borderColor: 'primary.main',
                  }
                }}
              >
                <CloudUpload 
                  sx={{ 
                    fontSize: 40, 
                    color: isDragging 
                      ? 'primary.contrastText'
                      : (isDarkMode ? 'grey.500' : 'grey.600'),
                    mb: 1 
                  }} 
                />
                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{
                    color: isDragging ? 'primary.contrastText' : 'inherit'
                  }}
                >
                  {isDragging 
                    ? 'Solte as imagens aqui!' 
                    : (field.allowMultiple ? 'Arraste e solte imagens aqui ou clique para selecionar' : 'Arraste e solte uma imagem aqui ou clique para selecionar')
                  }
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  size="small"
                  sx={{
                    color: isDragging ? 'primary.contrastText' : 'inherit',
                    borderColor: isDragging ? 'primary.contrastText' : 'inherit'
                  }}
                >
                  Escolher Arquivo{field.allowMultiple ? 's' : ''}
                  <input
                    type="file"
                    hidden
                    multiple={field.allowMultiple}
                    accept={field.acceptedFormats?.join(',') || 'image/*'}
                    onChange={handleFileSelect(fieldKey, field)}
                  />
                </Button>
                {field.helperText && (
                  <Typography 
                    variant="caption" 
                    display="block" 
                    sx={{ 
                      mt: 1, 
                      color: isDragging ? 'primary.contrastText' : 'text.secondary' 
                    }}
                  >
                    {field.helperText}
                  </Typography>
                )}
                <Typography 
                  variant="caption" 
                  display="block" 
                  sx={{ 
                    mt: 1, 
                    color: isDragging ? 'primary.contrastText' : 'text.secondary' 
                  }}
                >
                  Tamanho máximo: {field.maxFileSize || 5}MB
                </Typography>
              </Box>

              {/* Lista de arquivos selecionados */}
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Arquivos selecionados:
                  </Typography>
                  {files.map((file, fileIndex) => (
                    <Box 
                      key={fileIndex}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 1,
                        mb: 1,
                        bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeFile(fieldKey, fileIndex)}
                      >
                        Remover
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
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