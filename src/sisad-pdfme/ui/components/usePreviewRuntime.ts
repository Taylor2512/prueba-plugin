/**
 * Hook runtime compartido para Preview/Form/Viewer de SISAD PDFME.
 *
 * Este módulo concentra la preparación del template para renderizado runtime:
 *
 * - calcula templates dinámicos para tablas y contenido variable;
 * - convierte el template en schemas listos para UI;
 * - precarga fondos/imágenes del PDF mediante useUIPreProcessor;
 * - mantiene zoom, página activa y unidad/registro activo;
 * - construye snapshots de campos para persistencia, prefill, API y Form JSON;
 * - sincroniza inputs locales/remotos sin acoplarse a un backend específico;
 * - emite eventos públicos del runtime para extensiones del designer engine.
 *
 * Reglas arquitectónicas:
 *
 * - No debe importar componentes visuales específicos del host.
 * - No debe conocer reglas de negocio SISAD, Uanataca, workflow ni APIs concretas.
 * - No debe modificar geometry/canvas del Designer; solo prepara schemas para Preview.
 * - El adapter de datos (`createSchemaDataRuntimeAdapter`) es la frontera con
 *   persistencia, prefill, requests e integraciones externas.
 */
import { useCallback, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Template, SchemaForUI, Size, getDynamicTemplate } from '@sisad-pdfme/common';
import { getDynamicHeightsForTable } from '@sisad-pdfme/schemas';
import { useUIPreProcessor, useScrollPageCursor } from '@sisad-pdfme/ui/hooks';
import { FontContext, OptionsContext } from '@sisad-pdfme/ui/contexts';
import { template2SchemasList, getPagesScrollTopByIndex, useMaxZoom } from '@sisad-pdfme/ui/helper';
import {
  createSchemaDataRuntimeAdapter,
  getSchemaDesignerConfig,
  resolveDesignerEngine,
  type FormJsonEnvelope,
  type SchemaDataFieldSnapshot,
  type SchemaDataSnapshot,
} from '@sisad-pdfme/ui/designerEngine';
import { emitDesignerRuntimeEvent } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';
import usePaperRefRegistry from '@sisad-pdfme/ui/components/shared/usePaperRefRegistry';
import { isRecord } from '@sisad-pdfme/shared/objectGuards';

/**
 * Cache compartido para getDynamicTemplate.
 *
 * Se mantiene fuera del hook para reutilizar cálculos entre renders,
 * especialmente en templates dinámicos con tablas.
 */
const _cache = new Map<string | number, unknown>();
/**
 * Límite de caché de templates dinámicos procesados.
 *
 * Evita crecimiento indefinido cuando el host cambia entre documentos,
 * inputs o páginas con distintas firmas de runtime.
 */
const MAX_RUNTIME_TEMPLATE_CACHE_ENTRIES = 12;

/**
 * Resuelve una identidad estable del documento renderizado.
 *
 * Prioridad:
 *
 * 1. fileId / fileTemplateId del template.
 * 2. URL o data URL de basePdf.
 * 3. Firma corta del objeto basePdf.
 *
 * Esta identidad se usa para saber cuándo el Preview debe recalcular
 * backgrounds, pageSizes y schemas dinámicos.
 */
const getTemplateDocumentIdentity = (template: Template) => {
  const scopedTemplate = template as Template & { fileId?: string; fileTemplateId?: string };
  const id = String(scopedTemplate?.fileId || scopedTemplate?.fileTemplateId || '');
  if (id) return id;
  const basePdf = template?.basePdf;
  if (!basePdf) return '';
  if (typeof basePdf === 'string') {
    if (basePdf.startsWith('data:')) {
      const prefix = basePdf.slice(0, 128);
      return `data:${basePdf.length}:${prefix}`;
    }
    return `url:${basePdf}`;
  }
  try {
    return `obj:${String(JSON.stringify(basePdf).slice(0, 128))}`;
  } catch {
    return String(basePdf || '');
  }
};

/**
 * Ordena recursivamente objetos JSON para generar firmas estables.
 *
 * Sin este paso, dos objetos con las mismas claves en distinto orden
 * producirían firmas diferentes y dispararían recalculados innecesarios.
 */
const sortJsonValue = (value: unknown): unknown => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sortJsonValue);

  const sortedEntries = Object.entries(value).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return sortedEntries.reduce<Record<string, unknown>>((acc, [key, entryValue]) => {
    acc[key] = sortJsonValue(entryValue);
    return acc;
  }, {});
};

/**
 * Crea una firma JSON estable y tolerante a errores.
 *
 * Se usa como key de deduplicación para evitar rehidratar o recalcular
 * runtime cuando el contenido relevante no cambió.
 */
const buildPreviewStableJsonSignature = (v: unknown) => {
  try {
    return JSON.stringify(sortJsonValue(v));
  } catch {
    return String(v || '');
  }
};

/**
 * Genera una key compacta de layout para comparar schemas.
 *
 * Incluye identidad, página, posición, tamaño y tipo.
 * No compara todo el schema para evitar renders por cambios de metadata
 * que no afectan el layout del Preview.
 */
const buildFieldPersistenceSignature = (
  { schema, config }: SchemaDataFieldSnapshot,
  includeRequestMode = false,
) =>
  [
    schema.id,
    config?.persistence?.mode || 'local',
    config?.persistence?.key || schema.name,
    config?.api?.enabled ? 'api' : 'no-api',
    includeRequestMode
      ? config?.api?.requestMode || ''
      : config?.prefill?.enabled
        ? 'prefill'
        : 'no-prefill',
  ].join(':');

const getSchemaLayoutKey = (schema: SchemaForUI) =>
  [schema?.schemaUid || schema?.id || schema?.name || 'field', schema?.pageNumber || '', schema?.position?.x || 0, schema?.position?.y || 0, schema?.width || 0, schema?.height || 0, schema?.type || '']
    .join(':');

/**
 * Compara dos listas de schemas por layout, no por referencia.
 *
 * Retorna true si ambas listas tienen la misma cantidad de páginas,
 * misma cantidad de schemas por página y la misma key de layout por schema.
 */
const areSchemasListEquivalent = (a: SchemaForUI[][] = [[]], b: SchemaForUI[][] = [[]]) => {
  if ((a || [[]]).length !== (b || [[]]).length) return false;
  for (let i = 0; i < (a || [[]]).length; i += 1) {
    const pa = a[i] || [];
    const pb = b[i] || [];
    if (pa.length !== pb.length) return false;
    for (let j = 0; j < pa.length; j += 1) {
      if (getSchemaLayoutKey(pa[j]) !== getSchemaLayoutKey(pb[j])) return false;
    }
  }
  return true;
};

/**
 * Firma los elementos del template que obligan a reconstruir el runtime.
 *
 * Considera:
 * - identidad del documento;
 * - número de páginas;
 * - layout de schemas.
 */
const createPreviewRuntimeSignature = (template: Template) => {
  const documentKey = getTemplateDocumentIdentity(template);
  const schemaSignature = (template?.schemas || [])
    .flat()
    .map((schema: SchemaForUI) => getSchemaLayoutKey(schema))
    .join('|');

  return buildPreviewStableJsonSignature({ documentKey, pageCount: template?.schemas?.length || 0, schemaSignature });
};

/**
 * Firma únicamente inputs que afectan templates dinámicos.
 *
 * Actualmente filtra campos tipo `table`, porque son los que pueden cambiar
 * altura, saltos de página o layout mediante getDynamicTemplate.
 */
const createInputRuntimeSignature = (template: Template, input: Record<string, string> = {}) => {
  const dynamicNames = new Set<string>();
  (template?.schemas || []).flat().forEach((s: SchemaForUI) => {
    if (s?.type === 'table') dynamicNames.add(s.name);
  });
  const filtered: Record<string, string> = {};
  Object.entries(input || {}).forEach(([k, v]) => {
    if (dynamicNames.has(k)) filtered[k] = v;
  });
  return buildPreviewStableJsonSignature(filtered);
};

/**
 * Resuelve localStorage desde globalThis.
 *
 * Mantenerlo como función permite sustituir/aislar esta dependencia si
 * en el futuro se ejecuta en entornos sin browser real.
 */
const resolveLocalStorage = () => {
  return globalThis.localStorage;
};

/**
 * Ejecuta una petición de prefill y aplica solo valores seguros.
 *
 * Regla importante:
 * Solo rellena campos vacíos. Si el usuario ya escribió un valor,
 * no lo sobrescribe con la respuesta remota.
 */
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

/**
 * Ejecuta una request runtime de sync/submit sin romper el render.
 *
 * Las fallas se reportan por console.warn porque este hook no debe
 * bloquear la experiencia visual del formulario/visor.
 */
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

const mergeStringRecord = (base: Record<string, string> | undefined, patch: Record<string, string>) => ({
  ...(base || {}),
  ...(patch || {}),
});

const areStringRecordsEqual = (left: Record<string, string>, right: Record<string, string>) => {
  const leftKeys = Object.keys(left || {});
  const rightKeys = Object.keys(right || {});
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if ((left || {})[key] !== (right || {})[key]) return false;
  }
  return true;
};

/**
 * Props de entrada del hook de Preview runtime.
 *
 * Este hook es compartido por Form y Viewer:
 *
 * - con onChangeInput/onChangeInputs actúa como Form interactivo;
 * - sin esos callbacks actúa como Viewer/preview de solo lectura.
 */
type UsePreviewRuntimeArgs = {
  template: Template;
  inputs: Array<Record<string, string>>;
  size: Size;
  onChangeInput?: (_args: { index: number; value: string; name: string }) => void;
  onChangeInputs?: (_args: { index: number; values: Record<string, string> }) => void;
  onFormJsonChange?: (_json: FormJsonEnvelope | null) => void;
  onPageChange?: (_pageInfo: { currentPage: number; totalPages: number }) => void;
};

/**
 * Orquesta el runtime de Preview/Form/Viewer.
 *
 * Devuelve estado y handlers necesarios para que el componente Preview pinte
 * páginas, backgrounds, schemas, scroll, zoom, inputs, Form JSON y eventos.
 */
/**
 * Implementación del hook runtime.
 *
 * Mantiene separados los cálculos de template/schemas/backgrounds del componente
 * visual Preview y expone una API estable de estado + callbacks.
 */
const usePreviewRuntime = ({
  template,
  inputs,
  size,
  onChangeInput,
  onChangeInputs,
  onFormJsonChange,
  onPageChange,
}: UsePreviewRuntimeArgs) => {
  /** Contexto visual y funcional del runtime. */
  const font = useContext(FontContext);
  const options = useContext(OptionsContext);
  const maxZoom = useMaxZoom();

  /** Contenedor principal con scroll del Preview. */
  const containerRef = useRef<HTMLDivElement>(null);
  const { paperRefs, registerPaperRef } = usePaperRefRegistry();

  /** Índice del input activo cuando hay múltiples registros/unidades. */
  const [unitCursor, setUnitCursor] = useState(0);
  const [pageCursor, setPageCursor] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);

  /** Engine configurado desde options.designerEngine. */
  const designerEngine = useMemo(() => resolveDesignerEngine(options), [options]);
  const designerEvents = designerEngine.extensions?.events;
  /** Adapter de datos para Form JSON, persistencia, prefill y requests. */
  const runtimeAdapter = useMemo(
    () =>
      createSchemaDataRuntimeAdapter({
        engine: designerEngine,
        fetchImpl: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
        storage: resolveLocalStorage(),
      }),
    [designerEngine],
  );

  /** Emisor de eventos públicos para extensiones del runtime. */
  const emitRuntimeEvent = useCallback(
    (event: Parameters<typeof emitDesignerRuntimeEvent>[1]) => {
      emitDesignerRuntimeEvent(designerEvents, event);
    },
    [designerEvents],
  );

  /** Preprocesa basePdf a backgrounds, tamaños de páginas y escala. */
  const { backgrounds, pageSizes, scale, error, refresh } = useUIPreProcessor({
    template,
    size,
    zoomLevel,
    maxZoom,
  });

  /** Detecta si el runtime está en modo Form interactivo. */
  const isForm = Boolean(onChangeInput);
  const input = inputs[unitCursor];
  const [runtimeInput, setRuntimeInput] = useState<Record<string, string>>(input || {});
  const currentInputRef = useRef<Record<string, string>>(input || {});
  const lastExternalInputRef = useRef<Record<string, string>>(input || {});
  const lastRuntimeUnitCursorRef = useRef(unitCursor);
  const hydrationSignatureRef = useRef('');
  const syncSignatureRef = useRef('');
  const remotePrefillSignatureRef = useRef(new Set<string>());
  const runtimeTemplateCacheRef = useRef(
    new Map<string, { dynamicTemplate: Template; schemasList: SchemaForUI[][] }>(),
  );
  const runtimeSignatureRef = useRef('');

  useEffect(() => {
    const nextExternalInput = input || {};

    if (lastRuntimeUnitCursorRef.current !== unitCursor) {
      lastRuntimeUnitCursorRef.current = unitCursor;
      lastExternalInputRef.current = nextExternalInput;
      currentInputRef.current = nextExternalInput;
      setRuntimeInput(nextExternalInput);
      return;
    }

    const previousExternalInput = lastExternalInputRef.current || {};
    lastExternalInputRef.current = nextExternalInput;

    const externalPatch: Record<string, string> = {};
    const allKeys = new Set([...Object.keys(previousExternalInput), ...Object.keys(nextExternalInput)]);
    allKeys.forEach((key) => {
      if (previousExternalInput[key] !== nextExternalInput[key]) {
        externalPatch[key] = nextExternalInput[key];
      }
    });

    if (Object.keys(externalPatch).length === 0) return;

    currentInputRef.current = mergeStringRecord(currentInputRef.current, externalPatch);
    setRuntimeInput((prev) => {
      const next = mergeStringRecord(prev, externalPatch);
      return areStringRecordsEqual(prev, next) ? prev : next;
    });
  }, [input, unitCursor]);

  useEffect(() => {
    currentInputRef.current = runtimeInput;
  }, [runtimeInput]);

  /** Firma que dispara reconstrucción cuando cambia template o input dinámico. */
  const triggerSignature = useMemo(() => {
    try {
      const tSig = createPreviewRuntimeSignature(template);
      const iSig = createInputRuntimeSignature(template, runtimeInput);
      return buildPreviewStableJsonSignature({ tSig, iSig });
    } catch {
      return '';
    }
  }, [template, runtimeInput]);

  /** Snapshot plano de campos + configuración de designer engine. */
  const fieldSnapshots = useMemo<SchemaDataFieldSnapshot[]>(
    () =>
      schemasList.flat().map((schema) => ({
        schema,
        config: getSchemaDesignerConfig(schema, designerEngine) || null,
      })),
    [designerEngine, schemasList],
  );

  /** Snapshot runtime completo usado por adapter de datos. */
  const snapshot = useMemo<SchemaDataSnapshot>(
    () => ({
      pageIndex: pageCursor,
      totalPages: schemasList.length,
      unitIndex: unitCursor,
      currentInput: runtimeInput,
      fields: fieldSnapshots,
    }),
    [fieldSnapshots, pageCursor, runtimeInput, schemasList.length, unitCursor],
  );

  /**
   * Aplica cambios de input hacia el host.
   *
   * Si existe onChangeInputs, emite un cambio batch. Si no, emite
   * un cambio individual por cada campo modificado.
   */
  const commitInputPatch = useCallback(
    (patch: Record<string, string>) => {
      const entries = Object.entries(patch).filter(([, value]) => value !== undefined);
      if (entries.length === 0) return;

      if (onChangeInputs) {
        const nextRuntimeInput = mergeStringRecord(currentInputRef.current, Object.fromEntries(entries));
        currentInputRef.current = nextRuntimeInput;
        setRuntimeInput(nextRuntimeInput);
        onChangeInputs({ index: unitCursor, values: Object.fromEntries(entries) });
        emitRuntimeEvent({
          type: 'runtime.input.batch.changed',
          source: isForm ? 'form' : 'viewer',
          component: 'Preview',
          unitIndex: unitCursor,
          values: Object.fromEntries(entries),
          details: { changedCount: entries.length },
        });
        return;
      }

      entries.forEach(([name, value]) => {
        const nextRuntimeInput = mergeStringRecord(currentInputRef.current, { [name]: value });
        currentInputRef.current = nextRuntimeInput;
        setRuntimeInput(nextRuntimeInput);
        onChangeInput?.({ index: unitCursor, name, value });
        emitRuntimeEvent({
          type: 'runtime.input.changed',
          source: isForm ? 'form' : 'viewer',
          component: 'Preview',
          unitIndex: unitCursor,
          value,
          details: { name },
        });
      });
    },
    [emitRuntimeEvent, isForm, onChangeInput, onChangeInputs, unitCursor],
  );

  /** Form JSON derivado del snapshot actual. */
  const formJsonEnvelope = useMemo(() => runtimeAdapter.buildFormJson(snapshot), [runtimeAdapter, snapshot]);

  /**
   * Inicializa o recalcula el runtime visual.
   *
   * Flujo:
   * 1. Genera firma runtime.
   * 2. Reusa caché si existe.
   * 3. Calcula dynamicTemplate.
   * 4. Convierte template a schemasList de UI.
   * 5. Refresca backgrounds/pageSizes mediante useUIPreProcessor.
   */
  const init = useCallback(
    (nextTemplate: Template, inputOverride?: Record<string, string>) => {
      const currentInput = inputOverride ?? currentInputRef.current;
      const templateSig = createPreviewRuntimeSignature(nextTemplate);
      const inputSig = createInputRuntimeSignature(nextTemplate, currentInput);
      const runtimeSignature = buildPreviewStableJsonSignature({ templateSig, inputSig });
      const cachedRuntime = runtimeTemplateCacheRef.current.get(runtimeSignature) as
        | { dynamicTemplate: Template; schemasList: SchemaForUI[][] }
        | undefined;
      if (cachedRuntime) {
        setSchemasList((prev) => (areSchemasListEquivalent(prev, cachedRuntime.schemasList) ? prev : cachedRuntime.schemasList));
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
          setSchemasList((prev) => (areSchemasListEquivalent(prev, nextSchemasList) ? prev : nextSchemasList));
          await refresh(dynamicTemplate);
        })
        .catch((err) => console.error('[@sisad-pdfme/ui] ', err));
    },
    [font, refresh],
  );

  /** Notifica cambios del Form JSON al host y a las extensiones. */
  useEffect(() => {
    if (onFormJsonChange) {
      onFormJsonChange(formJsonEnvelope);
    }
    emitRuntimeEvent({
      type: 'runtime.output.form-json.changed',
      source: isForm ? 'form' : 'viewer',
      component: 'Preview',
      value: formJsonEnvelope,
      details: {
        totalPages: formJsonEnvelope?.meta?.totalPages ?? pageSizes.length,
      },
    });
  }, [emitRuntimeEvent, formJsonEnvelope, isForm, onFormJsonChange, pageSizes.length]);

  /**
   * Hidratación inicial de campos persistidos y prefill remoto.
   *
   * Solo corre en modo Form. Usa firmas para no repetir hidrataciones
   * sobre la misma combinación de campos/configuración.
   */
  useEffect(() => {
    if (!isForm) return;

    const persistedTargets = fieldSnapshots.filter(({ config }) => Boolean(config?.persistence?.enabled));
    const signature = persistedTargets
      .map((field) => buildFieldPersistenceSignature(field))
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

    const prefillTargets = fieldSnapshots.filter(
      ({ config }) =>
        Boolean(
          config?.prefill?.enabled ||
            config?.api?.enabled ||
            (Array.isArray(config?.integrations) && config.integrations.some((integration) => integration?.enabled !== false)),
        ),
    );
    prefillTargets.forEach((field) => {
      runtimeAdapter.resolveRequests(field, snapshot).forEach((request) => {
        if (request.requestMode === 'submit' || request.requestMode === 'sync') return;

        const requestSignature = [
          request.schemaId,
          request.source,
          request.integrationProvider || '',
          request.integrationOperation || '',
          request.method,
          request.url,
          request.requestMode,
        ].join('|');
        if (remotePrefillSignatureRef.current.has(requestSignature)) return;
        remotePrefillSignatureRef.current.add(requestSignature);

        void applyPrefillResponse(runtimeAdapter, field, request, snapshot, currentInputRef, commitInputPatch).catch((error) => {
          if (typeof console !== 'undefined' && console.warn) {
            console.warn('[@sisad-pdfme/ui] Schema runtime prefill failed', error);
          }
        });
      });
    });
  }, [commitInputPatch, fieldSnapshots, isForm, runtimeAdapter, snapshot]);

  /**
   * Sincroniza cambios del formulario hacia persistencia local o APIs remotas.
   *
   * Tiene debounce manual de 250ms para evitar requests/escrituras por cada
   * pulsación inmediata del usuario.
   */
  useEffect(() => {
    if (!isForm) return;

    const signature = [
      unitCursor,
      JSON.stringify(runtimeInput || {}),
      fieldSnapshots
        .filter(({ config }) => Boolean(config?.persistence?.enabled || config?.api?.enabled))
        .map((field) => buildFieldPersistenceSignature(field, true))
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

        runtimeAdapter.resolveRequests({ schema, config }, snapshot).forEach((request) => {
          if (request.requestMode !== 'submit' && request.requestMode !== 'sync') return;
          void runRuntimeRequest(runtimeAdapter, request, '[@sisad-pdfme/ui] Schema runtime sync failed');
        });
      });
    }, 250);

    return () => globalThis.clearTimeout(timer);
  }, [fieldSnapshots, isForm, runtimeAdapter, snapshot, unitCursor, runtimeInput]);

  /** Sincroniza zoomLevel externo desde options. */
  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
  }, [options.zoomLevel, zoomLevel]);

  /** Evita que unitCursor apunte fuera del arreglo de inputs. */
  useEffect(() => {
    if (unitCursor > inputs.length - 1) {
      setUnitCursor(inputs.length - 1);
    }
  }, [inputs.length, unitCursor]);

  /** Emite evento cuando cambia la página activa. */
  useEffect(() => {
    emitRuntimeEvent({
      type: 'runtime.view.page.changed',
      source: isForm ? 'form' : 'viewer',
      component: 'Preview',
      pageIndex: pageCursor,
      unitIndex: unitCursor,
      details: { totalPages: pageSizes.length },
    });
  }, [emitRuntimeEvent, isForm, pageCursor, pageSizes.length, unitCursor]);

  /** Emite evento cuando cambia zoom/escala/viewport. */
  useEffect(() => {
    emitRuntimeEvent({
      type: 'runtime.view.zoom.changed',
      source: 'runtime',
      component: 'Preview',
      value: zoomLevel,
      details: { scale, viewportWidth: size.width, viewportHeight: size.height },
    });
  }, [emitRuntimeEvent, scale, size.height, size.width, zoomLevel]);

  /** Recalcula runtime cuando cambia la firma relevante. */
  useEffect(() => {
    if (!triggerSignature) return;
    if (runtimeSignatureRef.current === triggerSignature) return;
    runtimeSignatureRef.current = triggerSignature;
    init(template);
  }, [triggerSignature, init, template]);

  /** Sincroniza pageCursor con el scroll real del contenedor. */
  useScrollPageCursor({
    ref: containerRef,
    paperRefs,
    pageSizes,
    scale,
    pageCursor,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      if (onPageChange) {
        onPageChange({ currentPage: p, totalPages: pageSizes.length });
      }
    },
  });

  /**
   * Handler usado por renderers de schemas.
   *
   * - Cambios `content` actualizan input.
   * - Cambios distintos de `content` actualizan el schema en schemasList.
   * - Si el schema es tabla y cambia content, recalcula dynamic template.
   */
  const handleOnChangeRenderer = useCallback(
    (args: { key: string; value: unknown }[], schema: SchemaForUI) => {
      let isNeedInit = false;
      let newInputValue: string | undefined;

      const contentArg = args.find((a) => a.key === 'content');
      if (contentArg) {
        const newValue = String(contentArg.value ?? '');
        const oldValue = currentInputRef.current?.[schema.name] || '';
        if (newValue !== oldValue) {
          currentInputRef.current = {
            ...(currentInputRef.current || {}),
            [schema.name]: newValue,
          };
          commitInputPatch({ [schema.name]: newValue });
          if (schema.type === 'table') {
            isNeedInit = true;
            newInputValue = newValue;
          }
        }
      }

      const nonContentArgs = args.filter((a) => a.key !== 'content');
      if (nonContentArgs.length > 0) {
        setSchemasList((prev) => {
          const page = prev[pageCursor] || [];
          let changed = false;
          const newPage = page.map((s) => {
            if (s.id !== schema.id) return s;
            let ns = s;
            nonContentArgs.forEach(({ key: _k, value }) => {
              const currentValue = isRecord(ns) ? ns[_k] : undefined;
              if (currentValue !== value) {
                ns = { ...ns, [_k]: value } as SchemaForUI;
                changed = true;
              }
            });
            return ns;
          });
          if (!changed) return prev;
          return prev.map((p, idx) => (idx === pageCursor ? newPage : p));
        });
      }

      if (isNeedInit && newInputValue !== undefined) {
        const updatedInput = { ...(currentInputRef.current || {}), [schema.name]: newInputValue };
        init(template, updatedInput);
      }
    },
    [commitInputPatch, init, pageCursor, template],
  );

  /** API de estado/acciones consumida por el componente Preview. */
  return {
    font,
    options,
    containerRef,
    paperRefs,
    registerPaperRef,
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
    input: runtimeInput,
    isForm,
    formJsonEnvelope,
    handleOnChangeRenderer,
    getPagesScrollTopByIndex,
  };
};

export default usePreviewRuntime;
