import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import NumberInput from "../../inputs/NumberInput";
import { FormData } from "../../../../types/formTypes";

interface NumberFieldsTabProps {
  control: Control<FormData>;
}

export default function NumberFieldsTab({ control }: NumberFieldsTabProps) {
  const {
    fields: numberFields,
    append: appendNumberField,
    remove: removeNumberField,
  } = useFieldArray({
    control,
    name: "numberFields",
  });

  const addNewNumberField = () => {
    appendNumberField({
      name: "",
      value: undefined,
      min: undefined,
      max: undefined,
      allowDecimals: true,
      required: false,
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Campos Numéricos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Crie campos para entrada de números, com validação e configurações personalizadas.
      </Typography>
      
      {numberFields.map((field, index) => (
        <NumberInput
          key={field.id}
          control={control}
          index={index}
          onRemove={() => removeNumberField(index)}
        />
      ))}

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Button
          onClick={addNewNumberField}
          startIcon={<Add />}
          variant="outlined"
          size="large"
          sx={{ minWidth: 200 }}
        >
          Adicionar Campo Numérico
        </Button>
      </Box>
    </Box>
  );
}