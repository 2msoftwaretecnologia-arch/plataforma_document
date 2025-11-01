import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { mergeChunksIntoDocx } from '@/lib/docxUtils';
import type { DocumentMetadata } from '@/lib/docxUtils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const chunksDir = path.join(
      process.cwd(),
      'public',
      'documents_chunks',
      documentId
    );

    if (!existsSync(chunksDir)) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Read metadata
    const metadataPath = path.join(chunksDir, 'metadata.json');
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata: DocumentMetadata = JSON.parse(metadataContent);

    // Read all chunks
    const chunkFiles = await readdir(chunksDir);
    const chunkBuffers: Buffer[] = [];

    const sortedChunks = chunkFiles
      .filter((file) => file.startsWith('chunk_') && file.endsWith('.docx'))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/chunk_(\d+)\.docx/)?.[1] || '0');
        const bNum = parseInt(b.match(/chunk_(\d+)\.docx/)?.[1] || '0');
        return aNum - bNum;
      });

    for (const chunkFile of sortedChunks) {
      const chunkPath = path.join(chunksDir, chunkFile);
      const chunkBuffer = await readFile(chunkPath);
      chunkBuffers.push(chunkBuffer);
    }

    // Merge chunks
    const mergedBuffer = await mergeChunksIntoDocx(chunkBuffers);

    // Save merged document
    const readyDir = path.join(process.cwd(), 'public', 'documents_ready');
    if (!existsSync(readyDir)) {
      await mkdir(readyDir, { recursive: true });
    }

    const outputFilename = `${documentId}_merged.docx`;
    const outputPath = path.join(readyDir, outputFilename);
    await writeFile(outputPath, mergedBuffer);

    return NextResponse.json({
      success: true,
      documentId,
      originalName: metadata.originalName,
      outputFilename,
      downloadUrl: `/api/documents/${documentId}/download`,
      message: 'Document merged successfully',
    });
  } catch (error) {
    console.error('Error merging document:', error);
    return NextResponse.json(
      { error: 'Failed to merge document', details: String(error) },
      { status: 500 }
    );
  }
}
