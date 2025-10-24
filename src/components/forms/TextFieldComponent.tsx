import React from "react";
import { TextField } from "@mui/material";
import { TextFieldData, FieldProps } from './types';

interface TextFieldComponentProps extends FieldProps {
  field: TextFieldData;
}

export default function TextFieldComponent({ 
  field, 
  index, 
  selectedValues, 
  onValueChange 
}: TextFieldComponentProps) {
  const fieldKey = `text-${index}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(fieldKey, event.target.value);
  };

  return (
    <TextField
      fullWidth
      label={field.name}
      variant="outlined"
      multiline
      rows={3}
      value={selectedValues[fieldKey] || ""}
      onChange={handleInputChange}
      placeholder={`Digite ${field.name.toLowerCase()}...`}
    />
  );
}