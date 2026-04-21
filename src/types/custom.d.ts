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
