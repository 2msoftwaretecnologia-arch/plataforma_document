/**
 * Empresa Model
 */

export interface Empresa {
  id: string; // UUID
  nome: string;
  cnpj: string | null; // XX.XXX.XXX/XXXX-XX
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  ativo: boolean;
  criado_em: string; // ISO 8601 timestamp
  desativado_em: string | null; // ISO 8601 timestamp
  id_usuario_responsavel: string | null; // UUID
}

// DTO para criar empresa
export interface CreateEmpresaDTO {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  id_usuario_responsavel?: string;
}

// DTO para atualizar empresa
export interface UpdateEmpresaDTO {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
  id_usuario_responsavel?: string;
}
