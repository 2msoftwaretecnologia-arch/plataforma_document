// Indica que este componente roda no lado do cliente (browser)
"use client";

// Importa o React
import React from "react";
// Importa o Control do react-hook-form para tipagem
import { Control } from "react-hook-form";
// Importa componentes do Material-UI
import {
  Box,
  TextField,
  IconButton,
} from "@mui/material";
// Importa ícone do Material-UI
import { Delete } from "@mui/icons-material";

// Define as propriedades que este componente recebe
interface OptionItemProps {
  control: Control<any>;        // Controle do formulário
  listIndex: number;            // Índice da lista pai
  optionIndex: number;          // Índice desta opção
  onRemove: () => void;         // Função para remover esta opção
  isRemoveDisabled?: boolean;   // Se o botão de remover deve estar desabilitado
}

// Componente reutilizável para cada item de opção
export default function OptionItem({ 
  control, 
  listIndex, 
  optionIndex, 
  onRemove, 
  isRemoveDisabled = false 
}: OptionItemProps) {
  return (
    <Box
      sx={{
        display: "flex",      // Layout flexível horizontal
        alignItems: "center", // Alinha itens no centro verticalmente
        mb: 1,               // Margin bottom entre opções
        gap: 1,              // Espaço entre os elementos filhos
      }}
    >
      {/* Campo de texto para o valor da opção */}
      <TextField
        {...control.register(`lists.${listIndex}.options.${optionIndex}.value`)} // Registra no formulário
        label={`Opção ${optionIndex + 1}`}  // Label dinâmico: "Opção 1", "Opção 2", etc.
        size="small"                        // Tamanho pequeno do campo
        sx={{ flexGrow: 1 }}               // Ocupa todo espaço disponível
        placeholder="Digite o valor da opção" // Texto de exemplo
      />
      
      {/* Botão para remover esta opção específica */}
      <IconButton
        onClick={onRemove}           // Chama a função de remoção
        color="error"                // Cor vermelha
        size="small"                 // Tamanho pequeno
        disabled={isRemoveDisabled}  // Desabilita conforme a prop
      >
        <Delete /> {/* Ícone de lixeira */}
      </IconButton>
    </Box>
  );
}