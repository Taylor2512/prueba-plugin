// @generated — source-contract test for src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx
import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import { absoluteSource, readSource, syntaxDiagnostics, unresolvedRelativeImports } from "../../../../../../helpers/sourceContract";
const SOURCE="src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx";
describe("src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx",()=>{it('exists and is non-empty',()=>{expect(statSync(absoluteSource(SOURCE)).isFile()).toBe(true);expect(readSource(SOURCE).trim().length).toBeGreaterThan(0)});it('contains no unresolved merge-conflict markers',()=>expect(readSource(SOURCE)).not.toMatch(/^(?:<<<<<<<|=======|>>>>>>>)/m));it('parses without syntax diagnostics',()=>expect(syntaxDiagnostics(SOURCE)).toEqual([]));it('resolves every relative import/export target',()=>expect(unresolvedRelativeImports(SOURCE)).toEqual([]));});
