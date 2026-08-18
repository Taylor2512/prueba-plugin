/**
 * Nombre determinista del artefacto descargado (QH-011).
 *
 * El defecto observado era `[object Object].pdf`: las rutas de descarga hacían
 * `String(template.basePdf)` y `basePdf` puede ser un objeto de PDF. Estos
 * tests fijan que ninguna entrada —incluido el literal ya materializado— pueda
 * volver a producir ese nombre.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DOCUMENT_FILE_STEM,
  DEFAULT_TEMPLATE_FILE_STEM,
  resolveDocumentFileStem,
  resolveDocumentPdfFileName,
  resolveTemplateJsonFileName,
  withExtension,
} from '../../../../src/sisad-pdfme/common/documentFileName';

describe('resolveDocumentFileStem', () => {
  it('toma el último segmento de una URL', () => {
    expect(resolveDocumentFileStem('https://cdn.example.com/docs/contrato.pdf')).toBe('contrato');
  });

  it('descarta query y hash', () => {
    expect(resolveDocumentFileStem('/files/informe.pdf?version=2&token=abc#page=3')).toBe('informe');
  });

  it('decodifica una URL codificada', () => {
    expect(resolveDocumentFileStem('/docs/acuerdo%20final.pdf')).toBe('acuerdo final');
  });

  it('no duplica la extensión cuando ya viene en el origen', () => {
    expect(resolveDocumentPdfFileName('contrato.pdf')).toBe('contrato.pdf');
    expect(resolveDocumentPdfFileName('contrato')).toBe('contrato.pdf');
  });

  it('conserva puntos internos y sólo retira la extensión final', () => {
    expect(resolveDocumentFileStem('informe.2024.pdf')).toBe('informe.2024');
  });

  it('usa el campo name de un objeto', () => {
    expect(resolveDocumentFileStem({ name: 'anexo.pdf' })).toBe('anexo');
  });

  it('respeta la precedencia entre campos de nombre', () => {
    expect(
      resolveDocumentFileStem({ title: 'titulo', fileName: 'porFileName', name: 'porName' }),
    ).toBe('porName');
    expect(resolveDocumentFileStem({ title: 'titulo', fileName: 'porFileName' })).toBe('porFileName');
    expect(resolveDocumentFileStem({ title: 'titulo' })).toBe('titulo');
  });

  it('un objeto SIN metadatos de nombre cae al fallback y nunca se serializa', () => {
    const stem = resolveDocumentFileStem({ data: 'JVBERi0xLjcK', pages: 3 });
    expect(stem).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(stem).not.toContain('object');
    expect(stem).not.toContain('{');
    expect(stem).not.toContain('JVBERi');
  });

  it('nunca acepta el literal [object Object] aunque llegue ya materializado', () => {
    expect(resolveDocumentFileStem('[object Object]')).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentPdfFileName('[object Object]')).toBe(`${DEFAULT_DOCUMENT_FILE_STEM}.pdf`);
  });

  it('trata null, undefined y valores no textuales como ausencia de nombre', () => {
    expect(resolveDocumentFileStem(null)).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem(undefined)).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem(42)).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem([])).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem('')).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem('   ')).toBe(DEFAULT_DOCUMENT_FILE_STEM);
  });

  it('sustituye caracteres prohibidos por el sistema de archivos', () => {
    expect(resolveDocumentFileStem({ name: 'a:b*c?d"e<f>g|h' })).not.toMatch(/[\\/:*?"<>|]/);
  });

  it('no deja puntos ni espacios finales', () => {
    expect(resolveDocumentFileStem({ name: 'documento...' })).toBe('documento');
    expect(resolveDocumentFileStem({ name: '  documento  ' })).toBe('documento');
  });

  it('el fallback del template es distinto del fallback del documento', () => {
    expect(resolveTemplateJsonFileName(null)).toBe(`${DEFAULT_TEMPLATE_FILE_STEM}.json`);
    expect(resolveDocumentPdfFileName(null)).toBe(`${DEFAULT_DOCUMENT_FILE_STEM}.pdf`);
    expect(DEFAULT_TEMPLATE_FILE_STEM).not.toBe(DEFAULT_DOCUMENT_FILE_STEM);
  });

  it('un fallback inservible cae al fallback canónico', () => {
    expect(resolveDocumentFileStem(null, '   ')).toBe(DEFAULT_DOCUMENT_FILE_STEM);
    expect(resolveDocumentFileStem(null, '[object Object]')).toBe(DEFAULT_DOCUMENT_FILE_STEM);
  });

  it('es determinista: la misma entrada produce siempre el mismo nombre', () => {
    const entrada = { name: 'contrato final.pdf' };
    const primero = resolveDocumentPdfFileName(entrada);
    for (let i = 0; i < 5; i += 1) {
      expect(resolveDocumentPdfFileName(entrada)).toBe(primero);
    }
  });
});

describe('withExtension', () => {
  it('añade la extensión exactamente una vez', () => {
    expect(withExtension('doc', 'pdf')).toBe('doc.pdf');
    expect(withExtension('doc.pdf', 'pdf')).toBe('doc.pdf');
    expect(withExtension('doc.PDF', 'pdf')).toBe('doc.PDF');
    expect(withExtension('doc', 'json')).toBe('doc.json');
  });
});
