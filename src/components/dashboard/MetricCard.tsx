"use client";

import { Paper, Typography, Box, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
}: MetricCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case "primary":
        return theme.palette.primary.main;
      case "secondary":
        return theme.palette.secondary.main;
      case "success":
        return theme.palette.success.main;
      case "warning":
        return theme.palette.warning.main;
      case "error":
        return theme.palette.error.main;
      case "info":
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "grey.900" : "background.paper",
        border: isDark ? "1px solid" : "none",
        borderColor: isDark ? "grey.700" : "transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          elevation: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${getColorValue(color)}20`,
            color: getColorValue(color),
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 1,
        }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}

      {trend && (
        <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
          <Typography
            variant="body2"
            sx={{
              color: trend.isPositive ? "success.main" : "error.main",
              fontWeight: 600,
            }}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            vs mês anterior
          </Typography>
        </Box>
      )}
    </Paper>
  );
}