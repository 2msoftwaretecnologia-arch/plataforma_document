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
import { Add, CalendarToday } from "@mui/icons-material";
import { Control, useFieldArray } from "react-hook-form";
import DateInput from "../DateInput";

interface DateFieldsTabProps {
  control: Control<any>;
}

// Função para gerar valores padrão baseados no tipo de data
const getDefaultValueForDateType = (dateType: string): string => {
  const now = new Date();
  
  switch (dateType) {
    case "date":
      return now.toISOString().split('T')[0]; // YYYY-MM-DD
    case "datetime-local":
      const datetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      return datetime.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    case "time":
      return now.toTimeString().slice(0, 5); // HH:MM
    case "month":
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    default:
      return "";
  }
};

export default function DateFieldsTab({ control }: DateFieldsTabProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dateFields",
  });

  const addDateField = () => {
    const defaultDateType = "date";
    append({
      name: "",
      dateType: defaultDateType,
      value: "",
      minDate: "",
      maxDate: "",
      required: false,
      helperText: "",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho da aba */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: isDarkMode ? 'grey.900' : 'primary.50',
          border: isDarkMode ? '1px solid' : 'none',
          borderColor: isDarkMode ? 'grey.700' : 'transparent',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" color="primary">
            Campos de Data
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Adicione campos de data ao seu formulário. Suporte para diferentes tipos:
          data completa, data e hora, apenas horário, mês/ano e semana.
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addDateField}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Adicionar Campo de Data
        </Button>
      </Paper>

      {/* Lista de campos de data */}
      {fields.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Campos Configurados ({fields.length})
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {fields.map((field, index) => (
          <DateInput
            key={field.id}
            control={control}
            index={index}
            onRemove={remove}
          />
        ))}
      </Box>

      {/* Mensagem quando não há campos */}
      {fields.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
            border: '2px dashed',
            borderColor: isDarkMode ? 'grey.700' : 'grey.300',
          }}
        >
          <CalendarToday
            sx={{
              fontSize: 48,
              color: 'text.disabled',
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Nenhum campo de data adicionado
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Clique no botão "Adicionar Campo de Data" para começar a criar campos de data para seu formulário.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addDateField}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.50',
                borderColor: 'primary.dark',
              },
            }}
          >
            Adicionar Primeiro Campo
          </Button>
        </Paper>
      )}
    </Box>
  );
}