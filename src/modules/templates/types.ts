/**
 * Template types matching Django API response format
 */

export interface TemplateKey {
  nome: string;
  tipo: 'texto' | 'data' | 'email' | 'numero';
  obrigatorio: boolean;
}

// Base config shared by all field types
export interface BaseFieldConfig {
  helperText?: string;
}

// Text field specific config
export interface TextFieldConfig extends BaseFieldConfig {
  value?: string;
}

// Number field specific config
export interface NumberFieldConfig extends BaseFieldConfig {
  value?: number;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

// Date field specific config
export interface DateFieldConfig extends BaseFieldConfig {
  dateType?: 'date' | 'datetime-local' | 'time' | 'month';
  value?: string;
}

// List option
export interface ListOption {
  value: string;
}

// List field specific config
export interface ListFieldConfig extends BaseFieldConfig {
  options: ListOption[];
  multiSelect?: boolean;
  allowCustomValues?: boolean;
}

// Image field specific config
export interface ImageFieldConfig extends BaseFieldConfig {
  allowMultiple?: boolean;
  acceptedFormats?: string[];
  maxFileSize?: number; // in MB
}

// Union type for all possible configs
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | ListFieldConfig
  | ImageFieldConfig;

export interface TemplateFormField {
  tipo: 'text' | 'email' | 'number' | 'date' | 'datetime' | 'select' | 'list' | 'image';
  campo: string;
  label: string;
  required: boolean;
  config?: FieldConfig;
}

export interface TemplateMetadata {
  autor?: string;
  versao?: string;
  categoria?: string;
  [key: string]: string | undefined;
}

export interface Template {
  id: string;
  nome: string;
  descricao: string;
  arquivo_original: string;
  arquivo: string;
  chaves: TemplateKey[] | string[];  // Support both object and string array formats
  formulario: TemplateFormField[];
  metadados: TemplateMetadata;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  desativado_em: string | null;
}

export interface TemplatesResponse {
  status: string;
  data: Template[];
  count: number;
}

/**
 * Create template request payload
 */
export interface CreateTemplateRequest {
  nome: string;
  descricao: string;
  arquivo_original?: string;
  metadados?: TemplateMetadata;
}

/**
 * Update template request payload
 */
export interface UpdateTemplateRequest {
  nome?: string;
  descricao?: string;
  arquivo_original?: string;
  metadados?: TemplateMetadata;
  formulario?: TemplateFormField[];
  chaves?: TemplateKey[];
  ativo?: boolean;
}

/**
 * Computed status for template display
 */
export interface TemplateStatus {
  isMapped: boolean;
  hasForm: boolean;
}
