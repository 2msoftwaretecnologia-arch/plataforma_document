"use client";

import { RenderStatus } from "@/models/Documento";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  RemoveRedEye as EyeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";

// Interface local para documento com dados de exibição
interface DocumentoDisplay {
  id: string;
  nome: string;
  descricao: string | null;
  status_render: RenderStatus;
  template: string;
  criado_em: string;
  arquivo_renderizado: string | null;
}

// Mock data for documents
const mockDocuments: DocumentoDisplay[] = [
  {
    id: "1",
    nome: "Contrato de Prestação de Serviços",
    descricao: "Contrato modelo para prestação de serviços gerais",
    status_render: "concluido",
    template: "Contrato Padrão",
    criado_em: "2025-10-15T10:30:00Z",
    arquivo_renderizado: "/files/doc-1.pdf",
  },
  {
    id: "2",
    nome: "Proposta Comercial - Empresa XYZ",
    descricao: "Proposta de vendas para cliente corporativo",
    status_render: "concluido",
    template: "Proposta",
    criado_em: "2025-10-14T14:20:00Z",
    arquivo_renderizado: "/files/doc-2.pdf",
  },
  {
    id: "3",
    nome: "Relatório de Avaliação",
    descricao: "Relatório de desempenho do funcionário",
    status_render: "processando",
    template: "Relatório",
    criado_em: "2025-10-13T09:15:00Z",
    arquivo_renderizado: null,
  },
  {
    id: "4",
    nome: "Termo de Confidencialidade",
    descricao: "Acordo de NDA com fornecedor",
    status_render: "pendente",
    template: "NDA",
    criado_em: "2025-10-12T16:45:00Z",
    arquivo_renderizado: null,
  },
];

// Mock templates
const mockTemplates = [
  { id: "1", nome: "Contrato Padrão" },
  { id: "2", nome: "Proposta" },
  { id: "3", nome: "Relatório" },
  { id: "4", nome: "NDA" },
  { id: "5", nome: "Recibo" },
];

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

export default function DocumentosPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentoDisplay | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    template: "",
  });

  // Filter documents based on search and template
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesTemplate =
        selectedTemplate === "" || doc.template === selectedTemplate;
      return matchesSearch && matchesTemplate;
    });
  }, [documents, searchTerm, selectedTemplate]);

  const handleOpenDialog = (doc: DocumentoDisplay | null = null) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        nome: doc.nome,
        descricao: doc.descricao ?? "",
        template: doc.template,
      });
    } else {
      setEditingDoc(null);
      setFormData({
        nome: "",
        descricao: "",
        template: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoc(null);
    setFormData({
      nome: "",
      descricao: "",
      template: "",
    });
  };

  const handleSaveDocument = () => {
    if (!formData.nome.trim() || !formData.template) {
      alert("Por favor, preencha o nome e selecione um template");
      return;
    }

    if (editingDoc) {
      setDocuments(
        documents.map((doc) =>
          doc.id === editingDoc.id ? { ...doc, ...formData } : doc
        )
      );
    } else {
      const newDoc = {
        id: Date.now().toString(),
        ...formData,
        status_render: "pendente" as const,
        criado_em: new Date().toISOString(),
        arquivo_renderizado: null,
      };
      setDocuments([...documents, newDoc]);
    }

    handleCloseDialog();
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const getStatusColor = (status: RenderStatus) => {
    return statusColors[status] || "#999";
  };

  const getStatusLabel = (status: RenderStatus) => {
    return statusLabels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Documentos</h1>
        <p className="text-foreground/60">
          Gerencie seus documentos renderizados a partir de templates
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
        <TextField
          label="Buscar documentos"
          placeholder="Digite o nome ou descrição"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="mr-2" />,
          }}
          size="small"
          className="flex-1 min-w-[250px]"
        />

        <FormControl size="small" className="w-full md:w-[250px]">
          <InputLabel>Filtrar por Template</InputLabel>
          <Select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            label="Filtrar por Template"
          >
            <MenuItem value="">Todos os templates</MenuItem>
            {mockTemplates.map((template) => (
              <MenuItem key={template.id} value={template.nome}>
                {template.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          className="w-full md:w-auto"
        >
          Novo Documento
        </Button>
      </div>

      {/* Documents Table */}
      <TableContainer component={Paper} className="bg-background">
        <Table>
          <TableHead>
            <TableRow className="bg-muted">
              <TableCell className="font-semibold text-foreground">
                Nome
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                Descrição
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                Template
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                Status
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                Criação
              </TableCell>
              <TableCell align="right" className="font-semibold text-foreground">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="hover:bg-muted/50 transition-colors border-b border-border"
                >
                  <TableCell className="font-medium text-foreground">
                    {doc.nome}
                  </TableCell>
                  <TableCell className="text-foreground/70 max-w-xs truncate">
                    {doc.descricao}
                  </TableCell>
                  <TableCell className="text-foreground">{doc.template}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(doc.status_render)}
                      size="small"
                      style={{
                        backgroundColor: getStatusColor(doc.status_render),
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-foreground/70">
                    {new Date(doc.criado_em).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip title="Visualizar">
                        <Link href={`/documentos/${doc.id}`}>
                          <IconButton
                            size="small"
                          >
                            <EyeIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(doc)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {doc.status_render === "concluido" && doc.arquivo_renderizado && (
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            href={doc.arquivo_renderizado}
                            download
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" className="py-8">
                  <p className="text-foreground/60">
                    Nenhum documento encontrado
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Document Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground bg-background">
          {editingDoc ? "Editar Documento" : "Novo Documento"}
        </DialogTitle>
        <DialogContent className="bg-background space-y-4 pt-4">
          <TextField
            label="Nome do Documento"
            fullWidth
            value={formData.nome}
            onChange={(e) =>
              setFormData({ ...formData, nome: e.target.value })
            }
            className="text-foreground"
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
            className="text-foreground"
          />
          <FormControl fullWidth>
            <InputLabel>Template</InputLabel>
            <Select
              value={formData.template}
              onChange={(e) =>
                setFormData({ ...formData, template: e.target.value })
              }
              label="Template"
            >
              {mockTemplates.map((template) => (
                <MenuItem key={template.id} value={template.nome}>
                  {template.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="bg-background border-t border-border p-4">
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveDocument}
            variant="contained"
          >
            {editingDoc ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
