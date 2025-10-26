declare module 'docx_editor' {
  class DocumentEditor {
    constructor(options?: {
      debug?: boolean;
      workDirectory?: string;
      documentName?: string;
    });

    readonly documentName: string;
    readonly showLogs: boolean;
    readonly workDirectory: string;

    extract(data: Buffer): Promise<DocumentEditor | null>;
    parse(
      target: string,
      onParsed: (doc: any) => DocumentEditor | null
    ): DocumentEditor | null;
    archive(): Promise<Buffer | null>;
    mkdir(relativePath: string): DocumentEditor | null;
    writeFile(relativePath: string, data: Buffer): DocumentEditor | null;
  }

  export default DocumentEditor;
}
