"use client";

import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  Chip,
} from "@mui/material";
import { WorkspacePremium, Warning } from "@mui/icons-material";

interface PlanUsageCardProps {
  planName: string;
  currentUsage: number;
  maxLimit: number;
  unit: string;
  planType: "basico" | "medio" | "grande";
}

export default function PlanUsageCard({
  planName,
  currentUsage,
  maxLimit,
  unit,
  planType,
}: PlanUsageCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const usagePercentage = (currentUsage / maxLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isOverLimit = usagePercentage >= 100;

  const getPlanColor = () => {
    switch (planType) {
      case "basico":
        return theme.palette.info.main;
      case "medio":
        return theme.palette.success.main;
      case "grande":
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getProgressColor = () => {
    if (isOverLimit) return "error";
    if (isNearLimit) return "warning";
    return "primary";
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        bgcolor: isDark ? "grey.900" : "background.paper",
        border: isDark ? "1px solid" : "none",
        borderColor: isDark ? "grey.700" : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${getPlanColor()}20`,
            color: getPlanColor(),
            mr: 2,
          }}
        >
          <WorkspacePremium />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Plano {planName}
          </Typography>
          <Chip
            label={planType.charAt(0).toUpperCase() + planType.slice(1)}
            size="small"
            sx={{
              bgcolor: `${getPlanColor()}20`,
              color: getPlanColor(),
              fontWeight: 600,
            }}
          />
        </Box>
        {isNearLimit && (
          <Warning
            sx={{
              color: isOverLimit ? "error.main" : "warning.main",
              ml: 1,
            }}
          />
        )}
      </Box>

      {/* Usage Stats */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Uso atual
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: isOverLimit ? "error.main" : "text.primary",
            }}
          >
            {currentUsage.toLocaleString()} / {maxLimit.toLocaleString()} {unit}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(usagePercentage, 100)}
          color={getProgressColor()}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: isDark ? "grey.800" : "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: isOverLimit ? "error.main" : "text.secondary",
              fontWeight: 500,
            }}
          >
            {usagePercentage.toFixed(1)}% utilizado
          </Typography>
          {isOverLimit ? (
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              Limite excedido
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {(maxLimit - currentUsage).toLocaleString()} {unit} restantes
            </Typography>
          )}
        </Box>
      </Box>

      {/* Status Message */}
      {isOverLimit && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ⚠️ Limite do plano excedido
          </Typography>
          <Typography variant="body2">
            Considere fazer upgrade do seu plano para continuar usando todos os recursos.
          </Typography>
        </Box>
      )}

      {isNearLimit && !isOverLimit && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: "warning.light",
            color: "warning.contrastText",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            🔔 Próximo do limite
          </Typography>
          <Typography variant="body2">
            Você está usando {usagePercentage.toFixed(1)}% do seu plano atual.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}