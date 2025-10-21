// Indica que este componente roda no lado do cliente (browser), não no servidor
"use client";

// Importa o React - biblioteca principal para criar interfaces
import React from "react";
// Importa hooks do react-hook-form para gerenciar formulários
import { Control } from "react-hook-form";
// Importa componentes visuais do Material-UI
import {
  Box,        // Container flexível para layout
  TextField,  // Campo de texto/input
  Button,     // Botão clicável
  Typography, // Texto estilizado
  Paper,      // Container com sombra/elevação
  Divider,    // Linha divisória
  useTheme,   // Hook para acessar o tema atual
  FormControlLabel, // Container para label + controle
  Switch,     // Componente switch (toggle)
} from "@mui/material";
// Importa ícone do Material-UI
import { Add } from "@mui/icons-material";

// Importa componentes reutilizáveis
import ListHeader from "./ListHeader";
import OptionItem from "./OptionItem";
// Importa hook customizado
import { useListOptions } from "../../hooks/useListOptions";

// Define a estrutura de uma opção da lista
interface ListOption {
  value: string; // O valor/texto da opção
}

// Define a estrutura completa de uma lista
interface ListData {
  name: string;           // Nome da lista (ex: "Categorias")
  options: ListOption[];  // Array de opções da lista
  multiSelect?: boolean;  // Se permite seleção múltipla (opcional, padrão false)
}

// Define as propriedades que este componente recebe
interface ListInputProps {
  control: Control<any>; // Controle do formulário (react-hook-form)
  index: number;         // Posição desta lista no array de listas
  onRemove: () => void;  // Função para remover esta lista
}

// Componente principal - representa uma lista individual no formulário
export default function ListInput({ control, index, onRemove }: ListInputProps) {
  // Hook do Material-UI para acessar o tema atual da aplicação
  const theme = useTheme();
  // Verifica se estamos no modo escuro (true) ou claro (false)
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Hook customizado para gerenciar as opções desta lista
  const { optionFields, addOption, removeOption } = useListOptions({
    control,
    listIndex: index,
  });

  // Renderiza o componente na tela
  return (
    <Paper 
      elevation={2}  // Sombra/elevação do container
      sx={{ 
        p: 3,  // Padding interno: 24px em todos os lados
        mb: 2, // Margin bottom: 16px
        position: "relative", // Posicionamento relativo para elementos filhos
        // Cores condicionais baseadas no tema
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper', // Fundo escuro ou padrão
        border: isDarkMode ? '1px solid' : 'none',             // Borda apenas no tema escuro
        borderColor: isDarkMode ? 'grey.700' : 'transparent'   // Cor da borda
      }}
    >
      {/* Cabeçalho da lista usando componente reutilizável */}
      <ListHeader 
        listIndex={index} 
        onRemove={onRemove} 
      />

      {/* Seção para o nome da lista */}
      <Box sx={{ mb: 3 }}> {/* Container com margin bottom */}
        <TextField
          {...control.register(`lists.${index}.name`)} // Registra o campo no formulário
          label="Nome da Lista"           // Texto que aparece acima do campo
          fullWidth                       // Ocupa toda a largura disponível
          margin="normal"                 // Margem padrão do Material-UI
          placeholder="Ex: categorias, prioridades, status..." // Texto de exemplo
          helperText="Nome da lista que será usado no formulário" // Texto de ajuda
        />
      </Box>

      {/* Seção para configuração de seleção múltipla */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              {...control.register(`lists.${index}.multiSelect`)}
              color="primary"
              size="medium"
            />
          }
          label={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Permitir Seleção Múltipla
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDarkMode ? 'grey.400' : 'text.secondary',
                  display: 'block'
                }}
              >
                Permite que o usuário selecione mais de uma opção desta lista
              </Typography>
            </Box>
          }
          sx={{ 
            alignItems: 'flex-start',
            '& .MuiFormControlLabel-label': {
              ml: 1
            }
          }}
        />
      </Box>

      {/* Linha divisória entre configurações e opções */}
      <Divider sx={{ mb: 2, borderColor: isDarkMode ? 'grey.700' : 'grey.300' }} />

      {/* Título da seção de opções */}
      <Typography 
        variant="subtitle1"  // Tamanho de subtítulo
        sx={{ 
          mb: 2,             // Margin bottom
          fontWeight: 600,   // Texto em negrito
          color: isDarkMode ? 'grey.200' : 'text.primary' // Cor adaptável
        }}
      >
        Opções da Lista
      </Typography>

      {/* Lista todas as opções existentes usando componente reutilizável */}
      {optionFields.map((field, optionIndex) => (
        <OptionItem
          key={field.id}
          control={control}
          listIndex={index}
          optionIndex={optionIndex}
          onRemove={() => removeOption(optionIndex)}
          isRemoveDisabled={optionFields.length <= 1}
        />
      ))}

      {/* Botão para adicionar nova opção */}
      <Button
        onClick={addOption}         // Chama a função do hook customizado
        startIcon={<Add />}         // Ícone de "+" no início do botão
        variant="outlined"          // Estilo com borda
        size="small"                // Tamanho pequeno
        sx={{ mt: 1 }}             // Margin top
      >
        Adicionar Opção
      </Button>
    </Paper> // Fecha o container principal
  ); // Fecha o return
} // Fecha a função do componente