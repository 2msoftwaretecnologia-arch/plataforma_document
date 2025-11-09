"use client";

import React from "react";
import {
  Paper,
  TextField,
  Typography,
  Box,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";

interface TextInputProps {
  control: Control<any>;
  index: number;
  onRemove: (index: number) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export default function TextInput({
  control,
  index,
  onRemove,
  label = "Campo de Texto",
  placeholder = "Digite o texto...",
  helperText = "Campo para entrada de texto livre",
}: TextInputProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
        border: isDarkMode ? '1px solid' : 'none',
        borderColor: isDarkMode ? 'grey.700' : 'transparent',
        position: 'relative',
      }}
    >
      {/* Cabeçalho com título e botão de remover */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3" color="primary">
          {label} #{index + 1}
        </Typography>
        <Tooltip title="Remover campo de texto">
          <IconButton
            onClick={() => onRemove(index)}
            color="error"
            size="small"
            sx={{
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText',
              }
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Campo de nome/identificador */}
      <Controller
        name={`textFields.${index}.name`}
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
            placeholder="Ex: Descrição, Comentários, Observações..."
            variant="outlined"
            error={!!error}
            helperText={error?.message || "Nome que aparecerá no formulário"}
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Campo de valor padrão (opcional) */}
      <Controller
        name={`textFields.${index}.value`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Valor Padrão (Opcional)"
            placeholder={placeholder}
            variant="outlined"
            multiline
            rows={3}
            helperText="Texto que aparecerá pré-preenchido no campo"
          />
        )}
      />
    </Paper>
  );
}