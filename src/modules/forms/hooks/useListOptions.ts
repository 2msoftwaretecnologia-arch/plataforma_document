// Hook customizado para gerenciar opções de listas
import { useFieldArray, Control } from "react-hook-form";

// Interface para definir as propriedades do hook
interface UseListOptionsProps {
  control: Control<any>;  // Controle do formulário
  listIndex: number;      // Índice da lista
}

// Interface para o retorno do hook
interface UseListOptionsReturn {
  optionFields: any[];                    // Array das opções atuais
  addOption: () => void;                  // Função para adicionar nova opção
  removeOption: (index: number) => void; // Função para remover opção
}

// Hook customizado que encapsula a lógica de gerenciamento de opções
export function useListOptions({ control, listIndex }: UseListOptionsProps): UseListOptionsReturn {
  // Hook do react-hook-form para gerenciar o array de opções
  const {
    fields: optionFields,    // Array das opções atuais
    append: appendOption,    // Função para adicionar nova opção
    remove: removeOption,    // Função para remover uma opção
  } = useFieldArray({
    control,                              // Controle do formulário principal
    name: `lists.${listIndex}.options`,   // Caminho no formulário: lists[0].options, lists[1].options, etc.
  });

  // Função para adicionar uma nova opção vazia à lista
  const addOption = () => {
    appendOption({ value: "" }); // Adiciona opção com valor vazio
  };

  // Retorna as funções e dados que o componente precisa
  return {
    optionFields,
    addOption,
    removeOption,
  };
}