import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { splitDocxIntoChunks } from '@/lib/docxUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only DOCX files are supported' },
        { status: 400 }
      );
    }

    // Generate document ID
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create directories if they don't exist
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    const chunksDir = path.join(process.cwd(), 'public', 'documents_chunks', documentId);

    if (!existsSync(documentsDir)) {
      await mkdir(documentsDir, { recursive: true });
    }

    if (!existsSync(chunksDir)) {
      await mkdir(chunksDir, { recursive: true });
    }

    // Save original file
    const originalPath = path.join(documentsDir, `${documentId}.docx`);
    await writeFile(originalPath, buffer);

    // Split into chunks
    const { metadata, chunks } = await splitDocxIntoChunks(
      buffer,
      documentId,
      file.name
    );

    // Save chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = path.join(chunksDir, `chunk_${i}.docx`);
      await writeFile(chunkPath, chunks[i]);
    }

    // Save metadata
    const metadataPath = path.join(chunksDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      documentId,
      metadata,
      message: `Document uploaded and split into ${chunks.length} chunks`,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: String(error) },
      { status: 500 }
    );
  }
}
