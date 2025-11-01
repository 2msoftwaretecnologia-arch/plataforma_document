import PizZip from 'pizzip';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface PageBreak {
  paragraphIndex: number;
  type: 'explicit' | 'before';
}

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  startParagraph: number;
  endParagraph: number;
  totalParagraphs: number;
}

export interface DocumentMetadata {
  documentId: string;
  originalName: string;
  totalParagraphs: number;
  totalChunks: number;
  paragraphsPerChunk: number;
  chunks: DocumentChunk[];
  uploadedAt: string;
}

const PARAGRAPHS_PER_CHUNK = 50; // Aproximadamente 3 páginas

/**
 * Analisa um DOCX e retorna metadados
 */
export async function analyzeDocx(buffer: Buffer): Promise<{
  totalParagraphs: number;
  pageBreaks: PageBreak[];
}> {
  const zip = new PizZip(buffer);
  const docXml = zip.file('word/document.xml')?.asText();

  if (!docXml) {
    throw new Error('Invalid DOCX file: missing document.xml');
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const doc = parser.parse(docXml);
  const body = doc['w:document']?.['w:body'];

  if (!body) {
    throw new Error('Invalid DOCX structure');
  }

  const paragraphs = body['w:p'];
  if (!paragraphs) {
    return { totalParagraphs: 0, pageBreaks: [] };
  }

  const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
  const pageBreaks: PageBreak[] = [];

  paraArray.forEach((para: any, index: number) => {
    // Check for page break before
    if (para['w:pPr']?.['w:pageBreakBefore']) {
      pageBreaks.push({ paragraphIndex: index, type: 'before' });
    }

    // Check for explicit page break in runs
    const runs = para['w:r'];
    if (runs) {
      const runArray = Array.isArray(runs) ? runs : [runs];
      runArray.forEach((run: any) => {
        if (run['w:br']?.['@_w:type'] === 'page') {
          pageBreaks.push({ paragraphIndex: index, type: 'explicit' });
        }
      });
    }
  });

  return {
    totalParagraphs: paraArray.length,
    pageBreaks,
  };
}

/**
 * Divide um DOCX em chunks menores
 */
export async function splitDocxIntoChunks(
  buffer: Buffer,
  documentId: string,
  originalName: string
): Promise<{ metadata: DocumentMetadata; chunks: Buffer[] }> {
  const zip = new PizZip(buffer);
  const docXml = zip.file('word/document.xml')?.asText();

  if (!docXml) {
    throw new Error('Invalid DOCX file');
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
  });

  const doc = parser.parse(docXml);
  const body = doc['w:document']?.['w:body'];
  const paragraphs = body['w:p'];

  if (!paragraphs) {
    throw new Error('No paragraphs found');
  }

  const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
  const totalParagraphs = paraArray.length;
  const totalChunks = Math.ceil(totalParagraphs / PARAGRAPHS_PER_CHUNK);

  const chunks: Buffer[] = [];
  const chunkMetadata: DocumentChunk[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const startIdx = i * PARAGRAPHS_PER_CHUNK;
    const endIdx = Math.min(startIdx + PARAGRAPHS_PER_CHUNK, totalParagraphs);
    const chunkParagraphs = paraArray.slice(startIdx, endIdx);

    // Create chunk document
    const chunkDoc = {
      ...doc,
      'w:document': {
        ...doc['w:document'],
        'w:body': {
          ...body,
          'w:p': chunkParagraphs,
        },
      },
    };

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: false,
      suppressEmptyNode: true,
    });

    const chunkXml = builder.build(chunkDoc);

    // Create new ZIP with chunk
    const chunkZip = new PizZip();

    // Copy all files from original
    const files = zip.files;
    Object.keys(files).forEach((relativePath) => {
      const file = files[relativePath];
      if (relativePath === 'word/document.xml') {
        chunkZip.file(relativePath, chunkXml);
      } else if (!file.dir) {
        const content = file.asNodeBuffer();
        chunkZip.file(relativePath, content);
      }
    });

    const chunkBuffer = chunkZip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });
    chunks.push(chunkBuffer);

    chunkMetadata.push({
      id: `${documentId}-chunk-${i}`,
      chunkIndex: i,
      startParagraph: startIdx,
      endParagraph: endIdx,
      totalParagraphs: chunkParagraphs.length,
    });
  }

  const metadata: DocumentMetadata = {
    documentId,
    originalName,
    totalParagraphs,
    totalChunks,
    paragraphsPerChunk: PARAGRAPHS_PER_CHUNK,
    chunks: chunkMetadata,
    uploadedAt: new Date().toISOString(),
  };

  return { metadata, chunks };
}

/**
 * Mescla chunks de volta em um documento completo
 */
export async function mergeChunksIntoDocx(chunkBuffers: Buffer[]): Promise<Buffer> {
  if (chunkBuffers.length === 0) {
    throw new Error('No chunks to merge');
  }

  if (chunkBuffers.length === 1) {
    return chunkBuffers[0];
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
  });

  // Parse first chunk as base
  const baseZip = new PizZip(chunkBuffers[0]);
  const baseDocXml = baseZip.file('word/document.xml')?.asText();

  if (!baseDocXml) {
    throw new Error('Invalid base chunk');
  }

  const baseDoc = parser.parse(baseDocXml);
  let allParagraphs = baseDoc['w:document']['w:body']['w:p'];
  allParagraphs = Array.isArray(allParagraphs) ? allParagraphs : [allParagraphs];

  // Merge paragraphs from other chunks
  for (let i = 1; i < chunkBuffers.length; i++) {
    const chunkZip = new PizZip(chunkBuffers[i]);
    const chunkDocXml = chunkZip.file('word/document.xml')?.asText();

    if (!chunkDocXml) continue;

    const chunkDoc = parser.parse(chunkDocXml);
    let chunkParas = chunkDoc['w:document']['w:body']['w:p'];
    chunkParas = Array.isArray(chunkParas) ? chunkParas : [chunkParas];

    allParagraphs = allParagraphs.concat(chunkParas);
  }

  // Rebuild document
  const mergedDoc = {
    ...baseDoc,
    'w:document': {
      ...baseDoc['w:document'],
      'w:body': {
        ...baseDoc['w:document']['w:body'],
        'w:p': allParagraphs,
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: false,
    suppressEmptyNode: true,
  });

  const mergedXml = builder.build(mergedDoc);

  // Create final ZIP
  const finalZip = new PizZip();

  const files = baseZip.files;
  Object.keys(files).forEach((relativePath) => {
    const file = files[relativePath];
    if (relativePath === 'word/document.xml') {
      finalZip.file(relativePath, mergedXml);
    } else if (!file.dir) {
      const content = file.asNodeBuffer();
      finalZip.file(relativePath, content);
    }
  });

  return finalZip.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });
}
