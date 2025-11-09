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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";

interface NumberInputProps {
  control: Control<any>;
  index: number;
  onRemove: (index: number) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export default function NumberInput({
  control,
  index,
  onRemove,
  label = "Campo Numérico",
  placeholder = "Digite um número...",
  helperText = "Campo para entrada de valores numéricos",
}: NumberInputProps) {
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
        <Tooltip title="Remover campo numérico">
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
        name={`numberFields.${index}.name`}
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
            placeholder="Ex: Idade, Preço, Quantidade..."
            variant="outlined"
            error={!!error}
            helperText={error?.message || "Nome que aparecerá no formulário"}
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Linha com campos de valor mínimo e máximo */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Controller
          name={`numberFields.${index}.min`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Valor Mínimo"
              type="number"
              variant="outlined"
              placeholder="0"
              helperText="Valor mínimo permitido"
              sx={{ flex: 1 }}
            />
          )}
        />

        <Controller
          name={`numberFields.${index}.max`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Valor Máximo"
              type="number"
              variant="outlined"
              placeholder="100"
              helperText="Valor máximo permitido"
              sx={{ flex: 1 }}
            />
          )}
        />
      </Box>

      {/* Valor padrão */}
      <Controller
        name={`numberFields.${index}.value`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Valor Padrão (Opcional)"
            type="number"
            variant="outlined"
            placeholder={placeholder}
            helperText="Valor que aparecerá pré-preenchido no campo"
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Switches para configurações */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Controller
          name={`numberFields.${index}.allowDecimals`}
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
              label="Permitir números decimais"
            />
          )}
        />

        <Controller
          name={`numberFields.${index}.required`}
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
    </Paper>
  );
}