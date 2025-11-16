"use client";

import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { People, Visibility, TrendingUp } from "@mui/icons-material";

interface UserStats {
  id: string;
  nome: string;
  email: string;
  documentosGerados: number;
  ultimoAcesso: string;
  status: "ativo" | "inativo";
  avatar?: string;
}

interface UserStatsTableProps {
  users: UserStats[];
  title?: string;
}

export default function UserStatsTable({
  users,
  title = "Estatísticas dos Usuários",
}: UserStatsTableProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "success" : "default";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        bgcolor: isDark ? "grey.900" : "background.paper",
        border: isDark ? "1px solid" : "none",
        borderColor: isDark ? "grey.700" : "transparent",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
            <People />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Usuário</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Documentos Gerados</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Último Acesso</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    bgcolor: isDark ? "grey.800" : "grey.50",
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {getInitials(user.nome)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.nome}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mr: 1 }}
                    >
                      {user.documentosGerados}
                    </Typography>
                    <TrendingUp
                      sx={{
                        fontSize: 16,
                        color: "success.main",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(user.ultimoAcesso)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    color={getStatusColor(user.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Ver detalhes">
                    <IconButton size="small" color="primary">
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <People sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">
            Nenhum usuário encontrado
          </Typography>
        </Box>
      )}
    </Paper>
  );
}