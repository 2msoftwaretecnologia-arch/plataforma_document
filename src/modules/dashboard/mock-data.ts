/**
 * Mock data for dashboard metrics and statistics
 */

export interface DashboardMetrics {
  totalDocuments: number;
  totalUsers: number;
  documentsThisMonth: number;
  activeUsers: number;
  planUsage: {
    planName: string;
    planType: "basico" | "medio" | "grande";
    currentUsage: number;
    maxLimit: number;
    unit: string;
  };
}

export interface UserStats {
  id: string;
  nome: string;
  email: string;
  documentosGerados: number;
  ultimoAcesso: string;
  status: "ativo" | "inativo";
  avatar?: string;
}

export interface DocumentStats {
  id: string;
  nome: string;
  tipo: string;
  totalGerado: number;
  percentual: number;
  crescimento?: number;
}

// Mock dashboard metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalDocuments: 1247,
  totalUsers: 23,
  documentsThisMonth: 89,
  activeUsers: 18,
  planUsage: {
    planName: "Médio",
    planType: "medio",
    currentUsage: 847,
    maxLimit: 1000,
    unit: "documentos",
  },
};

// Mock user statistics
export const mockUserStats: UserStats[] = [
  {
    id: "1",
    nome: "Ana Silva",
    email: "ana.silva@empresa.com",
    documentosGerados: 156,
    ultimoAcesso: "2024-01-15T14:30:00Z",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Carlos Santos",
    email: "carlos.santos@empresa.com",
    documentosGerados: 134,
    ultimoAcesso: "2024-01-15T09:15:00Z",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Maria Oliveira",
    email: "maria.oliveira@empresa.com",
    documentosGerados: 98,
    ultimoAcesso: "2024-01-14T16:45:00Z",
    status: "ativo",
  },
  {
    id: "4",
    nome: "João Pereira",
    email: "joao.pereira@empresa.com",
    documentosGerados: 87,
    ultimoAcesso: "2024-01-14T11:20:00Z",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Fernanda Costa",
    email: "fernanda.costa@empresa.com",
    documentosGerados: 76,
    ultimoAcesso: "2024-01-13T15:30:00Z",
    status: "ativo",
  },
  {
    id: "6",
    nome: "Ricardo Lima",
    email: "ricardo.lima@empresa.com",
    documentosGerados: 65,
    ultimoAcesso: "2024-01-12T10:00:00Z",
    status: "inativo",
  },
  {
    id: "7",
    nome: "Juliana Rocha",
    email: "juliana.rocha@empresa.com",
    documentosGerados: 54,
    ultimoAcesso: "2024-01-15T13:45:00Z",
    status: "ativo",
  },
  {
    id: "8",
    nome: "Pedro Almeida",
    email: "pedro.almeida@empresa.com",
    documentosGerados: 43,
    ultimoAcesso: "2024-01-11T08:30:00Z",
    status: "inativo",
  },
];

// Mock document statistics
export const mockDocumentStats: DocumentStats[] = [
  {
    id: "1",
    nome: "Contrato de Prestação de Serviços",
    tipo: "Contrato",
    totalGerado: 234,
    percentual: 18.8,
    crescimento: 12.5,
  },
  {
    id: "2",
    nome: "Relatório Mensal de Atividades",
    tipo: "Relatório",
    totalGerado: 189,
    percentual: 15.2,
    crescimento: 8.3,
  },
  {
    id: "3",
    nome: "Formulário de Cadastro",
    tipo: "Formulário",
    totalGerado: 167,
    percentual: 13.4,
    crescimento: -2.1,
  },
  {
    id: "4",
    nome: "Termo de Responsabilidade",
    tipo: "Documento",
    totalGerado: 145,
    percentual: 11.6,
    crescimento: 15.7,
  },
  {
    id: "5",
    nome: "Certificado de Participação",
    tipo: "Certificado",
    totalGerado: 123,
    percentual: 9.9,
    crescimento: 22.4,
  },
  {
    id: "6",
    nome: "Proposta Comercial",
    tipo: "Documento",
    totalGerado: 98,
    percentual: 7.9,
    crescimento: 5.2,
  },
  {
    id: "7",
    nome: "Ata de Reunião",
    tipo: "Documento",
    totalGerado: 87,
    percentual: 7.0,
    crescimento: -1.8,
  },
  {
    id: "8",
    nome: "Declaração de Comparecimento",
    tipo: "Certificado",
    totalGerado: 76,
    percentual: 6.1,
    crescimento: 9.1,
  },
  {
    id: "9",
    nome: "Relatório de Despesas",
    tipo: "Relatório",
    totalGerado: 65,
    percentual: 5.2,
    crescimento: 3.7,
  },
  {
    id: "10",
    nome: "Contrato de Locação",
    tipo: "Contrato",
    totalGerado: 54,
    percentual: 4.3,
    crescimento: 18.9,
  },
];

// Function to get metrics with trends
export const getDashboardMetricsWithTrends = () => {
  return {
    totalDocuments: {
      value: mockDashboardMetrics.totalDocuments,
      trend: { value: 8.5, isPositive: true },
    },
    totalUsers: {
      value: mockDashboardMetrics.totalUsers,
      trend: { value: 12.3, isPositive: true },
    },
    documentsThisMonth: {
      value: mockDashboardMetrics.documentsThisMonth,
      trend: { value: 15.7, isPositive: true },
    },
    activeUsers: {
      value: mockDashboardMetrics.activeUsers,
      trend: { value: 4.2, isPositive: true },
    },
  };
};