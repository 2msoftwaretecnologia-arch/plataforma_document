import React from "react";
import { TextField } from "@mui/material";
import { NumberFieldData, FieldProps } from '@/modules/forms/types';

interface NumberFieldComponentProps extends FieldProps {
  field: NumberFieldData;
}

export default function NumberFieldComponent({ 
  field, 
  index, 
  selectedValues, 
  onValueChange 
}: NumberFieldComponentProps) {
  const fieldKey = `number-${index}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(fieldKey, event.target.value);
  };

  return (
    <TextField
      fullWidth
      label={field.name}
      variant="outlined"
      type="number"
      value={selectedValues[fieldKey] || ""}
      onChange={handleInputChange}
      placeholder={`Digite ${field.name.toLowerCase()}...`}
      inputProps={{
        min: field.min,
        max: field.max,
        step: field.allowDecimals ? "any" : "1",
      }}
      required={field.required}
      helperText={
        field.min !== undefined && field.max !== undefined
          ? `Valor entre ${field.min} e ${field.max}`
          : field.min !== undefined
          ? `Valor mínimo: ${field.min}`
          : field.max !== undefined
          ? `Valor máximo: ${field.max}`
          : undefined
      }
    />
  );
}