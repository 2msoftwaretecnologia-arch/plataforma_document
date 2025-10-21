"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Save, Preview, TextFields, Numbers, List, CalendarToday } from "@mui/icons-material";
import FormPreview from "./FormPreview";
import ListsTab from "./tabs/ListsTab";
import TextFieldsTab from "./tabs/TextFieldsTab";
import NumberFieldsTab from "./tabs/NumberFieldsTab";
import DateFieldsTab from "./tabs/DateFieldsTab";
import { formSchema } from "../../schemas/formSchemas";
import { FormData, FormBuilderProps } from "../../types/formTypes";

export default function FormBuilder({
  onSave,
  onPreview,
  initialData,
}: FormBuilderProps) {
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
      dateFields: [],
    },
    mode: "onChange",
  });

  const watchedData = watch();

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
          Construtor de Formulários
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
              <Tab 
                icon={<CalendarToday />} 
                label="Campos de Data" 
                sx={{ minHeight: 48 }}
              />
            </Tabs>
          </Box>

          {/* Conteúdo das tabs */}
          {activeTab === 0 && <ListsTab control={control} />}
          {activeTab === 1 && <TextFieldsTab control={control} />}
          {activeTab === 2 && <NumberFieldsTab control={control} />}
          {activeTab === 3 && <DateFieldsTab control={control} />}

          <Divider sx={{ mb: 4 }} />

          {/* Preview do Formulário */}
          <FormPreview 
            lists={watchedData.lists || []} 
            textFields={watchedData.textFields || []}
            numberFields={watchedData.numberFields || []}
            dateFields={watchedData.dateFields || []}
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