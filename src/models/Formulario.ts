/**
 * Formulario Model
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CampoProps = Record<string, any>;

export interface CampoFormulario extends CampoProps {
  nome: string;
  tipo: "Texto" | "Número" | "Lista" | "Data" | "Imagem" | string;
  min_chars?: number;
  max_chars?: number;
  obrigatorio?: boolean;
  opcoes?: string[]; // Para tipo "Lista"
  multi?: boolean; // Para tipo "Lista"
}

export interface Formulario {
  id: string; // UUID
  nome: string;
  descricao: string | null;
  campos: CampoFormulario[]; // Array com configuração dos campos
  versao: number;
  ativo: boolean;
  criado_em: string; // ISO 8601 timestamp
  atualizado_em: string; // ISO 8601 timestamp
  id_template: string; // UUID - obrigatório
  id_empresa: string | null; // UUID
  id_usuario_criador: string | null; // UUID
}

// DTO para criar formulário
export interface CreateFormularioDTO {
  nome: string;
  descricao?: string;
  campos: CampoFormulario[];
  id_template: string;
  id_empresa?: string;
}

// DTO para atualizar formulário
export interface UpdateFormularioDTO {
  nome?: string;
  descricao?: string;
  campos?: CampoFormulario[];
  ativo?: boolean;
}
