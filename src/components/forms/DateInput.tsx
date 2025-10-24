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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Delete, CalendarToday } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";

interface DateInputProps {
  control: Control<any>;
  index: number;
  onRemove: (index: number) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export default function DateInput({
  control,
  index,
  onRemove,
  label = "Campo de Data",
  placeholder = "Selecione uma data...",
  helperText = "Campo para entrada de data",
}: DateInputProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const dateTypeOptions = [
    { value: "date", label: "Data (17/12/2024)", description: "Seleção de data completa no formato brasileiro" },
    { value: "datetime-local", label: "Data e Hora (17/12/2024 14:30)", description: "Data com horário específico no formato brasileiro" },
    { value: "time", label: "Horário (17:10)", description: "Apenas horário no formato brasileiro" },
    { value: "month", label: "Mês/Ano (12/2024)", description: "Seleção de mês e ano no formato brasileiro" },
  ];

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
          <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
          {label} #{index + 1}
        </Typography>
        <Tooltip title="Remover campo de data">
          <IconButton
            onClick={() => onRemove(index)}
            color="error"
            size="small"
            sx={{
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Nome do campo */}
      <Controller
        name={`dateFields.${index}.name`}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            label="Nome do Campo"
            placeholder="Ex: Data de Nascimento, Data do Evento..."
            error={!!error}
            helperText={error?.message || "Nome que aparecerá no formulário"}
            sx={{ mb: 2 }}
            variant="outlined"
          />
        )}
      />

      {/* Tipo de data */}
      <Controller
        name={`dateFields.${index}.dateType`}
        control={control}
        defaultValue="date"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth sx={{ mb: 2 }} error={!!error}>
            <InputLabel>Tipo de Data</InputLabel>
            <Select
              {...field}
              label="Tipo de Data"
            >
              {dateTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body1">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Texto de ajuda */}
      <Controller
        name={`dateFields.${index}.helperText`}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            label="Texto de Ajuda"
            placeholder="Ex: Insira sua data de nascimento"
            error={!!error}
            helperText={error?.message || "Texto que aparece abaixo do campo para orientar o usuário"}
            sx={{ mb: 2 }}
            variant="outlined"
          />
        )}
      />

      {/* Campo obrigatório */}
      <Controller
        name={`dateFields.${index}.required`}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <input
              type="checkbox"
              {...field}
              checked={field.value}
              style={{ marginRight: 8 }}
            />
            <Typography variant="body2" color="text.secondary">
              Campo obrigatório
            </Typography>
          </Box>
        )}
      />
    </Paper>
  );
}