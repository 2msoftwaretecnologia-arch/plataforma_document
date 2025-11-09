import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import TextInput from "../../inputs/TextInput";
import { FormData } from "../../../../types/formTypes";

interface TextFieldsTabProps {
  control: Control<FormData>;
}

export default function TextFieldsTab({ control }: TextFieldsTabProps) {
  const {
    fields: textFields,
    append: appendTextField,
    remove: removeTextField,
  } = useFieldArray({
    control,
    name: "textFields",
  });

  const addNewTextField = () => {
    appendTextField({
      name: "",
      value: "",
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Campos de Texto
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Adicione campos para entrada de texto livre, como descrições ou comentários.
      </Typography>
      
      {textFields.map((field, index) => (
        <TextInput
          key={field.id}
          control={control}
          index={index}
          onRemove={() => removeTextField(index)}
        />
      ))}

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Button
          onClick={addNewTextField}
          startIcon={<Add />}
          variant="outlined"
          size="large"
          sx={{ minWidth: 200 }}
        >
          Adicionar Campo de Texto
        </Button>
      </Box>
    </Box>
  );
}