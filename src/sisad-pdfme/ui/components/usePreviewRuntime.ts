import { useCallback, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Template, SchemaForUI, Size, getDynamicTemplate } from '@sisad-pdfme/common';
import { getDynamicHeightsForTable } from '@sisad-pdfme/schemas';
import { useUIPreProcessor, useScrollPageCursor } from '../hooks.js';
import { FontContext, OptionsContext } from '../contexts.js';
import { template2SchemasList, getPagesScrollTopByIndex, useMaxZoom } from '../helper.js';
import {
  createSchemaDataRuntimeAdapter,
  getSchemaDesignerConfig,
  resolveDesignerEngine,
  type FormJsonEnvelope,
  type SchemaDataFieldSnapshot,
  type SchemaDataSnapshot,
} from '../designerEngine.js';

const _cache = new Map<string | number, unknown>();
const MAX_RUNTIME_TEMPLATE_CACHE_ENTRIES = 12;

const getTemplateDocumentIdentity = (template: Template) => {
  const scopedTemplate = template as Template & { fileId?: string; fileTemplateId?: string };
  return String(scopedTemplate?.fileId || scopedTemplate?.fileTemplateId || template?.basePdf || '');
};

const createPreviewRuntimeSignature = (template: Template, input: Record<string, string> = {}) => {
  const documentKey = getTemplateDocumentIdentity(template);
  const schemaSignature = (template?.schemas || [])
    .flat()
    .map((schema: SchemaForUI) =>
      [
        schema?.schemaUid || schema?.id || schema?.name || 'field',
        schema?.pageNumber || '',
        schema?.position?.x || 0,
        schema?.position?.y || 0,
        schema?.width || 0,
        schema?.height || 0,
      ].join(':'),
    )
    .join('|');

  return JSON.stringify({
    documentKey,
    pageCount: template?.schemas?.length || 0,
    schemaSignature,
    input,
  });
};

const resolveLocalStorage = () => {
  return globalThis.localStorage;
};

const applyPrefillResponse = (
  runtimeAdapter: ReturnType<typeof createSchemaDataRuntimeAdapter>,
  field: SchemaDataFieldSnapshot,
  request: NonNullable<ReturnType<ReturnType<typeof createSchemaDataRuntimeAdapter>['resolveRequest']>>,
  snapshot: SchemaDataSnapshot,
  currentInputRef: MutableRefObject<Record<string, string>>,
  commitInputPatch: (patch: Record<string, string>) => void,
) => {
  return runtimeAdapter.executeRequest(request).then((response) => {
    const values = runtimeAdapter.mapResponseToValues(response, field, request, snapshot);
    const filtered: Record<string, string> = {};

    for (const [name, value] of Object.entries(values)) {
      const currentValue = currentInputRef.current[name];
      const shouldFill = (currentValue === undefined || String(currentValue).trim().length === 0) && `${value}`.length > 0;
      if (shouldFill) {
        filtered[name] = value;
      }
    }

    if (Object.keys(filtered).length > 0) {
      commitInputPatch(filtered);
    }
  });
};

const runRuntimeRequest = (
  runtimeAdapter: ReturnType<typeof createSchemaDataRuntimeAdapter>,
  request: NonNullable<ReturnType<ReturnType<typeof createSchemaDataRuntimeAdapter>['resolveRequest']>>,
  logMessage: string,
) => {
  return runtimeAdapter.executeRequest(request).catch((error) => {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(logMessage, error);
    }
  });
};

type UsePreviewRuntimeArgs = {
  template: Template;
  inputs: Array<Record<string, string>>;
  size: Size;
  onChangeInput?: (_args: { index: number; value: string; name: string }) => void;
  onChangeInputs?: (_args: { index: number; values: Record<string, string> }) => void;
  onFormJsonChange?: (_json: FormJsonEnvelope | null) => void;
  onPageChange?: (_pageInfo: { currentPage: number; totalPages: number }) => void;
};

const usePreviewRuntime = ({
  template,
  inputs,
  size,
  onChangeInput,
  onChangeInputs,
  onFormJsonChange,
  onPageChange,
}: UsePreviewRuntimeArgs) => {
  const font = useContext(FontContext);
  const options = useContext(OptionsContext);
  const maxZoom = useMaxZoom();

  const containerRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);

  const [unitCursor, setUnitCursor] = useState(0);
  const [pageCursor, setPageCursor] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);

  const designerEngine = useMemo(() => resolveDesignerEngine(options as Record<string, unknown>), [options]);
  const runtimeAdapter = useMemo(
    () =>
      createSchemaDataRuntimeAdapter({
        engine: designerEngine,
        fetchImpl: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
        storage: resolveLocalStorage(),
      }),
    [designerEngine],
  );

  const { backgrounds, pageSizes, scale, error, refresh } = useUIPreProcessor({
    template,
    size,
    zoomLevel,
    maxZoom,
  });

  const isForm = Boolean(onChangeInput);
  const input = inputs[unitCursor];
  const currentInputRef = useRef<Record<string, string>>(input || {});
  const hydrationSignatureRef = useRef('');
  const syncSignatureRef = useRef('');
  const remotePrefillSignatureRef = useRef(new Set<string>());
  const runtimeTemplateCacheRef = useRef(
    new Map<string, { dynamicTemplate: Template; schemasList: SchemaForUI[][] }>(),
  );

  useEffect(() => {
    currentInputRef.current = input || {};
  }, [input]);

  const fieldSnapshots = useMemo<SchemaDataFieldSnapshot[]>(
    () =>
      schemasList.flat().map((schema) => ({
        schema,
        config: getSchemaDesignerConfig(schema, designerEngine) || null,
      })),
    [designerEngine, schemasList],
  );

  const snapshot = useMemo<SchemaDataSnapshot>(
    () => ({
      pageIndex: pageCursor,
      totalPages: schemasList.length,
      unitIndex: unitCursor,
      currentInput: input || {},
      fields: fieldSnapshots,
    }),
    [fieldSnapshots, input, pageCursor, schemasList.length, unitCursor],
  );

  const commitInputPatch = useCallback(
    (patch: Record<string, string>) => {
      const entries = Object.entries(patch).filter(([, value]) => value !== undefined);
      if (entries.length === 0) return;

      if (onChangeInputs) {
        onChangeInputs({ index: unitCursor, values: Object.fromEntries(entries) });
        return;
      }

      entries.forEach(([name, value]) => {
        onChangeInput?.({ index: unitCursor, name, value });
      });
    },
    [onChangeInput, onChangeInputs, unitCursor],
  );

  const formJsonEnvelope = useMemo(() => runtimeAdapter.buildFormJson(snapshot), [runtimeAdapter, snapshot]);

  const init = useCallback(
    (nextTemplate: Template, inputOverride?: Record<string, string>) => {
      const currentInput = inputOverride ?? input;
      const runtimeSignature = createPreviewRuntimeSignature(nextTemplate, currentInput);
      const cachedRuntime = runtimeTemplateCacheRef.current.get(runtimeSignature);
      if (cachedRuntime) {
        setSchemasList(cachedRuntime.schemasList);
        void refresh(cachedRuntime.dynamicTemplate).catch((err) => console.error('[@sisad-pdfme/ui] ', err));
        return;
      }

      getDynamicTemplate({
        template: nextTemplate,
        input: currentInput,
        options: { font },
        _cache,
        getDynamicHeights: (value, args) => {
          if (args.schema.type === 'table') {
            return getDynamicHeightsForTable(value, args);
          }
          return Promise.resolve([args.schema.height]);
        },
      })
        .then(async (dynamicTemplate) => {
          const nextSchemasList = await template2SchemasList(dynamicTemplate);
          runtimeTemplateCacheRef.current.set(runtimeSignature, {
            dynamicTemplate,
            schemasList: nextSchemasList,
          });
          if (runtimeTemplateCacheRef.current.size > MAX_RUNTIME_TEMPLATE_CACHE_ENTRIES) {
            const oldestKey = runtimeTemplateCacheRef.current.keys().next().value;
            if (oldestKey) runtimeTemplateCacheRef.current.delete(oldestKey);
          }
          setSchemasList(nextSchemasList);
          await refresh(dynamicTemplate);
        })
        .catch((err) => console.error('[@sisad-pdfme/ui] ', err));
    },
    [font, input, refresh],
  );

  useEffect(() => {
    if (onFormJsonChange) {
      onFormJsonChange(formJsonEnvelope);
    }
  }, [formJsonEnvelope, onFormJsonChange]);

  useEffect(() => {
    if (!isForm) return;

    const persistedTargets = fieldSnapshots.filter(({ config }) => Boolean(config?.persistence?.enabled));
    const signature = persistedTargets
      .map(({ schema, config }) =>
        [
          schema.id,
          config?.persistence?.mode || 'local',
          config?.persistence?.key || schema.name,
          config?.api?.enabled ? 'api' : 'no-api',
          config?.prefill?.enabled ? 'prefill' : 'no-prefill',
        ].join(':'),
      )
      .join('|');

    if (hydrationSignatureRef.current === signature) return;
    hydrationSignatureRef.current = signature;

    const nextPatch: Record<string, string> = {};
    const currentInput = currentInputRef.current;

    persistedTargets.forEach(({ schema, config }) => {
      const persistence = config?.persistence;
      if (!persistence?.enabled || persistence.mode === 'remote') return;

      const storageKey = String(persistence.key || schema.name || schema.id || '').trim();
      if (!storageKey) return;

      const stored = runtimeAdapter.readPersistedValue(storageKey);
      const currentValue = currentInput[schema.name];
      if (stored !== null && (currentValue === undefined || String(currentValue).trim().length === 0)) {
        nextPatch[schema.name] = stored;
      }
    });

    if (Object.keys(nextPatch).length > 0) {
      commitInputPatch(nextPatch);
    }

    const prefillTargets = fieldSnapshots.filter(({ config }) => Boolean(config?.prefill?.enabled || config?.api?.enabled));
    prefillTargets.forEach((field) => {
      const request = runtimeAdapter.resolveRequest(field, snapshot);
      if (!request || request.requestMode === 'submit' || request.requestMode === 'sync') return;

      const requestSignature = [request.schemaId, request.source, request.method, request.url, request.requestMode].join('|');
      if (remotePrefillSignatureRef.current.has(requestSignature)) return;
      remotePrefillSignatureRef.current.add(requestSignature);

      void applyPrefillResponse(runtimeAdapter, field, request, snapshot, currentInputRef, commitInputPatch).catch((error) => {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('[@sisad-pdfme/ui] Schema runtime prefill failed', error);
        }
      });
    });
  }, [commitInputPatch, fieldSnapshots, isForm, runtimeAdapter, snapshot]);

  useEffect(() => {
    if (!isForm) return;

    const signature = [
      unitCursor,
      JSON.stringify(input || {}),
      fieldSnapshots
        .filter(({ config }) => Boolean(config?.persistence?.enabled || config?.api?.enabled))
        .map(({ schema, config }) =>
          [
            schema.id,
            config?.persistence?.mode || 'local',
            config?.persistence?.key || schema.name,
            config?.api?.enabled ? 'api' : 'no-api',
            config?.api?.requestMode || '',
          ].join(':'),
        )
        .join('|'),
    ].join('::');

    if (syncSignatureRef.current === signature) return;
    syncSignatureRef.current = signature;

    const timer = globalThis.setTimeout(() => {
      fieldSnapshots.forEach(({ schema, config }) => {
        const persistence = config?.persistence;
        if (persistence?.enabled) {
          const storageKey = String(persistence.key || schema.name || schema.id || '').trim();
          if (!storageKey) return;
          const currentValue = currentInputRef.current[schema.name];
          if (persistence.mode !== 'remote') {
            runtimeAdapter.writePersistedValue(storageKey, `${currentValue ?? ''}`);
          }
        }

        const request = runtimeAdapter.resolveRequest({ schema, config }, snapshot);
        if (!request) return;
        if (request.requestMode !== 'submit' && request.requestMode !== 'sync') return;
        if (persistence?.mode === 'local' && !config?.api?.enabled) return;

        void runRuntimeRequest(runtimeAdapter, request, '[@sisad-pdfme/ui] Schema runtime sync failed');
      });
    }, 250);

    return () => globalThis.clearTimeout(timer);
  }, [fieldSnapshots, isForm, runtimeAdapter, snapshot, unitCursor, input]);

  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
  }, [options.zoomLevel, zoomLevel]);

  useEffect(() => {
    if (unitCursor > inputs.length - 1) {
      setUnitCursor(inputs.length - 1);
    }

    init(template);
  }, [template, inputs, size, init, unitCursor]);

  useScrollPageCursor({
    ref: containerRef,
    pageSizes,
    scale,
    pageCursor,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      if (onPageChange) {
        onPageChange({ currentPage: p, totalPages: schemasList.length });
      }
    },
  });

  const handleChangeInput = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      onChangeInput?.({ index: unitCursor, name, value });
    },
    [onChangeInput, unitCursor],
  );

  const handleOnChangeRenderer = useCallback(
    (args: { key: string; value: unknown }[], schema: SchemaForUI) => {
      let isNeedInit = false;
      let newInputValue: string | undefined;

      args.forEach(({ key: _key, value }) => {
        if (_key === 'content') {
          const newValue = value as string;
          const oldValue = input?.[schema.name] || '';
          if (newValue === oldValue) return;

          handleChangeInput({ name: schema.name, value: newValue });
          if (schema.type === 'table') {
            isNeedInit = true;
            newInputValue = newValue;
          }
          return;
        }

        const targetSchema = schemasList[pageCursor].find((s) => s.id === schema.id);
        if (!targetSchema) return;

        targetSchema[_key] = value as string;
      });

      if (isNeedInit && newInputValue !== undefined) {
        const updatedInput = { ...input, [schema.name]: newInputValue };
        init(template, updatedInput);
      }

      setSchemasList([...schemasList]);
    },
    [handleChangeInput, init, input, pageCursor, schemasList, template],
  );

  return {
    font,
    options,
    containerRef,
    paperRefs,
    unitCursor,
    setUnitCursor,
    pageCursor,
    setPageCursor,
    zoomLevel,
    setZoomLevel,
    schemasList,
    backgrounds,
    pageSizes,
    scale,
    error,
    input,
    isForm,
    formJsonEnvelope,
    handleOnChangeRenderer,
    getPagesScrollTopByIndex,
  };
};

export default usePreviewRuntime;
