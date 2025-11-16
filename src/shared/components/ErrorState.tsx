import { Alert, AlertTitle, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({
  error,
  onRetry,
  title = "Erro ao carregar dados",
}: ErrorStateProps) {
  const errorMessage =
    error instanceof Error ? error.message : "Ocorreu um erro desconhecido";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={3}
    >
      <Alert
        severity="error"
        sx={{ maxWidth: 600 }}
        action={
          onRetry ? (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
}
