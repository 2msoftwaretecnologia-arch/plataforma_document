/**
 * Template Model
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MetadadosTemplate = Record<string, any>;

export interface TemplateChave {
  name: string;
  type?: string;
  required?: boolean;
  description?: string;
}

export interface Template {
  id: string; // UUID
  nome: string;
  descricao: string | null;
  arquivo_original: string; // Caminho do arquivo .docx original
  arquivo_processado: string | null;
  chaves: TemplateChave[]; // Array com chaves do template
  metadados: MetadadosTemplate; // Objeto flexível de metadados
  ativo: boolean;
  versao: number;
  criado_em: string; // ISO 8601 timestamp
  atualizado_em: string; // ISO 8601 timestamp
  desativado_em: string | null; // ISO 8601 timestamp
  id_empresa: string | null; // UUID
  id_usuario_criador: string | null; // UUID
}

// DTO para criar template
export interface CreateTemplateDTO {
  nome: string;
  descricao?: string;
  arquivo_original: string;
  chaves: TemplateChave[];
  metadados?: MetadadosTemplate;
  id_empresa?: string;
}

// DTO para atualizar template
export interface UpdateTemplateDTO {
  nome?: string;
  descricao?: string;
  arquivo_original?: string;
  arquivo_processado?: string;
  chaves?: TemplateChave[];
  metadados?: MetadadosTemplate;
  ativo?: boolean;
}
