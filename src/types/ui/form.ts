import { z } from "zod";
import { dateFieldSchema, formSchema, imageFieldSchema, listSchema, numberFieldSchema, textFieldSchema } from "../../schemas/formSchemas";

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
}