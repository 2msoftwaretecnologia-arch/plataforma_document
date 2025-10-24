"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  Save as SaveIcon,
  FileDownload as DownloadIcon,
  ArrowBackIos as BackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { RenderStatus } from "@/models/Documento";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValoresDocumento = Record<string, any>;

// Interface for mock document with form data
interface DocumentoDetail {
  id: string;
  nome: string;
  descricao: string | null;
  status_render: RenderStatus;
  template_nome: string;
  criado_em: string;
  arquivo_renderizado: string | null;
  valores: ValoresDocumento;
}

// Interface for form data structure (from FormBuilder)
interface FormData {
  lists?: Array<{
    name: string;
    options: Array<{ value: string }>;
    multiSelect?: boolean;
  }>;
  textFields?: Array<{
    name: string;
    value?: string;
  }>;
  numberFields?: Array<{
    name: string;
    value?: number;
    min?: number;
    max?: number;
    allowDecimals?: boolean;
    required?: boolean;
  }>;
  dateFields?: Array<{
    name: string;
    dateType: "date" | "datetime-local" | "time" | "month";
    value?: string;
    required?: boolean;
  }>;
  imageFields?: Array<{
    name: string;
    allowMultiple?: boolean;
    required?: boolean;
  }>;
}

// Mock data - documento with form structure
const mockDocumentoData: DocumentoDetail = {
  id: "1",
  nome: "Contrato de Prestação de Serviços",
  descricao: "Contrato modelo para prestação de serviços gerais",
  status_render: "pendente",
  template_nome: "Contrato Padrão",
  criado_em: "2025-10-15T10:30:00Z",
  arquivo_renderizado: null,
  valores: {
    empresa: "Empresa XYZ",
    data_inicio: "2025-11-01",
    valor_mensal: 5000,
    servico: "Consultoria",
  },
};

// Mock form structure based on the template
const mockFormStructure: FormData = {
  textFields: [
    {
      name: "empresa",
      value: "Empresa XYZ",
    },
    {
      name: "contato",
      value: "João Silva",
    },
    {
      name: "servico",
      value: "Consultoria",
    },
  ],
  numberFields: [
    {
      name: "valor_mensal",
      value: 5000,
      min: 0,
      allowDecimals: true,
      required: true,
    },
    {
      name: "quantidade_horas",
      value: 160,
      min: 0,
      required: true,
    },
  ],
  dateFields: [
    {
      name: "data_inicio",
      dateType: "date",
      value: "2025-11-01",
      required: true,
    },
    {
      name: "data_fim",
      dateType: "date",
      value: "2025-12-01",
      required: true,
    },
  ],
};

const statusColors: Record<RenderStatus, string> = {
  pendente: "#FFA500",
  processando: "#2196F3",
  concluido: "#4CAF50",
  erro: "#F44336",
};

const statusLabels: Record<RenderStatus, string> = {
  pendente: "Pendente",
  processando: "Processando",
  concluido: "Concluído",
  erro: "Erro",
};

export default function DocumentoPage() {
  const params = useParams();
  const documentoId = params.id as string;

  // Mock data - in production, fetch from API
  const [documento, setDocumento] = useState<DocumentoDetail>(mockDocumentoData);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<ValoresDocumento>(mockDocumentoData.valores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call to render/save documento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update documento status
      setDocumento((prev) => ({
        ...prev,
        status_render: "processando" as RenderStatus,
      }));

      setShowSuccess(true);
      // Simulate rendering completion after 3 seconds
      setTimeout(() => {
        setDocumento((prev) => ({
          ...prev,
          status_render: "concluido" as RenderStatus,
          arquivo_renderizado: `/files/documento-${documentoId}.pdf`,
        }));
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao processar documento"
      );
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (documento.arquivo_renderizado) {
      window.open(documento.arquivo_renderizado, "_blank");
    }
  };

  const getStatusColor = (status: RenderStatus) => {
    return statusColors[status];
  };

  const getStatusLabel = (status: RenderStatus) => {
    return statusLabels[status];
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Link href="/documentos">
          <Button startIcon={<BackIcon />} variant="text">
            Voltar
          </Button>
        </Link>
      </Box>

      {/* Document Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
              {documento.nome}
            </Typography>
            {documento.descricao && (
              <Typography variant="body2" color="text.secondary">
                {documento.descricao}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Template
                </Typography>
                <Typography variant="body1">
                  {documento.template_nome}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={getStatusLabel(documento.status_render)}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(documento.status_render),
                    color: "white",
                    mt: 0.5,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Criação
                </Typography>
                <Typography variant="body1">
                  {new Date(documento.criado_em).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Grid>

            {documento.status_render === "concluido" && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Arquivo Renderizado
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{ mt: 0.5 }}
                  >
                    Download
                  </Button>
                </Box>
              </Grid>
            )}

            {documento.status_render === "erro" && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Erro ao processar o documento. Tente novamente.
                </Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Status Message */}
      {documento.status_render === "processando" && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            textAlign: "center",
            backgroundColor: "info.light",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
            <CircularProgress size={24} />
            <Typography>
              Documento sendo processado. Por favor, aguarde...
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Form Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6">
            {isEditing ? "Editar Formulário" : "Dados do Formulário"}
          </Typography>
          {!isEditing && documento.status_render !== "concluido" && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              size="small"
            >
              Preencher
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <DynamicFormRenderer
          mode="editable"
          textFields={mockFormStructure.textFields}
          numberFields={mockFormStructure.numberFields}
          dateFields={mockFormStructure.dateFields}
          lists={mockFormStructure.lists}
          imageFields={mockFormStructure.imageFields}
          initialValues={formValues}
          isEditing={isEditing}
          onEditModeChange={setIsEditing}
          onValuesChange={setFormValues}
          showHeader={false}
          showFooterMessage={false}
        />
      </Paper>

      {/* Action Buttons */}
      {documento.status_render !== "concluido" && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mb: 4,
          }}
        >
          {isEditing && (
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditing(false);
                setFormValues(mockDocumentoData.valores);
              }}
            >
              Cancelar
            </Button>
          )}
          {isEditing && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => {
                setIsEditing(false);
                setShowSuccess(true);
              }}
              size="large"
            >
              Salvar Dados
            </Button>
          )}
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processando...
                </>
              ) : (
                "Renderizar Documento"
              )}
            </Button>
          )}
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Documento enviado para processamento com sucesso!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
