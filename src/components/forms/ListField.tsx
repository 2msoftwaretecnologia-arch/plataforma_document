import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  OutlinedInput,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import { ListData, FieldProps } from './types';

interface ListFieldProps extends FieldProps {
  field: ListData;
}

export default function ListField({ 
  field, 
  index, 
  selectedValues, 
  onValueChange, 
  isDarkMode 
}: ListFieldProps) {
  const validOptions = field.options.filter(
    (option) => option.value && option.value.trim() !== ""
  );

  const fieldKey = `list-${index}`;
  const isMultiSelect = field.multiSelect === true;
  const allowCustomValues = field.allowCustomValues === true;

  // Handler para mudanças nos selects (seleção única)
  const handleSelectChange = (event: SelectChangeEvent) => {
    onValueChange(fieldKey, event.target.value);
  };

  // Handler para mudanças nos selects múltiplos
  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onValueChange(fieldKey, typeof value === 'string' ? value.split(',') : value);
  };

  // Se permite valores personalizados, usar Autocomplete
  if (allowCustomValues) {
    const optionValues = validOptions.map(option => option.value);
    
    return (
      <Autocomplete
        multiple={isMultiSelect}
        freeSolo
        options={optionValues}
        value={isMultiSelect ? (selectedValues[fieldKey] || []) : (selectedValues[fieldKey] || "")}
        onChange={(event, newValue) => {
          onValueChange(fieldKey, newValue);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={index}
              label={option}
              size="small"
              sx={{
                bgcolor: isDarkMode ? 'primary.dark' : 'primary.light',
                color: isDarkMode ? 'primary.contrastText' : 'primary.contrastText'
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={`${field.name} ${isMultiSelect ? "(Múltipla seleção)" : ""} - Valores personalizados`}
            placeholder={isMultiSelect ? "Selecione ou digite valores..." : "Selecione ou digite um valor..."}
          />
        )}
      />
    );
  }

  // Caso contrário, usar Select tradicional
  return (
    <FormControl fullWidth>
      <InputLabel id={`select-label-${index}`}>
        {field.name} {isMultiSelect && "(Múltipla seleção)"}
      </InputLabel>
      <Select
        labelId={`select-label-${index}`}
        id={`select-${index}`}
        multiple={isMultiSelect}
        value={isMultiSelect ? (selectedValues[fieldKey] || []) : (selectedValues[fieldKey] || "")}
        label={`${field.name} ${isMultiSelect ? "(Múltipla seleção)" : ""}`}
        onChange={isMultiSelect ? handleMultiSelectChange : handleSelectChange}
        input={isMultiSelect ? <OutlinedInput label={`${field.name} (Múltipla seleção)`} /> : undefined}
        renderValue={isMultiSelect ? (selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((value) => (
              <Chip 
                key={value} 
                label={value} 
                size="small"
                sx={{
                  bgcolor: isDarkMode ? 'primary.dark' : 'primary.light',
                  color: isDarkMode ? 'primary.contrastText' : 'primary.contrastText'
                }}
              />
            ))}
          </Box>
        ) : undefined}
      >
        {validOptions.map((option, optionIndex) => (
          <MenuItem key={optionIndex} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}