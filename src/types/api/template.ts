/**
 * Template types matching Django API response format
 */

export interface TemplateKey {
  nome: string;
  tipo: 'texto' | 'data' | 'email' | 'numero';
  obrigatorio: boolean;
}

export interface TemplateFormField {
  tipo: string;
  campo: string;
  label: string;
  required: boolean;
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
  chaves: TemplateKey[];
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
