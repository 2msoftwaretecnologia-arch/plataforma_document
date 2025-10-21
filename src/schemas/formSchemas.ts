import { z } from "zod";

// Schema para opções de lista
export const listOptionSchema = z.object({
  value: z.string().min(1, "Valor da opção é obrigatório"),
});

// Schema para listas
export const listSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório"),
  options: z.array(listOptionSchema).min(1, "Pelo menos uma opção é necessária"),
  multiSelect: z.boolean().optional(), // Adiciona suporte para seleção múltipla
});

// Schema para campos de texto
export const textFieldSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  value: z.string().optional(),
});

// Schema para campos numéricos
export const numberFieldSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  allowDecimals: z.boolean().optional(),
  required: z.boolean().optional(),
});

// Schema principal do formulário
export const formSchema = z.object({
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