// Indica que este componente roda no lado do cliente (browser)
"use client";

// Importa o React
import React from "react";
// Importa componentes do Material-UI
import {
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
// Importa ícones do Material-UI
import { Delete, DragIndicator } from "@mui/icons-material";

// Define as propriedades que este componente recebe
interface ListHeaderProps {
  listIndex: number;      // Índice da lista (para mostrar "Lista #1", etc.)
  onRemove: () => void;   // Função para remover esta lista
}

// Componente reutilizável para o cabeçalho das listas
export default function ListHeader({ listIndex, onRemove }: ListHeaderProps) {
  // Hook do Material-UI para acessar o tema atual
  const theme = useTheme();
  // Verifica se estamos no modo escuro
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {/* Ícone para indicar que a lista pode ser arrastada/reordenada */}
      <DragIndicator 
        sx={{ 
          color: isDarkMode ? "grey.500" : "grey.400", 
          mr: 1 
        }} 
      />
      
      {/* Título da lista - mostra "Lista #1", "Lista #2", etc. */}
      <Typography 
        variant="h6"  // Tamanho do texto (h6 = título médio)
        sx={{ 
          flexGrow: 1, // Ocupa todo o espaço disponível
          color: isDarkMode ? 'grey.200' : 'text.primary' // Cor adaptável ao tema
        }}
      >
        Lista #{listIndex + 1} {/* listIndex começa em 0, então +1 para mostrar 1, 2, 3... */}
      </Typography>
      
      {/* Botão para remover esta lista inteira */}
      <IconButton
        onClick={onRemove}  // Chama a função passada pelo componente pai
        color="error"       // Cor vermelha para indicar ação destrutiva
        size="small"        // Tamanho pequeno do botão
        sx={{ ml: 1 }}      // Margin left: 8px
      >
        <Delete /> {/* Ícone de lixeira */}
      </IconButton>
    </Box>
  );
}