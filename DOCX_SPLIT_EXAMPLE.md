# DOCX Analysis Example - docx_editor Integration

This example demonstrates how to use the `docx_editor` npm library to analyze DOCX file structure, detecting page breaks and sections.

## Files Created

### 1. API Route: `/src/app/api/docx/split/route.ts`

Backend API endpoint that analyzes DOCX file structure:

- **POST /api/docx/split** - Analyzes document for page breaks
- **PUT /api/docx/split** - Analyzes document for sections

**Features:**
- Accepts DOCX file upload via FormData
- Extracts and parses document XML structure
- Detects page breaks (`w:br` with `type="page"`)
- Detects section breaks (`w:sectPr`)
- Counts paragraphs and structural elements
- Processes files in memory (no disk storage)
- Returns metadata about pages/sections
- Error handling with detailed messages

### 2. Frontend Page: `/src/app/split-docx/page.tsx`

User interface for uploading and analyzing DOCX files:

**Features:**
- File upload with validation (.docx only)
- Two analysis methods:
  - Analyze by Page Breaks
  - Analyze by Sections
- Real-time loading states
- Results display showing:
  - Total paragraphs in document
  - Page/section numbers
  - Starting paragraph index for each page
  - Paragraph count for each section
- Error handling with user-friendly messages
- Responsive Material-UI design
- Theme-aware (light/dark mode)

### 3. Sidebar Integration

Added navigation link in [Sidebar.tsx](src/components/sidebar/Sidebar.tsx) with ContentCut icon.

## How to Use

### 1. Access the Page

Navigate to `/split-docx` in your browser or click "Dividir DOCX" in the sidebar.

### 2. Upload a DOCX File

Click the "Escolher arquivo .docx" button and select a DOCX file from your computer.

### 3. Choose Analysis Method

- **Analisar por Páginas**: Detects page breaks in the document
- **Analisar por Seções**: Detects Word sections in the document

### 4. View Results

The page will display:
- Original filename
- Total number of paragraphs
- Total number of pages/sections detected
- For pages: starting paragraph index
- For sections: paragraph count
- Success/error messages

## Technical Details

### Dependencies

```json
{
  "docx_editor": "^latest"
}
```

### API Request Flow

```
Client Upload → FormData → Next.js API Route → DocumentEditor.extract() →
DocumentEditor.parse() → XML Analysis → Response
```

### Code Example

```typescript
// Backend (API Route)
import DocumentEditor from 'docx_editor';

const editor = new DocumentEditor();
await editor.extract(buffer); // Extract DOCX to temp directory

// Parse the document XML
editor.parse('word/document.xml', (doc: any) => {
  const body = doc['w:document']?.['w:body'];
  const paragraphs = body['w:p']; // Access paragraphs

  // Analyze structure
  paragraphs.forEach((para: any) => {
    const runs = para['w:r'];
    // Check for page breaks: run['w:br']['@_w:type'] === 'page'
    // Check for sections: para['w:pPr']['w:sectPr']
  });

  return null; // Required return
});
```

### Response Format (Pages)

```json
{
  "success": true,
  "originalFile": "document.docx",
  "totalPages": 3,
  "totalParagraphs": 45,
  "pages": [
    { "pageNumber": 1, "startsAtParagraph": 0 },
    { "pageNumber": 2, "startsAtParagraph": 15 },
    { "pageNumber": 3, "startsAtParagraph": 30 }
  ],
  "message": "Document analyzed: 3 page(s) found with 45 paragraphs"
}
```

### Response Format (Sections)

```json
{
  "success": true,
  "originalFile": "document.docx",
  "totalSections": 2,
  "totalParagraphs": 45,
  "sections": [
    { "sectionNumber": 1, "paragraphCount": 25 },
    { "sectionNumber": 2, "paragraphCount": 20 }
  ],
  "message": "Document analyzed: 2 section(s) found with 45 total paragraphs"
}
```

## docx_editor Library Methods

### Used in This Example

1. **new DocumentEditor(options?)** - Initialize editor
   - Options: `{ debug?, workDirectory?, documentName? }`

2. **extract(buffer)** - Extract DOCX to working directory
   - Returns: `Promise<DocumentEditor | null>`
   - Unzips DOCX and extracts all XML files

3. **parse(target, callback)** - Parse and modify XML file
   - `target`: Relative path like `'word/document.xml'`
   - `callback`: Function that receives parsed XML object
   - Callback must return `DocumentEditor | null`

4. **archive()** - Re-archive the document
   - Returns: `Promise<Buffer | null>`
   - Creates a new DOCX buffer from modified files

### Additional Methods Available

- **mkdir(path)** - Create directory in extracted document
- **writeFile(path, data)** - Write file to extracted document

The library works by:
1. Extracting DOCX (ZIP format) to temp directory
2. Parsing XML files using fast-xml-parser
3. Allowing modifications to parsed XML objects
4. Re-archiving back to DOCX format

See the [docx_editor repository](https://github.com/Sovgut/docx_editor) for more details.

## Example Use Cases

1. **Document Analysis**: Analyze document structure before processing
2. **Page Detection**: Identify where page breaks occur for pagination
3. **Section Analysis**: Understand document organization and sections
4. **Content Mapping**: Map paragraphs to pages for content extraction
5. **Quality Control**: Verify document structure meets requirements
6. **Preprocessing**: Gather metadata before document transformation

## Security Considerations

- Files are processed in memory only (not saved to disk)
- No file size limit enforced (consider adding in production)
- Input validation ensures only .docx files are accepted
- No authentication required for demo (add in production)

## Future Enhancements

Potential improvements:

- [ ] Extract and download individual pages as separate DOCX files
- [ ] Preview paragraph content for each page/section
- [ ] Batch processing of multiple files
- [ ] Save analysis results to database
- [ ] Add file size limits and validation
- [ ] Extract text content from each section
- [ ] Detect and analyze headings, tables, images
- [ ] Custom analysis criteria (by heading level, by style)
- [ ] Visual document structure diagram
- [ ] Compare structure between multiple documents

## Testing

To test the functionality:

1. Create a DOCX file with multiple pages and/or sections in Microsoft Word
2. Add page breaks using Ctrl+Enter or Insert > Page Break
3. Add sections using Layout > Breaks > Section Breaks
4. Upload the file through the interface
5. Try both split methods and compare results

## Troubleshooting

### Common Issues

**File upload fails:**
- Ensure file has .docx extension
- Check file is not corrupted
- Verify file size is reasonable

**No pages found:**
- Document may not have page breaks
- Try "Split by Sections" instead

**API returns 500 error:**
- Check server logs for details
- Verify docx_editor is installed: `npm list docx_editor`
- File may be incompatible format

## Related Files

- API Route: [src/app/api/docx/split/route.ts](src/app/api/docx/split/route.ts)
- Frontend Page: [src/app/split-docx/page.tsx](src/app/split-docx/page.tsx)
- Sidebar Component: [src/components/sidebar/Sidebar.tsx](src/components/sidebar/Sidebar.tsx)

---

**Created**: 2025-10-25
**Library**: [docx_editor](https://www.npmjs.com/package/docx_editor)
**Framework**: Next.js 15.5.4 + React 19
