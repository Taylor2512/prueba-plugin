import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createObjectUrl as defaultCreateObjectUrl,
  revokeObjectUrls as defaultRevokeObjectUrls,
} from '../browser/objectUrls.js';

export type PdfmeArtifactsState = {
  generatedPdfUrl: string;
  generatedPdfBytes: Uint8Array | ArrayBuffer | null;
  pdfSizes: any[];
  images: string[];
  roundtripPdfUrl: string;
};

const EMPTY_STATE: PdfmeArtifactsState = {
  generatedPdfUrl: '',
  generatedPdfBytes: null,
  pdfSizes: [],
  images: [],
  roundtripPdfUrl: '',
};

export type UsePdfmeArtifactsConfig = {
  template: any;
  inputs: any;
  plugins: Record<string, any>;
  /** Generator + converter functions (injected to avoid hard deps / ease testing). */
  generate: (args: { template: any; inputs: any; plugins: Record<string, any> }) => Promise<any>;
  pdf2size: (bytes: any) => Promise<any[]>;
  pdf2img: (bytes: any, opts: any) => Promise<any[]>;
  img2pdf: (buffers: any[], opts: any) => Promise<any>;
  /** Optional pre-generate validation. Return { valid, issues }. */
  validate?: (schemas: any[]) => { valid: boolean; issues: Array<{ schemaUid: string; reason: string }> };
  /** Status reporter. Receives a key and context; host renders text. */
  onStatus?: (event: { type: string; message?: string; context?: any }) => void;
  getErrorMessage?: (error: unknown) => string;
  createObjectUrl?: (bytes: any, mimeType: string) => string;
  revokeObjectUrls?: (urls: Array<string | null | undefined>) => void;
};

const defaultGetErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected error';

/**
 * Manages generated PDF artifacts (generate → pdf2size/pdf2img/img2pdf) and the
 * object-URL lifecycle. All heavy deps are injected so the hook stays decoupled
 * from the generator/converter packages and is unit-testable with mocks.
 */
export function usePdfmeArtifacts(config: UsePdfmeArtifactsConfig) {
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<PdfmeArtifactsState>(EMPTY_STATE);

  const generatedPdfUrlRef = useRef('');
  const roundtripPdfUrlRef = useRef('');
  const imagesRef = useRef<string[]>([]);

  const latest = useRef(config);
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

  const revoke = useCallback(
    (urls: Array<string | null | undefined>) => (latest.current.revokeObjectUrls ?? defaultRevokeObjectUrls)(urls),
    [],
  );
  const makeUrl = useCallback(
    (bytes: any, mime: string) => (latest.current.createObjectUrl ?? defaultCreateObjectUrl)(bytes, mime),
    [],
  );
  const status = useCallback((event: { type: string; message?: string; context?: any }) => {
    latest.current.onStatus?.(event);
  }, []);
  const errMsg = useCallback(
    (error: unknown) => (latest.current.getErrorMessage ?? defaultGetErrorMessage)(error),
    [],
  );

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
      const nextUrl = makeUrl(pdfBytes, 'application/pdf');
      setState((prev) => ({ ...prev, generatedPdfBytes: pdfBytes, generatedPdfUrl: nextUrl }));
      status({ type: 'generate-success' });
    } catch (error) {
      setState((prev) => ({ ...prev, generatedPdfBytes: null }));
      status({ type: 'generate-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [clearDerivedResults, errMsg, makeUrl, revoke, status]);

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

  const runPdf2Img = useCallback(async () => {
    const cfg = latest.current;
    if (!state.generatedPdfBytes) return;
    setBusy(true);
    status({ type: 'pdf2img-start' });
    try {
      const imageBuffers = await cfg.pdf2img(state.generatedPdfBytes, { scale: 1, imageType: 'png' });
      revoke(imagesRef.current);
      const imageUrls = imageBuffers.map((buffer) => makeUrl(buffer, 'image/png'));
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

  const runImg2Pdf = useCallback(async () => {
    const cfg = latest.current;
    if (state.images.length === 0) return;
    setBusy(true);
    status({ type: 'img2pdf-start' });
    try {
      const buffers = await Promise.all(state.images.map((url) => fetch(url).then((r) => r.arrayBuffer())));
      const pdfBuffer = await cfg.img2pdf(buffers, { margin: [10, 10, 10, 10], size: { width: 210, height: 297 } });
      if (roundtripPdfUrlRef.current) revoke([roundtripPdfUrlRef.current]);
      const nextRoundtripUrl = makeUrl(pdfBuffer, 'application/pdf');
      setState((prev) => ({ ...prev, roundtripPdfUrl: nextRoundtripUrl }));
      status({ type: 'img2pdf-success' });
    } catch (error) {
      status({ type: 'img2pdf-error', message: errMsg(error) });
    } finally {
      setBusy(false);
    }
  }, [errMsg, makeUrl, revoke, state.images, status]);

  // Revoke all object URLs on unmount.
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
