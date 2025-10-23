"use client";

import React from "react";
import {
  Paper,
  TextField,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  Alert,
} from "@mui/material";
import { Delete, CloudUpload, Image as ImageIcon } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";

interface ImageInputProps {
  control: Control<any>;
  index: number;
  onRemove: () => void;
}

export default function ImageInput({ control, index, onRemove }: ImageInputProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        mb: 2, 
        position: "relative",
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
        border: isDarkMode ? '1px solid' : 'none',
        borderColor: isDarkMode ? 'grey.700' : 'transparent'
      }}
    >
      {/* Cabeçalho com título e botão de remover */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ImageIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h3">
            Campo de Imagem #{index + 1}
          </Typography>
        </Box>
        <Tooltip title="Remover campo de imagem">
          <IconButton 
            onClick={onRemove} 
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Campo de nome */}
      <Controller
        name={`imageFields.${index}.name`}
        control={control}
        defaultValue=""
        rules={{
          required: "Nome do campo é obrigatório",
          minLength: {
            value: 2,
            message: "Nome deve ter pelo menos 2 caracteres"
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            label="Nome do Campo"
            placeholder="Ex: Foto do Produto, Imagem de Perfil, Anexos..."
            variant="outlined"
            error={!!error}
            helperText={error?.message || "Nome que aparecerá no formulário"}
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Switch para permitir múltiplas imagens */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name={`imageFields.${index}.allowMultiple`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Permitir Múltiplas Imagens
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? 'grey.400' : 'text.secondary',
                      display: 'block'
                    }}
                  >
                    Permite que o usuário selecione mais de uma imagem
                  </Typography>
                </Box>
              }
              sx={{ 
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  ml: 1
                }
              }}
            />
          )}
        />
      </Box>

      {/* Switch para campo obrigatório */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name={`imageFields.${index}.required`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  color="primary"
                />
              }
              label="Campo obrigatório"
            />
          )}
        />
      </Box>

      {/* Campo de texto de ajuda */}
      <Controller
        name={`imageFields.${index}.helperText`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Texto de Ajuda (Opcional)"
            placeholder="Ex: Selecione uma imagem em formato JPG ou PNG..."
            variant="outlined"
            multiline
            rows={2}
            helperText="Texto que aparecerá abaixo do campo para orientar o usuário"
            sx={{ mb: 3 }}
          />
        )}
      />

    
      {/* Informações sobre formatos aceitos */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Formatos aceitos:</strong> JPG, PNG, GIF, WebP
        </Typography>
        <Typography variant="body2">
          <strong>Tamanho máximo:</strong> 5MB por arquivo
        </Typography>
      </Alert>
    </Paper>
  );
}