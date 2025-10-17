"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { Add, Save, Preview } from "@mui/icons-material";
import ListInput from "./ListInput";
import FormPreview from "./FormPreview";

// Schema de validação
const listOptionSchema = z.object({
  value: z.string().min(1, "Valor da opção é obrigatório"),
});

const listSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório"),
  options: z.array(listOptionSchema).min(1, "Pelo menos uma opção é necessária"),
});

const formSchema = z.object({
  lists: z.array(listSchema).min(1, "Pelo menos uma lista é necessária"),
});

type FormData = z.infer<typeof formSchema>;

interface DynamicListBuilderProps {
  onSave?: (data: FormData) => void;
  onPreview?: (data: FormData) => void;
  initialData?: FormData;
}

export default function DynamicListBuilder({
  onSave,
  onPreview,
  initialData,
}: DynamicListBuilderProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      lists: [
        {
          name: "",
          options: [{ value: "" }],
        },
      ],
    },
    mode: "onChange",
  });

  const {
    fields: listFields,
    append: appendList,
    remove: removeList,
  } = useFieldArray({
    control,
    name: "lists",
  });

  const watchedLists = watch("lists");

  const addNewList = () => {
    appendList({
      name: "",
      options: [{ value: "" }],
    });
  };

  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    if (onSave) {
      onSave(data);
    }
  };

  const handlePreview = () => {
    const currentData = watch();
    if (onPreview) {
      onPreview(currentData);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Construtor de Listas Dinâmicas
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Crie quantas listas de opções você precisar para seu formulário. 
          Cada lista pode ter múltiplas opções que os usuários poderão selecionar.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Exibir erros gerais */}
          {errors.lists && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.lists.message}
            </Alert>
          )}

          {/* Lista de componentes ListInput */}
          <Box sx={{ mb: 4 }}>
            {listFields.map((field, index) => (
              <ListInput
                key={field.id}
                control={control}
                index={index}
                onRemove={() => removeList(index)}
              />
            ))}
          </Box>

          {/* Botão para adicionar nova lista */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Button
              onClick={addNewList}
              startIcon={<Add />}
              variant="outlined"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Adicionar Nova Lista
            </Button>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Preview do Formulário */}
          <FormPreview lists={watchedLists} />

          <Divider sx={{ my: 4, borderColor: isDarkMode ? 'grey.700' : 'grey.300' }} />

          {/* Preview dos dados JSON */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
              border: isDarkMode ? '1px solid' : 'none',
              borderColor: isDarkMode ? 'grey.700' : 'transparent'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: isDarkMode ? 'grey.200' : 'text.primary' }}
            >
              Dados JSON (Debug)
            </Typography>
            <pre 
              style={{ 
                fontSize: "12px", 
                overflow: "auto",
                color: isDarkMode ? '#e0e0e0' : '#333',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                border: isDarkMode ? '1px solid #444' : '1px solid #ddd'
              }}
            >
              {JSON.stringify(watchedLists, null, 2)}
            </pre>
          </Paper>

          {/* Botões de ação */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              onClick={handlePreview}
              startIcon={<Preview />}
              variant="outlined"
              size="large"
              disabled={!isValid}
            >
              Visualizar
            </Button>
            
            <Button
              type="submit"
              startIcon={<Save />}
              variant="contained"
              size="large"
              disabled={!isValid}
            >
              Salvar Listas
            </Button>
          </Box>

          {/* Informações de validação */}
          {!isValid && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Complete todos os campos obrigatórios para habilitar as ações.
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}