// Minimal stubs for tests — expand as needed
export type CustomGlobal = Record<string, unknown>;

declare global {
  interface Window {
    __SISAD_CUSTOM__?: CustomGlobal;
  }
}

export {};
// Ambient declarations for packages used in the repo that don't provide types

declare module 'canvas';

declare module 'pdfjs-dist/legacy/build/pdf.worker.min.js?url' {
    const value: string;
    export default value;
}

declare module '*.worker.js?url' {
    const value: string;
    export default value;
}
