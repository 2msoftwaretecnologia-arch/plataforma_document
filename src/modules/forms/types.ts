// Re-export types from ui/form for backwards compatibility
export type { FormData, FieldType, KeyFieldMapping, ListData, TextFieldData, NumberFieldData, DateFieldData, ImageFieldData } from '@/types/ui/form';

export interface ListOption {
  value: string;
}

export interface FormPreviewProps {
  lists?: ListData[];
  textFields?: TextFieldData[];
  numberFields?: NumberFieldData[];
  dateFields?: DateFieldData[];
  imageFields?: ImageFieldData[];
}

// Import the types we're using in FormPreviewProps
import type { ListData, TextFieldData, NumberFieldData, DateFieldData, ImageFieldData } from '@/types/ui/form';

export interface FieldProps {
  field: any;
  index: number;
  selectedValues: { [key: string]: any };
  onValueChange: (fieldKey: string, value: any) => void;
  isDarkMode: boolean;
}

export interface ImageFieldProps extends FieldProps {
  field: ImageFieldData;
  dragStates: { [key: string]: boolean };
  uploadedFiles: { [key: string]: File[] };
  onDragStateChange: (fieldKey: string, isDragging: boolean) => void;
  onFilesChange: (fieldKey: string, files: File[]) => void;
}