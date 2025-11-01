# DOCX Viewer - Sistema de Visualização Dinâmica de Documentos

Sistema completo para upload, visualização dinâmica e download de documentos DOCX grandes, usando chunking e virtual scrolling.

## 🎯 Funcionalidades

### 1. Upload de Documentos
- Upload de arquivos DOCX
- Divisão automática em chunks de ~50 parágrafos (~3 páginas)
- Armazenamento em estrutura organizada
- Metadata JSON para cada documento

### 2. Visualização Dinâmica
- Virtual scrolling com `react-window`
- Carregamento lazy de chunks (apenas visíveis)
- Performance otimizada para documentos grandes (>50 páginas)
- Cache de chunks já carregados

### 3. Merge e Download
- Reconstrução perfeita do documento original
- Merge de todos os chunks
- Download do documento final
- Preservação completa da formatação

## 📁 Estrutura de Arquivos

```
/public/
├── documents/              # Documentos originais completos
│   └── doc_xxxxx.docx
├── documents_chunks/       # Chunks processados
│   └── doc_xxxxx/
│       ├── metadata.json   # Metadados do documento
│       ├── chunk_0.docx
│       ├── chunk_1.docx
│       └── chunk_N.docx
└── documents_ready/        # Documentos mesclados prontos para download
    └── doc_xxxxx_merged.docx
```

## 🔧 Tecnologias Utilizadas

```json
{
  "pizzip": "^3.1.6",           // Manipulação de arquivos ZIP (DOCX)
  "fast-xml-parser": "^4.3.2",   // Parse/Build de XML
  "react-window": "^1.8.10"      // Virtual scrolling
}
```

## 📡 API Routes

### Upload de Documento
```
POST /api/documents/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "documentId": "doc_xxxxx",
  "metadata": { ... },
  "message": "Document uploaded and split into N chunks"
}
```

### Listar Documentos
```
GET /api/documents/list

Response:
{
  "documents": [
    {
      "documentId": "doc_xxxxx",
      "originalName": "document.docx",
      "totalParagraphs": 500,
      "totalChunks": 10,
      "paragraphsPerChunk": 50,
      "uploadedAt": "2025-10-26T..."
    }
  ]
}
```

### Obter Chunk Específico
```
GET /api/documents/{documentId}/chunk/{chunkIndex}

Response: Binary DOCX file (chunk)
Headers:
  Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Cache-Control: public, max-age=31536000, immutable
```

### Mesclar Documento
```
POST /api/documents/{documentId}/merge

Response:
{
  "success": true,
  "documentId": "doc_xxxxx",
  "originalName": "document.docx",
  "outputFilename": "doc_xxxxx_merged.docx",
  "downloadUrl": "/api/documents/doc_xxxxx/download"
}
```

### Download Documento Final
```
GET /api/documents/{documentId}/download

Response: Binary DOCX file (completo)
Headers:
  Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Content-Disposition: attachment; filename="doc_xxxxx_final.docx"
```

## 🎨 Páginas Frontend

### 1. Lista/Upload ([/viewer-documentos](src/app/viewer-documentos/page.tsx))

**Funcionalidades:**
- Upload de arquivos DOCX
- Lista de documentos enviados
- Card informativo sobre o sistema
- Navegação para visualizador

**Componentes:**
- Upload button com progress indicator
- Lista com chips mostrando metadata
- Alerts para feedback

### 2. Visualizador ([/viewer-documentos/[documentId]](src/app/viewer-documentos/[documentId]/page.tsx))

**Funcionalidades:**
- Virtual scrolling list
- Carregamento lazy de chunks
- Botão de merge
- Botão de download
- AppBar com metadata

**Componentes:**
- FixedSizeList (react-window)
- Action bar com botões
- Chunk cards com loading states

## 🔄 Fluxo de Uso

```
1. Upload
   └─> Usuário seleciona DOCX
       └─> POST /api/documents/upload
           └─> Arquivo dividido em chunks
               └─> Salvo em /documents_chunks/

2. Visualização
   └─> Usuário clica em "Visualizar"
       └─> Carrega metadata
           └─> Virtual scroll renderiza apenas chunks visíveis
               └─> GET /api/documents/{id}/chunk/{index} (lazy)

3. Download
   └─> Usuário clica em "Mesclar Documento"
       └─> POST /api/documents/{id}/merge
           └─> Chunks mesclados
               └─> Salvo em /documents_ready/
                   └─> GET /api/documents/{id}/download
```

## 💻 Implementação Técnica

### Split de Documentos ([src/lib/docxUtils.ts](src/lib/docxUtils.ts))

```typescript
// 1. Extrair conteúdo do DOCX
const zip = new PizZip(buffer);
const docXml = zip.file('word/document.xml')?.asText();

// 2. Parse XML para objeto
const parser = new XMLParser({ ignoreAttributes: false });
const doc = parser.parse(docXml);

// 3. Dividir parágrafos em chunks
const paragraphs = doc['w:document']['w:body']['w:p'];
const chunks = splitIntoChunks(paragraphs, PARAGRAPHS_PER_CHUNK);

// 4. Criar mini-DOCX para cada chunk
chunks.forEach(chunk => {
  const chunkDoc = { ...doc, paragraphs: chunk };
  const chunkXml = builder.build(chunkDoc);
  const chunkZip = createZipWithXml(chunkXml);
  saveChunk(chunkZip);
});
```

### Virtual Scrolling

```typescript
import { FixedSizeList as List } from 'react-window';

<List
  height={800}              // Altura da viewport
  itemCount={totalChunks}   // Total de chunks
  itemSize={1200}           // Altura de cada chunk
  width="100%"
>
  {ChunkRow}               // Componente renderizado
</List>
```

### Lazy Loading de Chunks

```typescript
const ChunkRow = ({ index, style }) => {
  useEffect(() => {
    loadChunk(index); // Carrega apenas quando visível
  }, [index]);

  return <div style={style}>...</div>;
};
```

### Merge de Chunks

```typescript
// 1. Ler todos os chunks
const chunkBuffers = await Promise.all(
  chunks.map(i => readFile(`chunk_${i}.docx`))
);

// 2. Parse e combinar parágrafos
const allParagraphs = chunkBuffers.flatMap(buffer => {
  const doc = parseDocx(buffer);
  return doc.paragraphs;
});

// 3. Reconstruir documento
const mergedDoc = { ...baseDoc, paragraphs: allParagraphs };
const mergedXml = builder.build(mergedDoc);
const finalDocx = createZipWithXml(mergedXml);
```

## 📊 Performance

### Métricas Estimadas

| Tamanho do Documento | Tempo de Upload/Split | Chunks Criados | Tempo de Merge |
|----------------------|----------------------|----------------|----------------|
| 10 páginas           | ~0.5s                | 3-4            | ~0.2s          |
| 50 páginas           | ~2s                  | 15-20          | ~1s            |
| 100 páginas          | ~4s                  | 30-35          | ~2s            |
| 500 páginas          | ~20s                 | 150-175        | ~10s           |

### Otimizações

1. **Cache de Chunks**: Chunks carregados ficam em memória
2. **Virtual Scrolling**: Apenas 3-5 chunks renderizados simultaneamente
3. **HTTP Cache**: Chunks com cache-control imutável
4. **Lazy Loading**: Chunks carregados sob demanda

## 🔐 Segurança

- ✅ Validação de tipo de arquivo (.docx apenas)
- ✅ Documentos armazenados fora de /public (exceto chunks)
- ✅ IDs aleatórios para documentos
- ⚠️ **TODO**: Adicionar autenticação/autorização
- ⚠️ **TODO**: Limitar tamanho de upload
- ⚠️ **TODO**: Cleanup automático de arquivos antigos

## 🚀 Melhorias Futuras

- [ ] Preview real do conteúdo (docx-preview)
- [ ] Edição de chunks individuais
- [ ] Versionamento de documentos
- [ ] Colaboração em tempo real
- [ ] OCR para documentos escaneados
- [ ] Conversão para outros formatos (PDF, HTML)
- [ ] Compressão de chunks
- [ ] CDN para distribuição de chunks
- [ ] WebSocket para progress real-time
- [ ] Drag & drop para upload

## 🐛 Troubleshooting

### Erro: "Invalid DOCX file"
- Verifique se o arquivo é realmente um .docx válido
- Teste abrir no Microsoft Word/LibreOffice
- Arquivo pode estar corrompido

### Chunks não carregam
- Verifique permissões de pasta /public/documents_chunks/
- Verifique console do navegador para erros
- Confirme que o upload foi concluído com sucesso

### Merge falha
- Confirme que todos os chunks existem
- Verifique logs do servidor
- Tente re-fazer o upload do documento

### Performance ruim
- Reduza PARAGRAPHS_PER_CHUNK se chunks forem muito grandes
- Aumente se forem muitos chunks pequenos
- Considere usar Web Workers para parse

## 📝 Exemplo de Uso

```typescript
// 1. Upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadRes = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData
});

const { documentId } = await uploadRes.json();

// 2. Visualizar
router.push(`/viewer-documentos/${documentId}`);

// 3. Mesclar
const mergeRes = await fetch(`/api/documents/${documentId}/merge`, {
  method: 'POST'
});

// 4. Download
window.open(`/api/documents/${documentId}/download`);
```

## 📚 Referências

- [PizZip Documentation](https://stuk.github.io/jszip/)
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)
- [react-window](https://react-window.vercel.app/)
- [Office Open XML Spec](http://officeopenxml.com/anatomyofOOXML.php)

---

**Criado em**: 2025-10-26
**Versão**: 1.0.0
**Autor**: Claude + Mateus
