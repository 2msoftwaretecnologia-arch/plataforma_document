import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { ImageFieldData, ImageFieldProps } from './types';

export default function ImageFieldComponent({ 
  field, 
  index, 
  selectedValues, 
  onValueChange, 
  isDarkMode,
  dragStates,
  uploadedFiles,
  onDragStateChange,
  onFilesChange
}: ImageFieldProps) {
  const fieldKey = `image-${index}`;
  const isDragging = dragStates[fieldKey];
  const files = uploadedFiles[fieldKey] || [];

  // Handlers para drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDragStateChange(fieldKey, true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Só remove o estado se realmente saiu da área
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      onDragStateChange(fieldKey, false);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDragStateChange(fieldKey, false);

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
          onFilesChange(fieldKey, [...files, ...validFiles]);
        } else {
          onFilesChange(fieldKey, [validFiles[0]]);
        }
      }
      
      // Mostra feedback se alguns arquivos foram rejeitados
      const rejectedCount = allFiles.length - validFiles.length;
      if (rejectedCount > 0) {
        console.warn(`${rejectedCount} arquivo(s) foram rejeitados por excederem o tamanho máximo de ${field.maxFileSize || 5}MB`);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      if (field.allowMultiple) {
        onFilesChange(fieldKey, [...files, ...selectedFiles]);
      } else {
        onFilesChange(fieldKey, [selectedFiles[0]]);
      }
    }
  };

  const removeFile = (fileIndex: number) => {
    const updatedFiles = files.filter((_, index) => index !== fileIndex);
    onFilesChange(fieldKey, updatedFiles);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {field.name} {field.required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      
      <Box
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
            onChange={handleFileSelect}
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
          {field.acceptedFormats && ` • Formatos: ${field.acceptedFormats.join(', ')}`}
        </Typography>
      </Box>

      {/* Lista de arquivos selecionados */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Arquivos selecionados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {files.map((file, fileIndex) => (
              <Chip
                key={fileIndex}
                label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`}
                onDelete={() => removeFile(fileIndex)}
                deleteIcon={<Close />}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}