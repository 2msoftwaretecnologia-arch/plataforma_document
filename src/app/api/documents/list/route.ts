import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { DocumentMetadata } from '@/lib/docxUtils';

export async function GET() {
  try {
    const chunksBaseDir = path.join(process.cwd(), 'public', 'documents_chunks');

    if (!existsSync(chunksBaseDir)) {
      return NextResponse.json({ documents: [] });
    }

    const documentDirs = await readdir(chunksBaseDir);
    const documents: DocumentMetadata[] = [];

    for (const docDir of documentDirs) {
      const metadataPath = path.join(chunksBaseDir, docDir, 'metadata.json');

      if (existsSync(metadataPath)) {
        const metadataContent = await readFile(metadataPath, 'utf-8');
        const metadata: DocumentMetadata = JSON.parse(metadataContent);
        documents.push(metadata);
      }
    }

    // Sort by upload date (newest first)
    documents.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error listing documents:', error);
    return NextResponse.json(
      { error: 'Failed to list documents', details: String(error) },
      { status: 500 }
    );
  }
}
