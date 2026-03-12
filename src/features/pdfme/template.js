export function createInitialPdfmeTemplate() {
  return {
    basePdf: {
      width: 210,
      height: 297,
      padding: [12, 12, 12, 12],
    },
    schemas: [[]],
  }
}
