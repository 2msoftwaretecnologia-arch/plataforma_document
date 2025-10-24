"use client";

import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  useTheme,
  Chip,
} from "@mui/material";
import { Description, TrendingUp } from "@mui/icons-material";

interface DocumentStats {
  id: string;
  nome: string;
  tipo: string;
  totalGerado: number;
  percentual: number;
  crescimento?: number;
}

interface TopDocumentsChartProps {
  documents: DocumentStats[];
  title?: string;
  maxItems?: number;
}

export default function TopDocumentsChart({
  documents,
  title = "Documentos Mais Gerados",
  maxItems = 10,
}: TopDocumentsChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const sortedDocuments = documents
    .sort((a, b) => b.totalGerado - a.totalGerado)
    .slice(0, maxItems);

  const maxValue = sortedDocuments[0]?.totalGerado || 1;

  const getTypeColor = (tipo: string) => {
    const colors = {
      "Contrato": theme.palette.primary.main,
      "Relatório": theme.palette.success.main,
      "Formulário": theme.palette.info.main,
      "Documento": theme.palette.warning.main,
      "Certificado": theme.palette.error.main,
    };
    return colors[tipo as keyof typeof colors] || theme.palette.grey[500];
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        bgcolor: isDark ? "grey.900" : "background.paper",
        border: isDark ? "1px solid" : "none",
        borderColor: isDark ? "grey.700" : "transparent",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: `${theme.palette.primary.main}20`,
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          <Description />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      {/* Documents List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {sortedDocuments.map((doc, index) => (
            <ListItem
              key={doc.id}
              sx={{
                px: 0,
                py: 1,
                borderBottom: index < sortedDocuments.length - 1 ? "1px solid" : "none",
                borderColor: isDark ? "grey.800" : "grey.200",
              }}
            >
              <Box sx={{ width: "100%" }}>
                {/* Document Info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, mb: 0.25 }}
                    >
                      {doc.nome}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={doc.tipo}
                        size="small"
                        sx={{
                          bgcolor: `${getTypeColor(doc.tipo)}20`,
                          color: getTypeColor(doc.tipo),
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                      {doc.crescimento !== undefined && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TrendingUp
                            sx={{
                              fontSize: 14,
                              color: doc.crescimento >= 0 ? "success.main" : "error.main",
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.7rem",
                              color: doc.crescimento >= 0 ? "success.main" : "error.main",
                              fontWeight: 600,
                            }}
                          >
                            {doc.crescimento >= 0 ? "+" : ""}{doc.crescimento}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right", ml: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {doc.totalGerado}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {doc.percentual.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={(doc.totalGerado / maxValue) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: isDark ? "grey.800" : "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: getTypeColor(doc.tipo),
                    },
                  }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {sortedDocuments.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            py: 4,
          }}
        >
          <Description sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">
            Nenhum documento encontrado
          </Typography>
        </Box>
      )}

      {/* Summary */}
      {sortedDocuments.length > 0 && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: isDark ? "grey.800" : "grey.200",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Total de {documents.reduce((sum, doc) => sum + doc.totalGerado, 0)} documentos gerados
          </Typography>
        </Box>
      )}
    </Paper>
  );
}