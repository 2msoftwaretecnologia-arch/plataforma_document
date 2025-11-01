import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const mergedPath = path.join(
      process.cwd(),
      'public',
      'documents_ready',
      `${documentId}_merged.docx`
    );

    if (!existsSync(mergedPath)) {
      return NextResponse.json(
        { error: 'Merged document not found. Please merge the document first.' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(mergedPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${documentId}_final.docx"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document', details: String(error) },
      { status: 500 }
    );
  }
}
