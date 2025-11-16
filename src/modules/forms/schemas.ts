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
  allowCustomValues: z.boolean().optional(), // Permite valores personalizados não listados nas opções
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

// Schema para campos de data
export const dateFieldSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  dateType: z.enum(["date", "datetime-local", "time", "month"]),
  value: z.string().optional(),
  required: z.boolean().default(false),
  helperText: z.string().optional(),
});

// Schema para campos de imagem
export const imageFieldSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  allowMultiple: z.boolean().default(false),
  required: z.boolean().default(false),
  helperText: z.string().optional(),
  acceptedFormats: z.array(z.string()).default(["image/jpeg", "image/png", "image/gif", "image/webp"]),
  maxFileSize: z.number().default(5), // em MB
});

// Schema principal do formulário
export const formSchema = z.object({
  lists: z.array(listSchema).optional(),
  textFields: z.array(textFieldSchema).optional(),
  numberFields: z.array(numberFieldSchema).optional(),
  dateFields: z.array(dateFieldSchema).optional(),
  imageFields: z.array(imageFieldSchema).optional(),
}).refine(
  (data) => {
    const hasLists = data.lists && data.lists.length > 0;
    const hasTextFields = data.textFields && data.textFields.length > 0;
    const hasNumberFields = data.numberFields && data.numberFields.length > 0;
    const hasDateFields = data.dateFields && data.dateFields.length > 0;
    const hasImageFields = data.imageFields && data.imageFields.length > 0;
    return hasLists || hasTextFields || hasNumberFields || hasDateFields || hasImageFields;
  },
  {
    message: "Pelo menos um campo (lista, texto, número, data ou imagem) deve ser adicionado",
  }
);