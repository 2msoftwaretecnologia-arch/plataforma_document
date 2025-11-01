import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string; chunkIndex: string }> }
) {
  try {
    const { documentId, chunkIndex } = await params;
    const chunkPath = path.join(
      process.cwd(),
      'public',
      'documents_chunks',
      documentId,
      `chunk_${chunkIndex}.docx`
    );

    if (!existsSync(chunkPath)) {
      return NextResponse.json(
        { error: 'Chunk not found' },
        { status: 404 }
      );
    }

    const chunkBuffer = await readFile(chunkPath);

    return new NextResponse(chunkBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `inline; filename="chunk_${chunkIndex}.docx"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving chunk:', error);
    return NextResponse.json(
      { error: 'Failed to serve chunk', details: String(error) },
      { status: 500 }
    );
  }
}
