"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import { Save, Visibility } from "@mui/icons-material";
import type { Template, TemplateFormField } from "@/modules/templates/types";
import type { KeyFieldMapping, FieldType } from "@/modules/forms/types";
import { chavesToKeyMappings, formularioToKeyMappings, keyMappingsToFormulario } from "@/modules/forms/mapper";
import KeyMappingCard from "./KeyMappingCard";

interface TemplateFormBuilderProps {
  template: Template;
  onSave: (formulario: TemplateFormField[]) => void;
  isLoading?: boolean;
}

export default function TemplateFormBuilder({
  template,
  onSave,
  isLoading = false,
}: TemplateFormBuilderProps) {
  const [mappings, setMappings] = useState<KeyFieldMapping[]>([]);

  // Initialize mappings on mount
  useEffect(() => {
    if (template.chaves && template.chaves.length > 0) {
      const initialMappings = template.formulario && template.formulario.length > 0
        ? formularioToKeyMappings(template.chaves, template.formulario)
        : chavesToKeyMappings(template.chaves);
      setMappings(initialMappings);
    }
  }, [template.chaves, template.formulario]);

  const completedMappings = mappings.filter(m => m.formFieldType && m.formFieldConfig).length;
  const totalMappings = mappings.length;
  const progress = totalMappings > 0 ? (completedMappings / totalMappings) * 100 : 0;
  const isFormValid = completedMappings === totalMappings && totalMappings > 0;

  const handleFieldTypeChange = (index: number, fieldType: FieldType, config?: KeyFieldMapping['formFieldConfig']) => {
    const newMappings = [...mappings];
    newMappings[index] = {
      ...newMappings[index],
      formFieldType: fieldType,
      ...(config && { formFieldConfig: config })
    };
    setMappings(newMappings);
    console.log('Field type changed:', { index, fieldType, config, newMapping: newMappings[index] });
  };

  const handleConfigChange = (index: number, config: KeyFieldMapping['formFieldConfig']) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], formFieldConfig: config };
    setMappings(newMappings);
    console.log('Config changed:', { index, config });
  };

  const handleSave = () => {
    const formulario = keyMappingsToFormulario(mappings);
    onSave(formulario);
  };

  if (!template.chaves || template.chaves.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Este template não possui chaves mapeadas. Por favor, mapeie o template primeiro.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Template Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {template.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {template.descricao}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={template.ativo ? 'Ativo' : 'Inativo'}
                color={template.ativo ? 'success' : 'default'}
                size="small"
              />
              <Chip
                label={`${totalMappings} ${totalMappings === 1 ? 'chave' : 'chaves'}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progresso: {completedMappings} de {totalMappings} chaves configuradas
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={isFormValid ? 'success' : 'primary'}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
      </Paper>

      {/* Mapping Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Configure os Campos do Formulário
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Para cada chave do template, selecione o tipo de campo do formulário e configure suas opções.
        </Typography>

        {mappings.map((mapping, index) => (
          <KeyMappingCard
            key={`${mapping.chaveNome}-${index}`}
            mapping={mapping}
            onFieldTypeChange={(fieldType, config) => handleFieldTypeChange(index, fieldType, config)}
            onConfigChange={(config) => handleConfigChange(index, config)}
          />
        ))}
      </Box>

      {/* Actions */}
      <Paper elevation={2} sx={{ p: 2, position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            disabled={!isFormValid}
          >
            Visualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Formulário'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
