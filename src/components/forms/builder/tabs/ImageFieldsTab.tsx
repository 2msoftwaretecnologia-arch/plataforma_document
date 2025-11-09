"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import { Add, Image as ImageIcon } from "@mui/icons-material";
import { Control, useFieldArray } from "react-hook-form";
import ImageInput from "../../inputs/ImageInput";

interface ImageFieldsTabProps {
  control: Control<any>;
}

export default function ImageFieldsTab({ control }: ImageFieldsTabProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imageFields",
  });

  const addImageField = () => {
    append({
      name: "",
      allowMultiple: false,
      required: false,
      helperText: "",
      acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      maxFileSize: 5,
    });
  };

  return (
    <Box>
      {/* Cabeçalho da seção */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
          border: isDarkMode ? '1px solid' : 'none',
          borderColor: isDarkMode ? 'grey.700' : 'transparent'
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ImageIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h2">
            Campos de Imagem
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Crie campos para upload de imagens com suporte a múltiplos arquivos, 
          drag and drop e validação de formato.
        </Typography>

        <Button
          onClick={addImageField}
          startIcon={<Add />}
          variant="contained"
          size="large"
          fullWidth
        >
          Adicionar Campo de Imagem
        </Button>
      </Paper>

      {/* Lista de campos de imagem */}
      {fields.length > 0 && (
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              color: isDarkMode ? 'grey.200' : 'text.primary'
            }}
          >
            Campos Configurados ({fields.length})
          </Typography>
          
          {fields.map((field, index) => (
            <ImageInput
              key={field.id}
              control={control}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </Box>
      )}

      {/* Mensagem quando não há campos */}
      {fields.length === 0 && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            textAlign: "center",
            bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
            border: isDarkMode ? '1px solid' : 'none',
            borderColor: isDarkMode ? 'grey.700' : 'transparent'
          }}
        >
          <ImageIcon 
            sx={{ 
              fontSize: 64, 
              color: isDarkMode ? 'grey.600' : 'grey.400',
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum campo de imagem configurado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adicione campos de imagem para permitir que os usuários façam upload de arquivos.
          </Typography>
          <Button
            onClick={addImageField}
            startIcon={<Add />}
            variant="outlined"
            size="large"
          >
            Criar Primeiro Campo
          </Button>
        </Paper>
      )}

      {/* Informações adicionais */}
      {fields.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              bgcolor: isDarkMode ? 'info.dark' : 'info.light',
              border: `1px solid ${isDarkMode ? 'info.main' : 'info.main'}`,
              borderRadius: 1
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              💡 Dicas para Campos de Imagem:
            </Typography>
            <Typography variant="body2" component="div">
              • Use nomes descritivos como "Foto do Produto" ou "Avatar do Usuário"
              <br />
              • Ative "Múltiplas Imagens" para galerias ou anexos
              <br />
              • Configure textos de ajuda para orientar os usuários
              <br />
              • Campos obrigatórios devem ser marcados adequadamente
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}