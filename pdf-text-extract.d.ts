declare module 'pdf-text-extract' {
  function extract(
    file: Buffer | string,
    options?: any,
    callback?: (err: Error | null, pages: string[]) => void
  ): void;
  export = extract;
} 