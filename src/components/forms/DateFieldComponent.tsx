import React from "react";
import { TextField } from "@mui/material";
import { DateFieldData, FieldProps } from './types';
import { getPlaceholderForDateType } from './utils';

interface DateFieldComponentProps extends FieldProps {
  field: DateFieldData;
}

export default function DateFieldComponent({ 
  field, 
  index, 
  selectedValues, 
  onValueChange 
}: DateFieldComponentProps) {
  const fieldKey = `date-${index}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(fieldKey, event.target.value);
  };

  return (
    <TextField
      fullWidth
      label={field.name}
      variant="outlined"
      type={field.dateType || "date"}
      value={selectedValues[fieldKey] || ""}
      onChange={handleInputChange}
      placeholder={getPlaceholderForDateType(field.dateType || "date")}
      helperText={field.helperText}
      required={field.required}
      InputLabelProps={{ shrink: true }}
    />
  );
}