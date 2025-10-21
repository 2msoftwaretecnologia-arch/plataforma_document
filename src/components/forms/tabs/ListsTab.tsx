import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import ListInput from "../ListInput";
import { FormData } from "../../../types/formTypes";

interface ListsTabProps {
  control: Control<FormData>;
}

export default function ListsTab({ control }: ListsTabProps) {
  const {
    fields: listFields,
    append: appendList,
    remove: removeList,
  } = useFieldArray({
    control,
    name: "lists",
  });

  const addNewList = () => {
    appendList({
      name: "",
      options: [{ value: "" }],
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Listas de Opções
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Crie listas com múltiplas opções que os usuários poderão selecionar.
      </Typography>
      
      {listFields.map((field, index) => (
        <ListInput
          key={field.id}
          control={control}
          index={index}
          onRemove={() => removeList(index)}
        />
      ))}

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Button
          onClick={addNewList}
          startIcon={<Add />}
          variant="outlined"
          size="large"
          sx={{ minWidth: 200 }}
        >
          Adicionar Lista
        </Button>
      </Box>
    </Box>
  );
}