/**
 * Documento Model
 */

export type RenderStatus = "pendente" | "processando" | "concluido" | "erro";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValoresDocumento = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Metadados = Record<string, any>;

export interface Documento {
  id: string; // UUID
  nome: string;
  descricao: string | null;
  valores: ValoresDocumento; // Objeto com valores preenchidos
  arquivo_renderizado: string | null; // Caminho do documento final gerado
  status_render: RenderStatus;
  erro_mensagem: string | null;
  metadados: Metadados; // Objeto flexível de metadados
  versao: number;
  criado_em: string; // ISO 8601 timestamp
  atualizado_em: string; // ISO 8601 timestamp
  renderizado_em: string | null; // ISO 8601 timestamp
  id_template: string; // UUID - obrigatório
  id_formulario: string | null; // UUID
  id_empresa: string | null; // UUID
  id_usuario_criador: string | null; // UUID
}

// DTO para criar documento
export interface CreateDocumentoDTO {
  nome: string;
  descricao?: string;
  valores: ValoresDocumento;
  id_template: string;
  id_formulario?: string;
  id_empresa?: string;
}

// DTO para atualizar documento
export interface UpdateDocumentoDTO {
  nome?: string;
  descricao?: string;
  valores?: ValoresDocumento;
  status_render?: RenderStatus;
  erro_mensagem?: string | null;
  arquivo_renderizado?: string | null;
}

// DTO para renderizar documento
export interface RenderDocumentoDTO {
  id: string;
}
