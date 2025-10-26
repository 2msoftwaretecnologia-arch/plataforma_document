import { NextRequest, NextResponse } from 'next/server';
import DocumentEditor from 'docx_editor';

interface PageBreakInfo {
  paragraphIndex: number;
  type: 'explicit' | 'before';
}

interface SectionInfo {
  sectionNumber: number;
  paragraphCount: number;
}

interface DocumentStructure {
  paragraphs: number;
  tables: number;
  images: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
  };
  explicitPageBreaks: PageBreakInfo[];
}

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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize DocumentEditor and extract
    const editor = new DocumentEditor();
    await editor.extract(buffer);

    // Analyze document structure
    const structure: DocumentStructure = {
      paragraphs: 0,
      tables: 0,
      images: 0,
      headings: { h1: 0, h2: 0, h3: 0 },
      explicitPageBreaks: [],
    };

    editor.parse('word/document.xml', (doc: any) => {
      const body = doc['w:document']?.['w:body'];
      if (!body) return null;

      // Count paragraphs
      const paragraphs = body['w:p'];
      if (paragraphs) {
        const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
        structure.paragraphs = paraArray.length;

        paraArray.forEach((para: any, index: number) => {
          // Check for explicit page breaks
          const pPr = para['w:pPr'];
          if (pPr && pPr['w:pageBreakBefore']) {
            structure.explicitPageBreaks.push({
              paragraphIndex: index,
              type: 'before',
            });
          }

          // Check for page break in runs
          const runs = para['w:r'];
          if (runs) {
            const runArray = Array.isArray(runs) ? runs : [runs];
            runArray.forEach((run: any) => {
              if (run['w:br'] && run['w:br']['@_w:type'] === 'page') {
                structure.explicitPageBreaks.push({
                  paragraphIndex: index,
                  type: 'explicit',
                });
              }
            });
          }

          // Check for headings
          if (pPr && pPr['w:pStyle']) {
            const style = pPr['w:pStyle']['@_w:val'];
            if (style === 'Heading1' || style === 'Ttulo1') structure.headings.h1++;
            if (style === 'Heading2' || style === 'Ttulo2') structure.headings.h2++;
            if (style === 'Heading3' || style === 'Ttulo3') structure.headings.h3++;
          }
        });
      }

      // Count tables
      const tables = body['w:tbl'];
      if (tables) {
        structure.tables = Array.isArray(tables) ? tables.length : 1;
      }

      return null;
    });

    // Count images from relationships
    editor.parse('word/_rels/document.xml.rels', (rels: any) => {
      const relationships = rels?.['Relationships']?.['Relationship'];
      if (relationships) {
        const relArray = Array.isArray(relationships) ? relationships : [relationships];
        structure.images = relArray.filter((rel: any) =>
          rel['@_Type']?.includes('image')
        ).length;
      }
      return null;
    });

    return NextResponse.json({
      success: true,
      originalFile: file.name,
      structure: {
        paragraphs: structure.paragraphs,
        tables: structure.tables,
        images: structure.images,
        headings: structure.headings,
        totalHeadings: structure.headings.h1 + structure.headings.h2 + structure.headings.h3,
      },
      pageBreaks: {
        count: structure.explicitPageBreaks.length,
        locations: structure.explicitPageBreaks,
        note: 'Apenas quebras de página explícitas são detectadas. O número real de páginas depende da renderização.',
      },
      message: `Documento analisado: ${structure.paragraphs} parágrafos, ${structure.explicitPageBreaks.length} quebras de página explícitas`,
    });
  } catch (error) {
    console.error('Error analyzing DOCX:', error);
    return NextResponse.json(
      { error: 'Failed to process DOCX file', details: String(error) },
      { status: 500 }
    );
  }
}

// Alternative method: Analyze sections
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const editor = new DocumentEditor();
    await editor.extract(buffer);

    const sections: SectionInfo[] = [];
    let totalParagraphs = 0;

    editor.parse('word/document.xml', (doc: any) => {
      const body = doc['w:document']?.['w:body'];
      if (!body) return null;

      const paragraphs = body['w:p'];
      if (!paragraphs) return null;

      const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
      totalParagraphs = paraArray.length;

      let currentSection = 1;
      let sectionParagraphCount = 0;

      paraArray.forEach((para: any, index: number) => {
        sectionParagraphCount++;

        // Check for section break
        const pPr = para['w:pPr'];
        if (pPr && pPr['w:sectPr']) {
          sections.push({
            sectionNumber: currentSection,
            paragraphCount: sectionParagraphCount,
          });
          currentSection++;
          sectionParagraphCount = 0;
        }

        // Last paragraph - add final section
        if (index === paraArray.length - 1 && sectionParagraphCount > 0) {
          sections.push({
            sectionNumber: currentSection,
            paragraphCount: sectionParagraphCount,
          });
        }
      });

      // If no sections found, treat entire document as one section
      if (sections.length === 0) {
        sections.push({
          sectionNumber: 1,
          paragraphCount: totalParagraphs,
        });
      }

      return null;
    });

    return NextResponse.json({
      success: true,
      originalFile: file.name,
      totalSections: sections.length,
      totalParagraphs,
      sections: sections.map((section) => ({
        sectionNumber: section.sectionNumber,
        paragraphCount: section.paragraphCount,
      })),
      message: `Document analyzed: ${sections.length} section(s) found with ${totalParagraphs} total paragraphs`,
    });
  } catch (error) {
    console.error('Error analyzing DOCX by sections:', error);
    return NextResponse.json(
      { error: 'Failed to process DOCX file', details: String(error) },
      { status: 500 }
    );
  }
}
