// @generated — source-contract de src/sisad-pdfme/browser/objectUrls.ts. Regenerar con `npm test -- source-tests --apply`.
import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import { absoluteSource, readSource, syntaxDiagnostics, unresolvedRelativeImports } from "../../../support/assertions/sourceContract";

const SOURCE = "src/sisad-pdfme/browser/objectUrls.ts";

describe("src/sisad-pdfme/browser/objectUrls.ts", () => {
  it('existe y no está vacío', () => {
    expect(statSync(absoluteSource(SOURCE)).isFile()).toBe(true);
    expect(readSource(SOURCE).trim().length).toBeGreaterThan(0);
  });

  it('no contiene marcadores de conflicto sin resolver', () => {
    expect(readSource(SOURCE)).not.toMatch(/^(?:<<<<<<<|=======|>>>>>>>)/m);
  });

  it('parsea sin diagnósticos de sintaxis', () => {
    expect(syntaxDiagnostics(SOURCE)).toEqual([]);
  });

  it('resuelve todos sus imports/exports relativos', () => {
    expect(unresolvedRelativeImports(SOURCE)).toEqual([]);
  });
});
