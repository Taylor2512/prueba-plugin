/**
 * Hook for generated PDF artifacts in SISAD PDFME runtime screens.
 *
 * Responsibility:
 * - Generate a PDF from template + inputs + plugins.
 * - Run converter helpers: pdf2size, pdf2img and img2pdf.
 * - Manage object URL lifecycle to avoid memory leaks.
 * - Report status events to the host without rendering UI directly.
 *
 * Architectural rule:
 * Heavy dependencies are injected. This keeps the hook testable and prevents
 * the host/runtime adapter from importing generator/converter packages directly.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createObjectUrl as defaultCreateObjectUrl,
  revokeObjectUrls as defaultRevokeObjectUrls,
} from '../browser/objectUrls.js';

/**
 * State produced by the artifacts pipeline.
 *
 * generatedPdfUrl: object URL for preview/download of generated PDF.
 * generatedPdfBytes: raw PDF bytes used by converters.
 * pdfSizes: page sizes returned by pdf2size.
 * images: object URLs generated from pdf2img buffers.
 * roundtripPdfUrl: PDF rebuilt from image buffers through img2pdf.
 */
export type PdfmeArtifactsState = {
  generatedPdfUrl: string;
  generatedPdfBytes: Uint8Array | ArrayBuffer | null;
  pdfSizes: Array<unknown>;
  images: string[];
  roundtripPdfUrl: string;
};

/** Initial empty state. Kept immutable by convention through setState copies. */
const EMPTY_STATE: PdfmeArtifactsState = {
  generatedPdfUrl: '',
  generatedPdfBytes: null,
  pdfSizes: [],
  images: [],
  roundtripPdfUrl: '',
};

/**
 * Dependency-injected configuration for usePdfmeArtifacts.
 *
 * The hook does not import generator/converter packages directly. Instead,
 * the host passes generate/pdf2size/pdf2img/img2pdf functions. This makes the
 * hook reusable in lab, integration and tests.
 */
export type UsePdfmeArtifactsConfig = {
  template: Record<string, unknown> & { schemas?: unknown[] };
  inputs: unknown;
  plugins: Record<string, unknown>;
  /** Generator + converter functions (injected to avoid hard deps / ease testing). */
  generate: (args: {
    template: Record<string, unknown> & { schemas?: unknown[] };
    inputs: unknown;
    plugins: Record<string, unknown>;
  }) => Promise<Uint8Array | ArrayBuffer>;
  pdf2size: (bytes: Uint8Array | ArrayBuffer) => Promise<Array<unknown>>;
  pdf2img: (bytes: Uint8Array | ArrayBuffer, opts: Record<string, unknown>) => Promise<Array<Uint8Array | ArrayBuffer>>;
  img2pdf: (buffers: Array<Uint8Array | ArrayBuffer>, opts: Record<string, unknown>) => Promise<Uint8Array | ArrayBuffer>;
  /** Optional pre-generate validation. Return { valid, issues }. */
  validate?: (schemas: unknown[]) => { valid: boolean; issues: Array<{ schemaUid: string; reason: string }> };
  /** Status reporter. Receives a key and context; host renders text. */
  onStatus?: (event: { type: string; message?: string; context?: unknown }) => void;
  getErrorMessage?: (error: unknown) => string;
  createObjectUrl?: (bytes: BlobPart, mimeType: string) => string;
  revokeObjectUrls?: (urls: Array<string | null | undefined>) => void;
};

/** Fallback error formatter when the host does not provide one. */
const defaultGetErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected error';

/**
 * Manages generated PDF artifacts (generate → pdf2size/pdf2img/img2pdf) and the
 * object-URL lifecycle. All heavy deps are injected so the hook stays decoupled
 * from the generator/converter packages and is unit-testable with mocks.
 */
export function usePdfmeArtifacts(config: UsePdfmeArtifactsConfig) {
  /** Indicates that one artifact operation is currently running. */
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<PdfmeArtifactsState>(EMPTY_STATE);

  /**
   * Refs mirror URL values so cleanup callbacks can revoke the latest URLs
   * without depending on stale render closures.
   */
  const generatedPdfUrlRef = useRef('');
  const roundtripPdfUrlRef = useRef('');
  const imagesRef = useRef<string[]>([]);

  /**
   * Stores the latest config so stable callbacks can always call the newest
   * injected dependencies and status handlers.
   */
  const latest = useRef(config);
  // Excepción a react-hooks/refs: patrón "latest ref". `latest.current` solo se
  // lee desde callbacks estables, nunca durante el render.
  
  latest.current = config;

  useEffect(() => {
    generatedPdfUrlRef.current = state.generatedPdfUrl;
  }, [state.generatedPdfUrl]);
  useEffect(() => {
    roundtripPdfUrlRef.current = state.roundtripPdfUrl;
  }, [state.roundtripPdfUrl]);
  useEffect(() => {
    imagesRef.current = state.images;
  }, [state.images]);

  /** Revokes object URLs using the host override or default browser helper. */
  const revoke = useCallback(
    (urls: Array<string | null | undefined>) => (latest.current.revokeObjectUrls ?? defaultRevokeObjectUrls)(urls),
    [],
  );
  /** Creates object URLs using the host override or default browser helper. */
  const makeUrl = useCallback(
    (bytes: BlobPart, mime: string) => (latest.current.createObjectUrl ?? defaultCreateObjectUrl)(bytes as BlobPart, mime),
    [],
  );
  /** Emits semantic status events; UI rendering stays in the host. */
  const status = useCallback((event: { type: string; message?: string; context?: unknown }) => {
    latest.current.onStatus?.(event);
  }, []);
  /** Converts unknown errors into messages for status events. */
  const errMsg = useCallback(
    (error: unknown) => (latest.current.getErrorMessage ?? defaultGetErrorMessage)(error),
    [],
  );

  /**
   * Clears converter-derived artifacts and revokes their object URLs.
   *
   * clearGeneratedPdf = false keeps the generated PDF, but removes sizes,
   * images and roundtrip output. This is useful before re-running converters.
   */
  const clearDerivedResults = useCallback(
    ({ clearGeneratedPdf = false }: { clearGeneratedPdf?: boolean } = {}) => {
      setState((prev) => {
        const next = { ...prev };
        if (clearGeneratedPdf) {
          next.generatedPdfBytes = null;
          if (generatedPdfUrlRef.current) {
            revoke([generatedPdfUrlRef.current]);
            generatedPdfUrlRef.current = '';
          }
          next.generatedPdfUrl = '';
        }
        next.pdfSizes = [];
        revoke(imagesRef.current);
        imagesRef.current = [];
        next.images = [];
        if (roundtripPdfUrlRef.current) {
          revoke([roundtripPdfUrlRef.current]);
          roundtripPdfUrlRef.current = '';
        }
        next.roundtripPdfUrl = '';
        return next;
      });
    },
    [revoke],
  );

  /**
   * Runs the PDF generator.
   *
   * Flow:
   * 1. Optional validation.
   * 2. Clear derived converter results.
   * 3. Generate PDF bytes.
   * 4. Create preview/download object URL.
   * 5. Report status to the host.
   */
  const generatePdf = useCallback(async () => {
    const cfg = latest.current;
    if (cfg.validate) {
      const validation = cfg.validate(cfg.template?.schemas || []);
      if (!validation.valid) {
        status({ type: 'validation-error', context: validation.issues });
        return;
      }
    }
    setBusy(true);
    status({ type: 'generate-start' });
    clearDerivedResults();
    try {
      const pdfBytes = await cfg.generate({ template: cfg.template, inputs: cfg.inputs, plugins: cfg.plugins });
      if (generatedPdfUrlRef.current) {
        revoke([generatedPdfUrlRef.current]);
        generatedPdfUrlRef.current = '';
      }
      const nextUrl = makeUrl(pdfBytes as unknown as BlobPart, 'application/pdf');
      setState((prev) => ({ ...prev, generatedPdfBytes: pdfBytes, generatedPdfUrl: nextUrl }));
      status({ type: 'generate-success' });
    } catch (error) {
      setState((prev) => ({ ...prev, generatedPdfBytes: null }));
      status({ type: 'generate-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [clearDerivedResults, errMsg, makeUrl, revoke, status]);

  /** Reads page sizes from the latest generated PDF bytes. */
  const runPdf2Size = useCallback(async () => {
    const cfg = latest.current;
    if (!state.generatedPdfBytes) return;
    setBusy(true);
    status({ type: 'pdf2size-start' });
    try {
      const sizes = await cfg.pdf2size(state.generatedPdfBytes);
      setState((prev) => ({ ...prev, pdfSizes: sizes }));
      status({ type: 'pdf2size-success' });
    } catch (error) {
      status({ type: 'pdf2size-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [errMsg, state.generatedPdfBytes, status]);

  /** Converts the latest generated PDF into page image object URLs. */
  const runPdf2Img = useCallback(async () => {
    const cfg = latest.current;
    if (!state.generatedPdfBytes) return;
    setBusy(true);
    status({ type: 'pdf2img-start' });
    try {
      const imageBuffers = await cfg.pdf2img(state.generatedPdfBytes, { scale: 1, imageType: 'png' });
      revoke(imagesRef.current);
      const imageUrls = imageBuffers.map((buffer) => makeUrl(buffer as unknown as BlobPart, 'image/png'));
      if (roundtripPdfUrlRef.current) {
        revoke([roundtripPdfUrlRef.current]);
        roundtripPdfUrlRef.current = '';
      }
      setState((prev) => ({ ...prev, images: imageUrls, roundtripPdfUrl: '' }));
      status({ type: 'pdf2img-success', context: { count: imageUrls.length } });
    } catch (error) {
      status({ type: 'pdf2img-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [errMsg, makeUrl, revoke, state.generatedPdfBytes, status]);

  /**
   * Rebuilds a PDF from the current generated image URLs.
   *
   * Note: this fetches object URLs created by runPdf2Img, converts them back
   * to ArrayBuffer and passes them to img2pdf.
   */
  const runImg2Pdf = useCallback(async () => {
    const cfg = latest.current;
    if (state.images.length === 0) return;
    setBusy(true);
    status({ type: 'img2pdf-start' });
    try {
      const buffers = await Promise.all(state.images.map((url) => fetch(url).then((r) => r.arrayBuffer())));
      const pdfBuffer = await cfg.img2pdf(buffers, { margin: [10, 10, 10, 10], size: { width: 210, height: 297 } });
      if (roundtripPdfUrlRef.current) revoke([roundtripPdfUrlRef.current]);
      const nextRoundtripUrl = makeUrl(pdfBuffer as unknown as BlobPart, 'application/pdf');
      setState((prev) => ({ ...prev, roundtripPdfUrl: nextRoundtripUrl }));
      status({ type: 'img2pdf-success' });
    } catch (error) {
      status({ type: 'img2pdf-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [errMsg, makeUrl, revoke, state.images, status]);

  /** Revoke all object URLs on unmount to prevent memory leaks. */
  useEffect(() => {
    return () => {
      if (generatedPdfUrlRef.current) (latest.current.revokeObjectUrls ?? defaultRevokeObjectUrls)([generatedPdfUrlRef.current]);
      if (roundtripPdfUrlRef.current) (latest.current.revokeObjectUrls ?? defaultRevokeObjectUrls)([roundtripPdfUrlRef.current]);
      (latest.current.revokeObjectUrls ?? defaultRevokeObjectUrls)(imagesRef.current);
    };
  }, []);

  return {
    busy,
    state,
    actions: { generatePdf, runPdf2Size, runPdf2Img, runImg2Pdf, clearDerivedResults },
  };
}
