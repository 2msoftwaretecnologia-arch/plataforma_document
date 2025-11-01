"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Description as DocIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import type { DocumentMetadata } from "@/lib/docxUtils";

export default function ViewerDocumentosPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load documents');
      }

      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Por favor, selecione um arquivo .docx');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      setSuccess(`Documento "${file.name}" enviado com sucesso! (${data.metadata.totalChunks} páginas criadas)`);
      await loadDocuments(); // Reload list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleViewDocument = (documentId: string) => {
    router.push(`/viewer-documentos/${documentId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="text-foreground">
        Visualizador de Documentos DOCX
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload, visualização dinâmica e download de documentos grandes
      </Typography>

      {/* Upload Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload de Documento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Envie um arquivo DOCX para divisão em páginas
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={uploading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {uploading ? 'Enviando...' : 'Escolher arquivo DOCX'}
          <input
            type="file"
            hidden
            accept=".docx"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </Button>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>

      {/* Documents List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Documentos Enviados
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : documents.length === 0 ? (
          <Alert severity="info">
            Nenhum documento encontrado. Faça upload de um arquivo DOCX para começar.
          </Alert>
        ) : (
          <List>
            {documents.map((doc, index) => (
              <React.Fragment key={doc.documentId}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Button
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewDocument(doc.documentId)}
                    >
                      Visualizar
                    </Button>
                  }
                >
                  <ListItemButton onClick={() => handleViewDocument(doc.documentId)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <DocIcon color="primary" />
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {doc.originalName}
                          </Typography>
                          <Chip
                            label={`${doc.totalChunks} páginas`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            📝 {doc.totalParagraphs} parágrafos
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📅 {formatDate(doc.uploadedAt)}
                          </Typography>
                        </Stack>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Info Card */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ℹ️ Como funciona
          </Typography>
          <Box component="ol" sx={{ fontSize: '0.875rem', pl: 2.5 }}>
            <li>
              <strong>Upload:</strong> Envie um documento DOCX. O sistema divide automaticamente
              em páginas de ~50 parágrafos (aprox. 3 páginas cada)
            </li>
            <li>
              <strong>Visualização:</strong> Navegue página por página através do documento,
              carregando o conteúdo sob demanda
            </li>
            <li>
              <strong>Download:</strong> Mescle as páginas de volta e baixe o documento final
            </li>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Ideal para:</strong> Documentos grandes (&gt;50 páginas) que precisam de
            visualização rápida sem carregar todo o conteúdo de uma vez.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}
