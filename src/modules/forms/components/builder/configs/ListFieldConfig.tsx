"use client";

import React, { useState } from "react";
import {
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { ListData } from "@/modules/forms/types";

interface ListFieldConfigProps {
  config: Partial<ListData>;
  onChange: (config: Partial<ListData>) => void;
}

export default function ListFieldConfig({ config, onChange }: ListFieldConfigProps) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (!newOption.trim()) return;
    const options = [...(config.options || []), { value: newOption.trim() }];
    onChange({ ...config, options });
    setNewOption('');
  };

  const removeOption = (index: number) => {
    const options = config.options?.filter((_, i) => i !== index) || [];
    onChange({ ...config, options });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          label="Nova Opção"
          placeholder="Digite uma opção..."
          variant="outlined"
          size="small"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOption()}
        />
        <Button
          variant="contained"
          onClick={addOption}
          startIcon={<Add />}
          disabled={!newOption.trim()}
        >
          Adicionar
        </Button>
      </Box>

      {config.options && config.options.length > 0 && (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
          <List dense>
            {config.options.map((option, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeOption(index)} size="small">
                    <Delete />
                  </IconButton>
                }
              >
                <Chip label={option.value} size="small" sx={{ mr: 1 }} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.multiSelect ?? false}
              onChange={(e) => onChange({ ...config, multiSelect: e.target.checked })}
            />
          }
          label="Seleção Múltipla"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.allowCustomValues ?? false}
              onChange={(e) => onChange({ ...config, allowCustomValues: e.target.checked })}
            />
          }
          label="Permitir Valores Personalizados"
        />
      </Box>
    </Box>
  );
}
