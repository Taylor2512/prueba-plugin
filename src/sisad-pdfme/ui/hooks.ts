import { RefObject, useRef, useState, useCallback, useEffect } from 'react';
import {
  ZOOM,
  Template,
  Size,
  getB64BasePdf,
  b64toUint8Array,
  SchemaForUI,
  ChangeSchemas,
  isBlankPdf,
} from '@sisad-pdfme/common';
import { pdf2img, pdf2size } from '@sisad-pdfme/converter';

import {
  arrayBufferToBase64,
  round,
} from './helper.js';
import type { SelectionCommandSet } from './components/Designer/shared/selectionCommands.js';
import type { CommandBus } from './commands/commandBus.js';
import { RULER_HEIGHT } from './constants.js';
import {
  type SchemaClipboardPayload,
  copySchemasToClipboard,
  cutSchemasToClipboard,
  pasteSchemasFromClipboard,
} from './components/Designer/shared/schemaClipboard.js';
import {
  useDesignerKeyboardShortcuts,
} from './components/Designer/shared/useDesignerKeyboardShortcuts.js';
import type { SchemaCreationContext } from './designerEngine.js';

export function usePrevious<T>(value: T) {
  const [previous, setPrevious] = useState<T | null>(null);
  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
}

const getScale = (n: number, paper: number) =>
  Math.floor((n / paper > 1 ? 1 : n / paper) * 100) / 100;

type UIPreProcessorProps = { template: Template; size: Size; zoomLevel: number; maxZoom: number };

type PreprocessedPdfCache = {
  key: unknown;
  maxZoom: number;
  backgrounds: string[];
  pageSizes: { width: number; height: number }[];
  paperWidth: number;
  paperHeight: number;
};

const MAX_PREPROCESSED_PDF_CACHE_ENTRIES = 8;

const getBasePdfCacheKey = (basePdf: Template['basePdf']) => {
  if (typeof basePdf === 'string') return basePdf;
  try {
    return JSON.stringify(basePdf);
  } catch {
    return String(basePdf || '');
  }
};

export const useUIPreProcessor = ({ template, size, zoomLevel, maxZoom }: UIPreProcessorProps) => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [pageSizes, setPageSizes] = useState<Size[]>([]);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<Error | null>(null);
  const [paperMetrics, setPaperMetrics] = useState<{ paperWidth: number; paperHeight: number } | null>(null);
  const requestIdRef = useRef(0);
  const preprocessedCacheRef = useRef<Map<string, PreprocessedPdfCache>>(new Map());

  const init = useCallback(async (nextTemplate: Template) => {
    const {
      basePdf,
      schemas,
    } = nextTemplate;

    let paperWidth: number;
    let paperHeight: number;
    let _backgrounds: string[];
    let _pageSizes: { width: number; height: number }[];

    if (isBlankPdf(basePdf)) {
      const { width, height } = basePdf;
      paperWidth = width * ZOOM;
      paperHeight = height * ZOOM;
      _backgrounds = schemas.map(
        () =>
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=',
      );
      _pageSizes = schemas.map(() => ({ width, height }));
      preprocessedCacheRef.current.clear();
    } else {
      const cacheKey = getBasePdfCacheKey(basePdf);
      const cached = preprocessedCacheRef.current.get(cacheKey);
      if (cached && cached.maxZoom === maxZoom) {
        _pageSizes = cached.pageSizes;
        paperWidth = cached.paperWidth;
        paperHeight = cached.paperHeight;
        _backgrounds = cached.backgrounds;
      } else {
        const _basePdf = await getB64BasePdf(basePdf);

        const uint8Array = b64toUint8Array(_basePdf);
        // Create a new ArrayBuffer copy to avoid detachment issues
        const pdfArrayBuffer = new ArrayBuffer(uint8Array.byteLength);
        new Uint8Array(pdfArrayBuffer).set(uint8Array);

        const [_pages, imgBuffers] = await Promise.all([
          pdf2size(pdfArrayBuffer),
          pdf2img(pdfArrayBuffer.slice(), { scale: maxZoom }),
        ]);
        _pageSizes = _pages;
        paperWidth = _pageSizes[0].width * ZOOM;
        paperHeight = _pageSizes[0].height * ZOOM;
        _backgrounds = imgBuffers.map(arrayBufferToBase64);
        preprocessedCacheRef.current.set(cacheKey, {
          key: basePdf,
          maxZoom,
          backgrounds: _backgrounds,
          pageSizes: _pageSizes,
          paperWidth,
          paperHeight,
        });
        if (preprocessedCacheRef.current.size > MAX_PREPROCESSED_PDF_CACHE_ENTRIES) {
          const oldestKey = preprocessedCacheRef.current.keys().next().value;
          if (oldestKey) preprocessedCacheRef.current.delete(oldestKey);
        }
      }
    }

    return {
      backgrounds: _backgrounds,
      pageSizes: _pageSizes,
      paperWidth,
      paperHeight,
    };
  }, [maxZoom]);

  const isBlankBasePdf = isBlankPdf(template.basePdf);
  const blankSchemaPages = isBlankBasePdf ? template.schemas.length : 0;

  useEffect(() => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    init(template)
      .then(({ pageSizes, paperWidth, paperHeight, backgrounds }) => {
        if (requestId !== requestIdRef.current) return;
        setPageSizes(pageSizes);
        setBackgrounds(backgrounds);
        setPaperMetrics({ paperWidth, paperHeight });
        setError(null);
      })
      .catch((err: Error) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
        console.error('[@sisad-pdfme/ui]', err);
      });

    return () => {
      if (requestId === requestIdRef.current) {
        requestIdRef.current += 1;
      }
    };
  }, [blankSchemaPages, init, isBlankBasePdf, template]);

  useEffect(() => {
    if (!paperMetrics) return;

    const nextScale = Math.min(
      getScale(size.width, paperMetrics.paperWidth),
      getScale(size.height - RULER_HEIGHT, paperMetrics.paperHeight),
    );

    setScale((current) => (Math.abs(current - nextScale) < 0.001 ? current : nextScale));
  }, [paperMetrics, size.height, size.width]);

  return {
    backgrounds,
    pageSizes,
    scale: scale * zoomLevel,
    error,
    refresh: (template: Template) =>
      init(template).then(({ pageSizes, paperWidth, paperHeight, backgrounds }) => {
        setPageSizes(pageSizes);
        setBackgrounds(backgrounds);
        setPaperMetrics({ paperWidth, paperHeight });
      }),
  };
};

type ScrollPageCursorProps = {
  ref: RefObject<HTMLDivElement>;
  paperRefs?: RefObject<HTMLDivElement[]>;
  pageSizes: Size[];
  scale: number;
  pageCursor: number;
  onChangePageCursor: (page: number) => void;
};

export const useScrollPageCursor = ({
  ref,
  paperRefs,
  pageSizes,
  scale,
  pageCursor,
  onChangePageCursor,
}: ScrollPageCursorProps) => {
  const onScroll = useCallback(() => {
    const scrollContainer = ref.current;
    if (!pageSizes[0] || !scrollContainer) {
      return;
    }

    const paperElements = paperRefs?.current?.filter((paper): paper is HTMLDivElement => Boolean(paper)) || [];
    if (paperElements.length === 0) {
      const scrollTop = scrollContainer.scrollTop;
      const viewportHeight = Math.max(1, scrollContainer.clientHeight || 0);
      const viewportMidpoint = scrollTop + viewportHeight / 2;

      const pageGap = 12 * Math.max(0.25, scale);
      let accumulatedTop = 0;
      let nextPageCursor = 0;

      for (let i = 0; i < pageSizes.length; i += 1) {
        const page = pageSizes[i];
        const pageHeight = Math.max(1, (page.height * ZOOM + RULER_HEIGHT) * scale);
        const pageBottom = accumulatedTop + pageHeight;

        if (viewportMidpoint <= pageBottom || i === pageSizes.length - 1) {
          nextPageCursor = i;
          break;
        }

        accumulatedTop = pageBottom + pageGap;
      }

      if (nextPageCursor !== pageCursor) {
        onChangePageCursor(nextPageCursor);
      }
      return;
    }

    const activationLine = scrollContainer.scrollTop + RULER_HEIGHT;
    let nextPageCursor = 0;

    for (let i = 0; i < Math.min(pageSizes.length, paperElements.length); i += 1) {
      const page = paperElements[i];
      const pageTop = page.offsetTop;

      if (pageTop > activationLine || i === Math.min(pageSizes.length, paperElements.length) - 1) {
        nextPageCursor = Math.max(0, pageTop > activationLine ? i - 1 : i);
        break;
      }
      nextPageCursor = i;
    }

    if (nextPageCursor !== pageCursor) {
      onChangePageCursor(nextPageCursor);
    }
  }, [onChangePageCursor, pageCursor, pageSizes, paperRefs, ref, scale]);

  useEffect(() => {
    const scrollContainer = ref.current;
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollContainer?.removeEventListener('scroll', onScroll);
    };
  }, [ref, onScroll]);
};

export const useMountStatus = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
};

interface UseInitEventsParams {
  pageCursor: number;
  pageSizes: Size[];
  activeElements: HTMLElement[];
  template: Template;
  schemasList: SchemaForUI[][];
  visibleSchemasList?: SchemaForUI[][];
  changeSchemas: ChangeSchemas;
  commitSchemas: (newSchemas: SchemaForUI[]) => void;
  removeSchemas: (ids: string[]) => void;
  commandBus?: CommandBus;
  onEdit: (targets: HTMLElement[]) => void;
  onEditEnd: () => void;
  selectionCommands?: SelectionCommandSet;
  collaborationContext?: Pick<
    SchemaCreationContext,
    'fileId' | 'actorId' | 'ownerRecipientId' | 'ownerRecipientIds' | 'ownerRecipientName' | 'ownerColor' | 'userColor'
  >;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitPage?: () => void;
  onFitWidth?: () => void;
  onZoom100?: () => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

export const useInitEvents = ({
  pageCursor,
  pageSizes,
  activeElements,
  template,
  schemasList,
  visibleSchemasList,
  changeSchemas,
  commitSchemas,
  removeSchemas,
  commandBus,
  onEdit,
  onEditEnd,
  selectionCommands,
  collaborationContext,
  onZoomIn,
  onZoomOut,
  onFitPage,
  onFitWidth,
  onZoom100,
  onNextPage,
  onPreviousPage,
}: UseInitEventsParams & { selectionCommands?: SelectionCommandSet }) => {
  const copiedSchemas = useRef<SchemaClipboardPayload | null>(null);
  const canEditStructure = selectionCommands?.canEditStructure !== false;
  const getActiveSchemas = () => {
    const ids = activeElements.filter(Boolean).map((ae) => ae.id);
    return (schemasList[pageCursor] || []).filter((s) => ids.includes(s.id));
  };

  const copySelection = () => {
    const activeSchemas = getActiveSchemas();
    if (activeSchemas.length === 0) return;
    copiedSchemas.current = copySchemasToClipboard(activeSchemas);
  };

  const pasteSelection = () => {
    if (!canEditStructure) return;
    if (!copiedSchemas.current || copiedSchemas.current.items.length === 0) return;
    const pasteSchemas = pasteSchemasFromClipboard(copiedSchemas.current, {
      pageIndex: pageCursor,
      pageSize: pageSizes[pageCursor],
      pageCount: schemasList.length,
      fileId: collaborationContext?.fileId || null,
      collaborationContext: collaborationContext,
      existingSchemas: schemasList[pageCursor],
    });
    commitSchemas((schemasList[pageCursor] || []).concat(pasteSchemas));
    window.requestAnimationFrame(() => {
      const nextElements = pasteSchemas
        .map((schema) => document.getElementById(schema.id))
        .filter((element): element is HTMLElement => Boolean(element));
      if (nextElements.length > 0) {
        onEdit(nextElements);
      }
    });
    copiedSchemas.current = copySchemasToClipboard(pasteSchemas);
  };

  const cutSelection = () => {
    if (!canEditStructure) return;
    const activeSchemas = getActiveSchemas();
    if (activeSchemas.length === 0) return;
    copiedSchemas.current = cutSchemasToClipboard(activeSchemas);
    if (selectionCommands?.deleteSelection) {
      selectionCommands.deleteSelection();
      return;
    }
    removeSchemas(activeSchemas.map((s) => s.id));
  };

  const selectAllVisible = () => {
    onEdit(
      (visibleSchemasList?.[pageCursor] || schemasList[pageCursor] || [])
        .map((schema) => document.getElementById(schema.id))
        .filter((element): element is HTMLElement => Boolean(element)),
    );
  };

  const addCommentShortcut = () => {
    const activeSchema = getActiveSchemas()[0];
    const x = activeSchema ? activeSchema.position.x + activeSchema.width / 2 : pageSizes[pageCursor]?.width / 2 || 0;
    const y = activeSchema ? activeSchema.position.y + activeSchema.height / 2 : pageSizes[pageCursor]?.height / 2 || 0;
    window.dispatchEvent(
      new CustomEvent('sisad-pdfme:create-comment-request', {
        detail: {
          x,
          y,
          page: pageCursor,
          pageNumber: pageCursor + 1,
          fileId: collaborationContext?.fileId || null,
          schemaUid: activeSchema?.schemaUid || activeSchema?.id || undefined,
          targetIds: activeSchema ? [activeSchema.id] : [],
        },
      }),
    );
  };

  useDesignerKeyboardShortcuts({
    enabled: true,
    activeSchemas: getActiveSchemas(),
    pageCursor,
    schemasList,
    visibleSchemasList,
    commandBus: commandBus ?? null,
    selectionCommands,
    canEditStructure,
    activeDocumentId: collaborationContext?.fileId || undefined,
    activeUserId: collaborationContext?.actorId || undefined,
    isModalOpen: false,
    isInlineEditing: false,
    onOpenDetail: () => selectionCommands?.openProperties?.(),
    onAddComment: addCommentShortcut,
    onSelectAllVisible: selectAllVisible,
    onClearSelection: onEditEnd,
    onZoomIn,
    onZoomOut,
    onFitPage,
    onFitWidth,
    onZoom100,
    onNextPage,
    onPreviousPage,
    onMove: (direction, step) => {
      if (!canEditStructure) return;
      const pageSize = pageSizes[pageCursor];
      const activeSchemas = getActiveSchemas();
      const deltaMultiplier = step === 'fast' ? 10 : step === 'fine' ? 0.5 : 1;
      const delta = direction === 'up' || direction === 'left' ? -deltaMultiplier : deltaMultiplier;
      const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
      const ops = activeSchemas.map((schema) => {
        const currentPosition = Number(schema.position?.[axis] ?? 0);
        const size = axis === 'x' ? Number(schema.width || 0) : Number(schema.height || 0);
        const max = Math.max(0, (axis === 'x' ? pageSize.width : pageSize.height) - size);
        const nextValue = Math.min(Math.max(0, round(currentPosition + delta, 2)), max);
        return { key: `position.${axis}`, value: nextValue, schemaId: schema.id };
      });
      changeSchemas(ops);
    },
    onInsertSchemaByType: (type) => {
      if (!type) return;
      window.dispatchEvent(new CustomEvent('sisad-pdfme:shortcut-insert-schema', { detail: { type, pageCursor } }));
    },
  });
};
