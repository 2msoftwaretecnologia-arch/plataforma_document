"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  MergeType as MergeIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import type { DocumentMetadata } from "@/lib/docxUtils";
// @ts-ignore - mammoth doesn't have official types
import mammoth from "mammoth";

export default function DocumentViewerPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.documentId as string;

  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedChunks, setLoadedChunks] = useState<Map<number, Blob>>(new Map());
  const [chunkHtmlContent, setChunkHtmlContent] = useState<Map<number, string>>(new Map());
  const [merging, setMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);

  useEffect(() => {
    loadMetadata();
  }, [documentId]);

  useEffect(() => {
    // Load current page when it changes
    if (metadata) {
      const pageIndex = currentPage - 1;
      loadChunk(pageIndex);
    }
  }, [currentPage, metadata]);

  const loadMetadata = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load documents');
      }

      const doc = data.documents?.find((d: DocumentMetadata) => d.documentId === documentId);

      if (!doc) {
        throw new Error('Document not found');
      }

      setMetadata(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadChunk = useCallback(
    async (chunkIndex: number) => {
      if (loadedChunks.has(chunkIndex)) return;

      try {
        const response = await fetch(`/api/documents/${documentId}/chunk/${chunkIndex}`);

        if (!response.ok) {
          console.error(`Failed to load chunk ${chunkIndex}`);
          return;
        }

        const blob = await response.blob();
        setLoadedChunks((prev) => new Map(prev).set(chunkIndex, blob));

        // Convert DOCX blob to HTML using mammoth
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setChunkHtmlContent((prev) => new Map(prev).set(chunkIndex, result.value));
      } catch (err) {
        console.error(`Error loading chunk ${chunkIndex}:`, err);
      }
    },
    [documentId, loadedChunks]
  );

  const handleMergeDocument = async () => {
    setMerging(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${documentId}/merge`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to merge document');
      }

      setMergeSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setMerging(false);
    }
  };

  const handleDownload = () => {
    window.open(`/api/documents/${documentId}/download`, '_blank');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (metadata && currentPage < metadata.totalChunks) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentPageIndex = currentPage - 1;
  const currentChunk = loadedChunks.get(currentPageIndex);
  const currentHtml = chunkHtmlContent.get(currentPageIndex);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !metadata) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Document not found'}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {metadata.originalName}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip label={`${metadata.totalChunks} páginas`} color="primary" variant="outlined" />
            <Chip label={`${metadata.totalParagraphs} parágrafos`} variant="outlined" />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Action Bar */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={merging ? <CircularProgress size={20} /> : <MergeIcon />}
            onClick={handleMergeDocument}
            disabled={merging || mergeSuccess}
          >
            {merging ? 'Mesclando...' : mergeSuccess ? 'Documento Mesclado' : 'Mesclar Documento'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!mergeSuccess}
          >
            Download Final
          </Button>
          {mergeSuccess && (
            <Alert severity="success" sx={{ flex: 1 }}>
              Documento mesclado com sucesso! Clique em "Download Final" para baixar.
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Page Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Paper
          elevation={2}
          sx={{
            maxWidth: 900,
            mx: 'auto',
            p: 4,
            minHeight: 600,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {currentChunk ? (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Chip
                  label={`Página ${currentPage} de ${metadata.totalChunks}`}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  {(currentChunk.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              {currentHtml ? (
                <Box
                  sx={{
                    '& p': { mb: 2, fontSize: '1rem', lineHeight: 1.7 },
                    '& h1': { fontSize: '2rem', fontWeight: 'bold', mt: 3, mb: 2 },
                    '& h2': { fontSize: '1.75rem', fontWeight: 'bold', mt: 3, mb: 2 },
                    '& h3': { fontSize: '1.5rem', fontWeight: 'bold', mt: 2, mb: 1.5 },
                    '& h4, & h5, & h6': { fontSize: '1.25rem', fontWeight: 'bold', mt: 2, mb: 1 },
                    '& ul, & ol': { pl: 4, mb: 2 },
                    '& li': { mb: 0.5 },
                    '& strong': { fontWeight: 600 },
                    '& em': { fontStyle: 'italic' },
                    lineHeight: 1.7,
                    textAlign: 'justify'
                  }}
                  dangerouslySetInnerHTML={{ __html: currentHtml }}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress size={50} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
                    Convertendo conteúdo da página...
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
                Carregando página {currentPage}...
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Page Navigation */}
      <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.default' }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <Pagination
            count={metadata.totalChunks}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />

          <Button
            variant="outlined"
            endIcon={<NextIcon />}
            onClick={handleNextPage}
            disabled={currentPage === metadata.totalChunks}
          >
            Próxima
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
