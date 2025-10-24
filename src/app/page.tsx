"use client";

import { Box, Typography, Container } from "@mui/material";
import {
  Description,
  People,
  TrendingUp,
  CheckCircle,
} from "@mui/icons-material";

// Import dashboard components
import MetricCard from "@/components/dashboard/MetricCard";
import PlanUsageCard from "@/components/dashboard/PlanUsageCard";
import UserStatsTable from "@/components/dashboard/UserStatsTable";
import TopDocumentsChart from "@/components/dashboard/TopDocumentsChart";

// Import mock data
import {
  mockDashboardMetrics,
  mockUserStats,
  mockDocumentStats,
  getDashboardMetricsWithTrends,
} from "@/data/mockDashboardData";

export default function Dashboard() {
  const metricsWithTrends = getDashboardMetricsWithTrends();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral das métricas e estatísticas da plataforma
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        <MetricCard
          title="Total de Documentos"
          value={metricsWithTrends.totalDocuments.value.toLocaleString()}
          icon={<Description />}
          color="primary"
          trend={metricsWithTrends.totalDocuments.trend}
        />
        <MetricCard
          title="Usuários Ativos"
          value={metricsWithTrends.activeUsers.value}
          subtitle={`de ${metricsWithTrends.totalUsers.value} usuários`}
          icon={<People />}
          color="success"
          trend={metricsWithTrends.activeUsers.trend}
        />
        <MetricCard
          title="Documentos Este Mês"
          value={metricsWithTrends.documentsThisMonth.value}
          icon={<TrendingUp />}
          color="info"
          trend={metricsWithTrends.documentsThisMonth.trend}
        />
        <MetricCard
          title="Taxa de Sucesso"
          value="98.5%"
          subtitle="Documentos processados"
          icon={<CheckCircle />}
          color="success"
          trend={{ value: 2.1, isPositive: true }}
        />
      </Box>

      {/* Plan Usage */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        <PlanUsageCard
          planName={mockDashboardMetrics.planUsage.planName}
          planType={mockDashboardMetrics.planUsage.planType}
          currentUsage={mockDashboardMetrics.planUsage.currentUsage}
          maxLimit={mockDashboardMetrics.planUsage.maxLimit}
          unit={mockDashboardMetrics.planUsage.unit}
        />
        <TopDocumentsChart
          documents={mockDocumentStats.slice(0, 5)}
          title="Top 5 Documentos"
        />
      </Box>

      {/* Detailed Statistics */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3
        }}
      >
        <UserStatsTable
          users={mockUserStats}
          title="Estatísticas dos Usuários"
        />
        <TopDocumentsChart
          documents={mockDocumentStats}
          title="Todos os Documentos"
          maxItems={8}
        />
      </Box>
    </Container>
  );
}
