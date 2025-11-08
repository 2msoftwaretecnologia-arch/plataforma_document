"use client";

import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsSubmitting(true);

    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      await login(credentials);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer login",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "primary.main",
              mb: 2,
            }}
          >
            <LockOutlined sx={{ color: "white", fontSize: 32 }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Entrar na Plataforma
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Não tem uma conta?
              <Button
                onClick={() => router.push("/login/register")}
                size="small"
                sx={{ textTransform: "none", ml: 1 }}
              >
                Criar conta
              </Button>
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              Credenciais de teste:
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Email: admin@example.com
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Senha: password123
            </Typography>
          </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
