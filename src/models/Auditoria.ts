/**
 * Auditoria Model
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DadosAuditoria = Record<string, any> | null;

export type OperacaoAuditoria = "INSERT" | "UPDATE" | "DELETE";

export interface Auditoria {
  id: string; // UUID
  tabela: string;
  operacao: OperacaoAuditoria;
  registro_id: string; // UUID
  dados_anteriores: DadosAuditoria;
  dados_novos: DadosAuditoria;
  id_usuario: string | null; // UUID
  criado_em: string; // ISO 8601 timestamp
}

// DTO para criar auditoria
export interface CreateAuditoriaDTO {
  tabela: string;
  operacao: OperacaoAuditoria;
  registro_id: string;
  dados_anteriores?: DadosAuditoria;
  dados_novos?: DadosAuditoria;
  id_usuario?: string;
}
