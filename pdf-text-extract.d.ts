declare module 'pdf-parse' {
  interface PDFParseOptions {
    max?: number;
  }

  interface PDFParseData {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: any;
    text: string;
    version: string;
  }

  function pdfParse(
    buffer: Buffer,
    options?: PDFParseOptions
  ): Promise<PDFParseData>;

  export default pdfParse;
}
