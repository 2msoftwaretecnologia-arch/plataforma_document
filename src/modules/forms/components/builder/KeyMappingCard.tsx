"use client";

import type { FieldType, KeyFieldMapping } from "@/modules/forms/types";
import { CalendarMonth, CheckCircle, Image as ImageIcon, List as ListIcon, Numbers, TextFields, Warning } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import DateFieldConfig from "./configs/DateFieldConfig";
import ImageFieldConfig from "./configs/ImageFieldConfig";
import ListFieldConfig from "./configs/ListFieldConfig";
import NumberFieldConfig from "./configs/NumberFieldConfig";
import TextFieldConfig from "./configs/TextFieldConfig";

interface KeyMappingCardProps {
  mapping: KeyFieldMapping;
  onFieldTypeChange: (fieldType: FieldType, config?: KeyFieldMapping['formFieldConfig']) => void;
  onConfigChange: (config: KeyFieldMapping['formFieldConfig']) => void;
}

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <TextFields fontSize="small" />,
  number: <Numbers fontSize="small" />,
  date: <CalendarMonth fontSize="small" />,
  list: <ListIcon fontSize="small" />,
  image: <ImageIcon fontSize="small" />,
};

const keyTypeLabels: Record<string, string> = {
  texto: 'Texto',
  numero: 'Número',
  data: 'Data',
  email: 'E-mail',
};

export default function KeyMappingCard({
  mapping,
  onFieldTypeChange,
  onConfigChange,
}: KeyMappingCardProps) {
  const isConfigured = !!mapping.formFieldType && !!mapping.formFieldConfig;

  const handleFieldTypeChange = (newType: FieldType) => {
    console.log('KeyMappingCard: handleFieldTypeChange called with:', newType);

    // Initialize default config based on field type
    let defaultConfig: KeyFieldMapping['formFieldConfig'];

    switch (newType) {
      case 'text':
        defaultConfig = { name: mapping.chaveNome, value: '' };
        break;
      case 'number':
        defaultConfig = {
          name: mapping.chaveNome,
          required: mapping.chaveObrigatoria,
          allowDecimals: true,
        };
        break;
      case 'date':
        defaultConfig = {
          name: mapping.chaveNome,
          dateType: 'date',
          required: mapping.chaveObrigatoria,
        };
        break;
      case 'list':
        defaultConfig = {
          name: mapping.chaveNome,
          options: [],
          multiSelect: false,
        };
        break;
      case 'image':
        defaultConfig = {
          name: mapping.chaveNome,
          allowMultiple: false,
          required: mapping.chaveObrigatoria,
          maxFileSize: 5,
          acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        };
        break;
      default:
        defaultConfig = { name: mapping.chaveNome };
    }

    console.log('KeyMappingCard: Calling onFieldTypeChange with config:', defaultConfig);
    onFieldTypeChange(newType, defaultConfig);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: isConfigured ? 'success.main' : 'warning.main',
        borderWidth: 2,
      }}
    >
      <CardHeader
        avatar={
          isConfigured ? (
            <CheckCircle color="success" />
          ) : (
            <Warning color="warning" />
          )
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{mapping.chaveNome}</Typography>
            {mapping.chaveObrigatoria && (
              <Chip label="Obrigatório" size="small" color="error" />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip
              label={keyTypeLabels[mapping.chaveTipo] || mapping.chaveTipo}
              size="small"
              variant="outlined"
            />
            {isConfigured && mapping.formFieldType && (
              <Chip
                label={`Campo: ${mapping.formFieldType}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        }
      />

      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id={`field-type-label-${mapping.chaveNome}`}>Tipo de Campo do Formulário</InputLabel>
          <Select
            labelId={`field-type-label-${mapping.chaveNome}`}
            id={`field-type-select-${mapping.chaveNome}`}
            value={mapping.formFieldType || ''}
            label="Tipo de Campo do Formulário"
            onChange={(e) => handleFieldTypeChange(e.target.value as FieldType)}
          >
            <MenuItem value="text">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextFields fontSize="small" />
                Campo de Texto
              </Box>
            </MenuItem>
            <MenuItem value="number">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Numbers fontSize="small" />
                Campo Numérico
              </Box>
            </MenuItem>
            <MenuItem value="date">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth fontSize="small" />
                Campo de Data
              </Box>
            </MenuItem>
            <MenuItem value="list">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ListIcon fontSize="small" />
                Lista de Seleção
              </Box>
            </MenuItem>
            <MenuItem value="image">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon fontSize="small" />
                Upload de Imagem
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Collapse in={!!mapping.formFieldType && !!mapping.formFieldConfig}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2 }} color="primary">
              Configuração do Campo
            </Typography>

            {mapping.formFieldType === 'text' && mapping.formFieldConfig && (
              <TextFieldConfig
                config={mapping.formFieldConfig as Partial<import('@/modules/forms/types').TextFieldData>}
                onChange={(c) => onConfigChange(c as typeof mapping.formFieldConfig)}
              />
            )}

            {mapping.formFieldType === 'number' && mapping.formFieldConfig && (
              <NumberFieldConfig
                config={mapping.formFieldConfig as Partial<import('@/modules/forms/types').NumberFieldData>}
                onChange={(c) => onConfigChange(c as typeof mapping.formFieldConfig)}
              />
            )}

            {mapping.formFieldType === 'date' && mapping.formFieldConfig && (
              <DateFieldConfig
                config={mapping.formFieldConfig as Partial<import('@/modules/forms/types').DateFieldData>}
                onChange={(c) => onConfigChange(c as typeof mapping.formFieldConfig)}
              />
            )}

            {mapping.formFieldType === 'list' && mapping.formFieldConfig && (
              <ListFieldConfig
                config={mapping.formFieldConfig as Partial<import('@/modules/forms/types').ListData>}
                onChange={(c) => onConfigChange(c as typeof mapping.formFieldConfig)}
              />
            )}

            {mapping.formFieldType === 'image' && mapping.formFieldConfig && (
              <ImageFieldConfig
                config={mapping.formFieldConfig as Partial<import('@/modules/forms/types').ImageFieldData>}
                onChange={(c) => onConfigChange(c as typeof mapping.formFieldConfig)}
              />
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
