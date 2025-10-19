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
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Save, Preview, TextFields, Numbers, List } from "@mui/icons-material";
import ListInput from "./ListInput";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import FormPreview from "./FormPreview";

// Schema de validação
const listOptionSchema = z.object({
  value: z.string().min(1, "Valor da opção é obrigatório"),
});

const listSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório"),
  options: z.array(listOptionSchema).min(1, "Pelo menos uma opção é necessária"),
});

const textFieldSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  value: z.string().optional(),
});

const numberFieldSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  allowDecimals: z.boolean().optional(),
  required: z.boolean().optional(),
});

const formSchema = z.object({
  lists: z.array(listSchema).optional(),
  textFields: z.array(textFieldSchema).optional(),
  numberFields: z.array(numberFieldSchema).optional(),
}).refine(
  (data) => {
    const hasLists = data.lists && data.lists.length > 0;
    const hasTextFields = data.textFields && data.textFields.length > 0;
    const hasNumberFields = data.numberFields && data.numberFields.length > 0;
    return hasLists || hasTextFields || hasNumberFields;
  },
  {
    message: "Pelo menos um campo (lista, texto ou número) deve ser adicionado",
  }
);

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
  const [activeTab, setActiveTab] = React.useState(0);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      lists: [],
      textFields: [],
      numberFields: [],
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

  const {
    fields: textFields,
    append: appendTextField,
    remove: removeTextField,
  } = useFieldArray({
    control,
    name: "textFields",
  });

  const {
    fields: numberFields,
    append: appendNumberField,
    remove: removeNumberField,
  } = useFieldArray({
    control,
    name: "numberFields",
  });

  const watchedData = watch();

  const addNewList = () => {
    appendList({
      name: "",
      options: [{ value: "" }],
    });
  };

  const addNewTextField = () => {
    appendTextField({
      name: "",
      value: "",
    });
  };

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Construtor de Formulários Dinâmicos
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Crie campos de diferentes tipos para seu formulário: listas de opções, campos de texto e campos numéricos.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Exibir erros gerais */}
          {errors.root && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.root.message}
            </Alert>
          )}

          {/* Tabs para diferentes tipos de campos */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="field types">
              <Tab 
                icon={<List />} 
                label="Listas" 
                sx={{ minHeight: 48 }}
              />
              <Tab 
                icon={<TextFields />} 
                label="Campos de Texto" 
                sx={{ minHeight: 48 }}
              />
              <Tab 
                icon={<Numbers />} 
                label="Campos Numéricos" 
                sx={{ minHeight: 48 }}
              />
            </Tabs>
          </Box>

          {/* Conteúdo das tabs */}
          {activeTab === 0 && (
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
          )}

          {activeTab === 1 && (
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
          )}

          {activeTab === 2 && (
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
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Preview do Formulário */}
          <FormPreview 
            lists={watchedData.lists || []} 
            textFields={watchedData.textFields || []}
            numberFields={watchedData.numberFields || []}
          />

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
              {JSON.stringify(watchedData, null, 2)}
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
              Salvar Formulário
            </Button>
          </Box>

          {/* Informações de validação */}
          {!isValid && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Adicione pelo menos um campo para habilitar as ações.
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}