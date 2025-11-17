import { z } from "zod";
import { dateFieldSchema, formSchema, imageFieldSchema, listSchema, numberFieldSchema, textFieldSchema } from "@/modules/forms/schemas";
import type { TemplateKey } from "@/modules/templates/types";

// Tipos inferidos dos schemas
export type FormData = z.infer<typeof formSchema>;
export type ListData = z.infer<typeof listSchema>;
export type TextFieldData = z.infer<typeof textFieldSchema>;
export type NumberFieldData = z.infer<typeof numberFieldSchema>;
export type DateFieldData = z.infer<typeof dateFieldSchema>;
export type ImageFieldData = z.infer<typeof imageFieldSchema>;

// Interface para props do FormBuilder
export interface FormBuilderProps {
  onSave?: (data: FormData) => void;
  onPreview?: (data: FormData) => void;
  initialData?: FormData;
  templateId?: string;
  templateName?: string;
}

// Template-driven form builder types
export type FieldType = 'text' | 'number' | 'date' | 'list' | 'image';

export type FieldConfig =
  | TextFieldData
  | NumberFieldData
  | DateFieldData
  | ListData
  | ImageFieldData;

export interface KeyFieldMapping {
  chaveNome: string;
  chaveTipo: TemplateKey['tipo'];
  chaveObrigatoria: boolean;
  formFieldType?: FieldType;
  formFieldConfig?: FieldConfig;
}