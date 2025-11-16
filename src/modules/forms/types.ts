export interface ListOption {
  value: string;
}

export interface ListData {
  name: string;
  options: ListOption[];
  multiSelect?: boolean;
  allowCustomValues?: boolean;
}

export interface TextFieldData {
  name: string;
  value?: string;
}

export interface NumberFieldData {
  name: string;
  value?: number;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
  required?: boolean;
}

export interface DateFieldData {
  name: string;
  dateType: "date" | "datetime-local" | "time" | "month";
  value?: string;
  required?: boolean;
  helperText?: string;
}

export interface ImageFieldData {
  name: string;
  allowMultiple?: boolean;
  required?: boolean;
  helperText?: string;
  acceptedFormats?: string[];
  maxFileSize?: number;
}

export interface FormPreviewProps {
  lists?: ListData[];
  textFields?: TextFieldData[];
  numberFields?: NumberFieldData[];
  dateFields?: DateFieldData[];
  imageFields?: ImageFieldData[];
}

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