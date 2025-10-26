"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Description as DocIcon,
  ContentCut as SplitIcon,
} from "@mui/icons-material";

interface DocumentStructure {
  paragraphs: number;
  tables: number;
  images: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
  };
  totalHeadings: number;
}

interface PageBreaksInfo {
  count: number;
  locations: Array<{ paragraphIndex: number; type: string }>;
  note: string;
}

interface SplitResult {
  success: boolean;
  originalFile: string;
  structure?: DocumentStructure;
  pageBreaks?: PageBreaksInfo;
  totalSections?: number;
  totalParagraphs?: number;
  sections?: Array<{ sectionNumber: number; paragraphCount: number }>;
  message: string;
  error?: string;
}

export default function SplitDocxPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [splitMethod, setSplitMethod] = useState<"pages" | "sections">("pages");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.docx')) {
        setError('Por favor, selecione um arquivo .docx');
        return;
      }
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSplit = async (method: "pages" | "sections") => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo primeiro');
      return;
    }

    setLoading(true);
    setError(null);
    setSplitMethod(method);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const endpoint = method === 'pages' ? '/api/docx/split' : '/api/docx/split';
      const httpMethod = method === 'pages' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method: httpMethod,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar arquivo');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="text-foreground">
        Analisar Estrutura de Documento DOCX
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Demonstração da biblioteca <code>docx_editor</code> para analisar a estrutura interna de documentos Word
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Stack spacing={3}>
          {/* Upload Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              1. Selecione um arquivo DOCX
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ py: 2 }}
            >
              {selectedFile ? selectedFile.name : 'Escolher arquivo .docx'}
              <input
                type="file"
                hidden
                accept=".docx"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          <Divider />

          {/* Split Options */}
          <Box>
            <Typography variant="h6" gutterBottom>
              2. Escolha o tipo de análise
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<DocIcon />}
                onClick={() => handleSplit('pages')}
                disabled={!selectedFile || loading}
                fullWidth
              >
                {loading && splitMethod === 'pages' ? (
                  <CircularProgress size={24} />
                ) : (
                  'Analisar Estrutura'
                )}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SplitIcon />}
                onClick={() => handleSplit('sections')}
                disabled={!selectedFile || loading}
                fullWidth
              >
                {loading && splitMethod === 'sections' ? (
                  <CircularProgress size={24} />
                ) : (
                  'Analisar Seções'
                )}
              </Button>
            </Stack>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Results Display */}
          {result && (
            <Card variant="outlined" sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ✓ Resultado
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {result.message}
                </Typography>

                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Arquivo:</strong> {result.originalFile}
                  </Typography>
                </Box>

                {/* Document Structure */}
                {result.structure && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      📊 Estrutura do Documento
                    </Typography>
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        📝 <strong>Parágrafos:</strong> {result.structure.paragraphs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🖼️ <strong>Imagens:</strong> {result.structure.images}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📋 <strong>Tabelas:</strong> {result.structure.tables}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Títulos:</strong> Total {result.structure.totalHeadings}
                      </Typography>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          • Nível 1 (H1): {result.structure.headings.h1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Nível 2 (H2): {result.structure.headings.h2}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Nível 3 (H3): {result.structure.headings.h3}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Page Breaks */}
                {result.pageBreaks && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      📄 Quebras de Página Explícitas
                    </Typography>
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Total:</strong> {result.pageBreaks.count}
                      </Typography>
                      {result.pageBreaks.count > 0 && (
                        <List dense sx={{ mt: 1 }}>
                          {result.pageBreaks.locations.map((loc, idx) => (
                            <ListItem key={idx} dense>
                              <ListItemText
                                primary={`Parágrafo ${loc.paragraphIndex}`}
                                secondary={`Tipo: ${loc.type === 'explicit' ? 'Quebra manual' : 'Antes do parágrafo'}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {result.pageBreaks.note}
                      </Alert>
                    </Box>
                  </Box>
                )}

                {/* Sections List */}
                {result.sections && result.sections.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Seções encontradas:
                    </Typography>
                    <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                      {result.sections.map((section) => (
                        <React.Fragment key={section.sectionNumber}>
                          <ListItem>
                            <ListItemText
                              primary={`Seção ${section.sectionNumber}`}
                              secondary={`Parágrafos: ${section.paragraphCount}`}
                            />
                          </ListItem>
                          {section.sectionNumber < result.sections!.length && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Stack>
      </Paper>

      {/* Information Card */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ℹ️ Informações
          </Typography>
          <Typography variant="body2" paragraph>
            Esta página demonstra o uso da biblioteca <code>docx_editor</code> para analisar a estrutura de documentos DOCX.
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Análises disponíveis:</strong>
            <ul>
              <li>
                <strong>Analisar Estrutura:</strong> Conta parágrafos, imagens, tabelas, títulos (H1-H3) e
                detecta quebras de página explícitas
              </li>
              <li>
                <strong>Analisar Seções:</strong> Detecta seções do Word e conta parágrafos por seção
              </li>
            </ul>
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Importante:</strong> Esta ferramenta detecta apenas quebras de página <em>explícitas</em>
            (inseridas manualmente com Ctrl+Enter). O número real de páginas depende da renderização do documento
            e não pode ser determinado apenas pela análise do XML.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Nota:</strong> O arquivo não é armazenado no servidor. A análise é feita em memória.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
