import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon = <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />,
  title = "Nenhum item encontrado",
  message = "Não há dados para exibir no momento.",
  action,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
      p={3}
    >
      {icon}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center">
        {message}
      </Typography>
      {action && <Box mt={2}>{action}</Box>}
    </Box>
  );
}
