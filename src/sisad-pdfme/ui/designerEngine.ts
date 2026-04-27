import { cloneDeep, Schema, SchemaForUI, UIOptions } from '@sisad-pdfme/common';
import type React from 'react';
import type { LeftSidebarProps } from './components/Designer/LeftSidebar';
import type { RightSidebarProps } from './components/Designer/RightSidebar/index';
import {
  normalizeCollaborationRecipients,
  resolveOwnerMode,
  type CollaborationRecipientOption,
} from './collaborationContext.js';
import type {
  CanvasClassNames,
  CanvasComponentSlots,
  CanvasFeatureToggles,
  CanvasStyleOverrides,
} from './components/Designer/Canvas/Canvas.js';

export const DEFAULT_SCHEMA_CONFIG_STORAGE_KEY = '__designer';

export type SchemaIdentity = {
  id?: string;
  key?: string;
  namespace?: string;
  version?: string;
  tags?: string[];
};

export type SchemaCollaborativeState = 'draft' | 'locked' | 'merged';

export type SchemaCollaborativeLock = {
  lockedBy?: string;
  lockedAt?: number;
  reason?: string;
  sessionId?: string;
};

export type SchemaCommentReply = {
  id: string;
  authorId?: string;
  authorName?: string;
  authorColor?: string | null;
  timestamp?: number;
  createdAt?: number;
  text: string;
  resolved?: boolean;
};

export type SchemaComment = {
  id: string;
  fileId?: string | null;
  pageNumber?: number;
  fieldId?: string | null;
  schemaUid?: string | null;
  authorId?: string;
  authorName?: string;
  authorColor?: string | null;
  timestamp?: number;
  createdAt?: number;
  text: string;
  resolved?: boolean;
  anchor?: SchemaCommentAnchor;
  replies?: SchemaCommentReply[];
};

export type SchemaCommentAnchor = {
  id: string;
  fieldId?: string | null;
  schemaUid?: string;
  fileId?: string | null;
  pageNumber?: number;
  authorId?: string;
  authorColor?: string | null;
  x?: number;
  y?: number;
  resolved?: boolean;
};

export type CollaborationPresence = {
  userId: string;
  name?: string | null;
  color?: string | null;
  role?: string | null;
  activeDocumentId?: string | null;
  activePage?: number | null;
  activeSchemaIds?: string[];
  interactionPhase?: string | null;
  updatedAt: number;
};

export type CollaborationHistoryEventType =
  | 'schema.created'
  | 'schema.updated'
  | 'schema.deleted'
  | 'comment.created'
  | 'comment.updated'
  | 'comment.deleted'
  | 'lock.changed';

export type CollaborationHistoryEntry = {
  id: string;
  type: CollaborationHistoryEventType;
  schemaId?: string;
  schemaUid?: string;
  fileId?: string | null;
  pageIndex?: number;
  actorId?: string | null;
  actorColor?: string | null;
  timestamp: number;
  payload?: Record<string, unknown>;
};

export type CollaborationProviderName = 'legacy' | 'yjs';

export type SchemaCollaborativeMetadata = {
  schemaUid?: string;
  fileId?: string | null;
  fileTemplateId?: string | null;
  pageNumber?: number;
  ownerMode?: 'single' | 'multi' | 'shared';
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[];
  ownerRecipientName?: string | null;
  ownerColor?: string | null;
  userColor?: string | null;
  createdBy?: string | null;
  lastModifiedBy?: string | null;
  createdAt?: number;
  updatedAt?: number;
  lastModifiedAt?: number;
  commentsCount?: number;
  state?: SchemaCollaborativeState;
  lock?: SchemaCollaborativeLock;
  comments?: SchemaComment[];
  commentAnchors?: SchemaCommentAnchor[];
  commentsAnchors?: SchemaCommentAnchor[];
  saveValue?: boolean;
};

export type CollaborationSyncConfig = {
  enabled?: boolean;
  url?: string;
  protocols?: string | string[];
  sessionId?: string;
  provider?: CollaborationProviderName;
  actorId?: string;
  actorColor?: string | null;
  recipientOptions?: CollaborationRecipientOption[];
  users?: CollaborationRecipientOption[];
  activeRecipientId?: string | null;
  activeUserId?: string | null;
  isGlobalView?: boolean;
  presence?: CollaborationPresence[];
  history?: CollaborationHistoryEntry[];
  reconnectMs?: number;
};

export type SchemaPrefillConfig = {
  enabled?: boolean;
  strategy?: 'manual' | 'payload' | 'api';
  sourceKey?: string;
  resolverId?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  mapping?: Record<string, string>;
  headers?: Record<string, string>;
};

export type SchemaHttpAuthConfig = {
  mode?: 'inherit' | 'manual';
  type?: 'bearer' | 'basic' | 'apiKey' | 'custom';
  headerName?: string;
  headerValue?: string;
  token?: string;
  username?: string;
  password?: string;
};

export type SchemaHttpClientConfig = {
  inheritSystem?: boolean;
  baseURL?: string;
  timeoutMs?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  auth?: SchemaHttpAuthConfig;
};

export type SchemaPersistenceConfig = {
  enabled?: boolean;
  mode?: 'local' | 'remote' | 'hybrid';
  key?: string;
  includeHidden?: boolean;
  includeMeta?: boolean;
};

export type SchemaRequestConfig = {
  enabled?: boolean;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requestMode?: 'read' | 'submit' | 'sync' | 'options';
  http?: SchemaHttpClientConfig;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  requestMapping?: Record<string, string>;
  responseMapping?: Record<string, string>;
  timeoutMs?: number;
};

export type SchemaFormJsonConfig = {
  enabled?: boolean;
  collect?: boolean;
  format?: 'nested' | 'flat';
  rootKey?: string;
  includeEmpty?: boolean;
  includeHidden?: boolean;
  includeMeta?: boolean;
};

export type SchemaIntegrationConfig = {
  provider: string;
  operation?: string;
  endpoint?: string;
  authRef?: string;
  enabled?: boolean;
  params?: Record<string, unknown>;
};

export type SchemaDesignerConfig = {
  identity?: SchemaIdentity;
  prefill?: SchemaPrefillConfig;
  persistence?: SchemaPersistenceConfig;
  api?: SchemaRequestConfig;
  form?: SchemaFormJsonConfig;
  integrations?: SchemaIntegrationConfig[];
  collaboration?: SchemaCollaborativeMetadata;
  metadata?: Record<string, unknown>;
};

export type SchemaCreationContext = {
  pageIndex: number;
  totalPages: number;
  timestamp: number;
  pageNumber?: number;
  fileId?: string | null;
  actorId?: string | null;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[];
  ownerRecipientName?: string | null;
  ownerColor?: string | null;
  userColor?: string | null;
};
export type SchemaCreationContextInput = {
  pageIndex: number;
  totalPages: number;
  timestamp?: number;
  pageNumber?: number;
  fileId?: string | null;
  collaboration?: Partial<
    Pick<
      SchemaCreationContext,
      'actorId' | 'ownerRecipientId' | 'ownerRecipientIds' | 'ownerRecipientName' | 'ownerColor' | 'userColor'
    >
  >;
};

const normalizeCreationOwnerIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }
  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }
  return [];
};

export const createSchemaCreationContext = (input: SchemaCreationContextInput): SchemaCreationContext => {
  const nextTimestamp = Number.isFinite(input.timestamp as number) ? Number(input.timestamp) : Date.now();
  const collaboration = input.collaboration || {};
  const ownerRecipientIds = normalizeCreationOwnerIds(
    collaboration.ownerRecipientIds || collaboration.ownerRecipientId || undefined,
  );
  const ownerRecipientId = (typeof collaboration.ownerRecipientId === 'string' && collaboration.ownerRecipientId.trim())
    ? collaboration.ownerRecipientId.trim()
    : ownerRecipientIds[0] || null;

  return {
    pageIndex: input.pageIndex,
    totalPages: input.totalPages,
    timestamp: nextTimestamp,
    pageNumber: input.pageNumber ?? input.pageIndex + 1,
    fileId: input.fileId ?? null,
    actorId: collaboration.actorId ?? null,
    ownerRecipientId,
    ownerRecipientIds,
    ownerRecipientName: collaboration.ownerRecipientName ?? null,
    ownerColor: collaboration.ownerColor ?? null,
    userColor: collaboration.userColor ?? null,
  };
};

export type SchemaCreationHook = (schema: SchemaForUI, context: SchemaCreationContext) => SchemaForUI;
export type SchemaIdentityFactory = (schema: SchemaForUI, context: SchemaCreationContext) => SchemaIdentity;

export type DesignerEngine = {
  http?: {
    axios?: SchemaHttpClientConfig;
  };
  renderers?: {
    leftSidebar?: React.ComponentType<LeftSidebarProps>;
    rightSidebar?: React.ComponentType<RightSidebarProps>;
  };
  sidebars?: {
    left?: Partial<LeftSidebarProps>;
    right?: Partial<RightSidebarProps>;
  };
  canvas?: {
    featureToggles?: CanvasFeatureToggles;
    styleOverrides?: CanvasStyleOverrides;
    classNames?: CanvasClassNames;
    useDefaultStyles?: boolean;
    components?: CanvasComponentSlots;
  };
  schema?: {
    configStorageKey?: string;
    autoAttachIdentity?: boolean;
    identityFactory?: SchemaIdentityFactory;
    onCreate?: SchemaCreationHook;
  };
  collaboration?: CollaborationSyncConfig;
};

type LeftSidebarEngineProps = NonNullable<DesignerEngine['sidebars']>['left'];
type RightSidebarEngineProps = NonNullable<DesignerEngine['sidebars']>['right'];

const cloneDesignerEngine = (engine: DesignerEngine = {}): DesignerEngine => ({
  renderers: engine.renderers
    ? {
        leftSidebar: engine.renderers.leftSidebar,
        rightSidebar: engine.renderers.rightSidebar,
      }
    : undefined,
  sidebars: engine.sidebars
    ? {
        left: engine.sidebars.left ? { ...engine.sidebars.left } : undefined,
        right: engine.sidebars.right ? { ...engine.sidebars.right } : undefined,
      }
    : undefined,
  canvas: engine.canvas
    ? {
        featureToggles: engine.canvas.featureToggles ? { ...engine.canvas.featureToggles } : undefined,
        styleOverrides: engine.canvas.styleOverrides ? cloneDeep(engine.canvas.styleOverrides) : undefined,
        classNames: engine.canvas.classNames ? { ...engine.canvas.classNames } : undefined,
        useDefaultStyles: engine.canvas.useDefaultStyles,
        components: engine.canvas.components
          ? {
              Guides: engine.canvas.components.Guides,
              Mask: engine.canvas.components.Mask,
              Moveable: engine.canvas.components.Moveable,
              Padding: engine.canvas.components.Padding,
              Selecto: engine.canvas.components.Selecto,
              SnapLines: engine.canvas.components.SnapLines,
            }
          : undefined,
      }
      : undefined,
  http: engine.http
    ? {
        axios: engine.http.axios ? cloneDeep(engine.http.axios) : undefined,
      }
    : undefined,
  schema: engine.schema
    ? {
        configStorageKey: engine.schema.configStorageKey,
        autoAttachIdentity: engine.schema.autoAttachIdentity,
        identityFactory: engine.schema.identityFactory,
        onCreate: engine.schema.onCreate,
      }
    : undefined,
  collaboration: engine.collaboration
    ? {
        ...engine.collaboration,
        recipientOptions: normalizeCollaborationRecipients(
          engine.collaboration.recipientOptions || engine.collaboration.users,
        ),
        users: normalizeCollaborationRecipients(engine.collaboration.users),
      }
    : undefined,
});

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const mergeRecord = <T extends Record<string, unknown>>(current?: T, patch?: Partial<T>): T => ({
  ...(current || {}),
  ...(patch || {}),
}) as T;

const mergeHttpAuthConfig = (
  current?: SchemaHttpAuthConfig,
  patch?: SchemaHttpAuthConfig,
): SchemaHttpAuthConfig | undefined => {
  if (!current && !patch) return undefined;
  return {
    ...(current || {}),
    ...(patch || {}),
  };
};

const mergeHttpClientConfig = (
  current?: SchemaHttpClientConfig,
  patch?: SchemaHttpClientConfig,
): SchemaHttpClientConfig | undefined => {
  if (!current && !patch) return undefined;
  return {
    ...(current || {}),
    ...(patch || {}),
    headers: mergeRecord(current?.headers, patch?.headers),
    auth: mergeHttpAuthConfig(current?.auth, patch?.auth),
  };
};

const mergeRequestConfig = (
  current?: SchemaRequestConfig,
  patch?: SchemaRequestConfig,
): SchemaRequestConfig | undefined => {
  if (!current && !patch) return undefined;
  return {
    ...(current || {}),
    ...(patch || {}),
    http: mergeHttpClientConfig(current?.http, patch?.http),
    headers: mergeRecord(current?.headers, patch?.headers),
    params: mergeRecord(current?.params, patch?.params),
    requestMapping: mergeRecord(current?.requestMapping, patch?.requestMapping),
    responseMapping: mergeRecord(current?.responseMapping, patch?.responseMapping),
  };
};

const normalizeRecipientIds = (value?: string[] | string | null): string[] => {
  if (Array.isArray(value)) {
    const normalized = value.map((entry) => String(entry || '').trim()).filter(Boolean);
    return normalized.length > 0 ? Array.from(new Set(normalized)) : [];
  }

  if (typeof value === 'string') {
    const normalized = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    return normalized.length > 0 ? Array.from(new Set(normalized)) : [];
  }

  return [];
};

const mergeCollaborationLock = (
  current?: SchemaCollaborativeLock,
  patch?: SchemaCollaborativeLock,
): SchemaCollaborativeLock | undefined => {
  if (!current && !patch) return undefined;
  return {
    ...(current || {}),
    ...(patch || {}),
  };
};

export const mergeSchemaCollaborativeMetadata = (
  current?: SchemaCollaborativeMetadata,
  patch?: Partial<SchemaCollaborativeMetadata>,
): SchemaCollaborativeMetadata | undefined => {
  if (!current && !patch) return undefined;

  return {
    ...(current || {}),
    ...(patch || {}),
    ownerRecipientIds: normalizeRecipientIds(patch?.ownerRecipientIds ?? current?.ownerRecipientIds),
    lock: mergeCollaborationLock(current?.lock, patch?.lock),
  };
};

export const resolveSchemaCollaborativeMetadata = (
  schema: SchemaForUI,
  engine?: DesignerEngine,
): SchemaCollaborativeMetadata | undefined => {
  const rawSchema = schema as SchemaForUI & Record<string, unknown>;
  const fromFields: SchemaCollaborativeMetadata = {
    schemaUid: typeof rawSchema.schemaUid === 'string' ? rawSchema.schemaUid : undefined,
    fileId: typeof rawSchema.fileId === 'string' ? rawSchema.fileId : undefined,
    fileTemplateId: typeof rawSchema.fileTemplateId === 'string' ? rawSchema.fileTemplateId : undefined,
    pageNumber: typeof rawSchema.pageNumber === 'number' ? rawSchema.pageNumber : undefined,
    ownerMode:
      rawSchema.ownerMode === 'single' || rawSchema.ownerMode === 'multi' || rawSchema.ownerMode === 'shared'
        ? rawSchema.ownerMode
        : undefined,
    ownerRecipientId: typeof rawSchema.ownerRecipientId === 'string' ? rawSchema.ownerRecipientId : undefined,
    ownerRecipientIds: Array.isArray(rawSchema.ownerRecipientIds)
      ? normalizeRecipientIds(rawSchema.ownerRecipientIds as string[])
      : undefined,
    ownerRecipientName: typeof rawSchema.ownerRecipientName === 'string' ? rawSchema.ownerRecipientName : undefined,
    ownerColor: typeof rawSchema.ownerColor === 'string' ? rawSchema.ownerColor : undefined,
    userColor: typeof rawSchema.userColor === 'string' ? rawSchema.userColor : undefined,
    createdBy: typeof rawSchema.createdBy === 'string' ? rawSchema.createdBy : undefined,
    lastModifiedBy: typeof rawSchema.lastModifiedBy === 'string' ? rawSchema.lastModifiedBy : undefined,
    createdAt: typeof rawSchema.createdAt === 'number' ? rawSchema.createdAt : undefined,
    updatedAt: typeof rawSchema.updatedAt === 'number' ? rawSchema.updatedAt : undefined,
    lastModifiedAt: typeof rawSchema.lastModifiedAt === 'number' ? rawSchema.lastModifiedAt : undefined,
    commentsCount: typeof rawSchema.commentsCount === 'number' ? rawSchema.commentsCount : undefined,
    state: rawSchema.state === 'draft' || rawSchema.state === 'locked' || rawSchema.state === 'merged'
      ? rawSchema.state
      : undefined,
    lock: rawSchema.lock && typeof rawSchema.lock === 'object'
      ? mergeCollaborationLock(undefined, rawSchema.lock as SchemaCollaborativeLock)
      : undefined,
    comments: Array.isArray(rawSchema.comments) ? (rawSchema.comments as SchemaComment[]) : undefined,
    commentAnchors: Array.isArray(rawSchema.commentAnchors)
      ? (rawSchema.commentAnchors as SchemaCommentAnchor[])
      : undefined,
    commentsAnchors: Array.isArray(rawSchema.commentsAnchors)
      ? (rawSchema.commentsAnchors as SchemaCommentAnchor[])
      : undefined,
    saveValue: typeof rawSchema.saveValue === 'boolean' ? rawSchema.saveValue : undefined,
  };

  const config = getSchemaDesignerConfig(schema, engine);
  const fromConfig = config?.collaboration ? cloneDeep(config.collaboration) : undefined;
  const merged = mergeSchemaCollaborativeMetadata(fromFields, fromConfig);
  return merged || undefined;
};

export const applySchemaCollaborativeDefaults = (
  schema: SchemaForUI,
  context: SchemaCreationContext,
  engine?: DesignerEngine,
): SchemaForUI => {
  const collaborative = resolveSchemaCollaborativeMetadata(schema, engine) || {};
  const timestamp = context.timestamp;
  const ownerRecipientIds = normalizeRecipientIds(
    context.ownerRecipientIds ?? collaborative.ownerRecipientIds ?? collaborative.ownerRecipientId,
  );
  const ownerMode = resolveOwnerMode(collaborative.ownerMode, ownerRecipientIds);
  const commentsCount = typeof collaborative.commentsCount === 'number'
    ? collaborative.commentsCount
    : Array.isArray(collaborative.comments)
      ? collaborative.comments.length
      : 0;
  const ownerRecipientId = collaborative.ownerRecipientId ?? context.ownerRecipientId ?? ownerRecipientIds[0];
  const ownerRecipientName = collaborative.ownerRecipientName ?? context.ownerRecipientName ?? null;
  const ownerColor = collaborative.ownerColor ?? context.ownerColor ?? null;
  const userColor = collaborative.userColor ?? context.userColor ?? ownerColor;
  const createdBy = collaborative.createdBy ?? context.actorId;
  const lastModifiedBy = context.actorId ?? collaborative.lastModifiedBy ?? ownerRecipientId;

  return {
    ...schema,
    schemaUid: collaborative.schemaUid || schema.id,
    fileId: collaborative.fileId ?? context.fileId ?? undefined,
    fileTemplateId: collaborative.fileTemplateId ?? context.fileId ?? undefined,
    pageNumber: collaborative.pageNumber ?? context.pageNumber ?? context.pageIndex + 1,
    ownerMode,
    ownerRecipientId,
    ownerRecipientIds: ownerRecipientIds,
    ownerRecipientName,
    ownerColor,
    userColor,
    createdBy,
    lastModifiedBy,
    createdAt: collaborative.createdAt ?? timestamp,
    updatedAt: timestamp,
    lastModifiedAt: timestamp,
    commentsCount,
    state: collaborative.state || 'draft',
    saveValue: typeof collaborative.saveValue === 'boolean' ? collaborative.saveValue : true,
    lock: undefined,
  } as SchemaForUI;
};

export const refreshSchemaCollaborativeMetadata = (
  schema: SchemaForUI,
  context: SchemaCreationContext,
  engine?: DesignerEngine,
): SchemaForUI => {
  const collaborative = resolveSchemaCollaborativeMetadata(schema, engine) || {};
  return applySchemaCollaborativeDefaults(
    {
      ...schema,
      schemaUid: collaborative.schemaUid || schema.id,
      fileId: collaborative.fileId ?? context.fileId ?? undefined,
      fileTemplateId: collaborative.fileTemplateId ?? context.fileId ?? undefined,
      pageNumber: context.pageNumber ?? collaborative.pageNumber ?? context.pageIndex + 1,
      ownerRecipientId: collaborative.ownerRecipientId ?? context.ownerRecipientId,
      ownerRecipientIds: collaborative.ownerRecipientIds,
      ownerRecipientName: collaborative.ownerRecipientName ?? context.ownerRecipientName,
      ownerColor: collaborative.ownerColor ?? context.ownerColor,
      userColor: collaborative.userColor ?? context.userColor ?? collaborative.ownerColor ?? context.ownerColor,
      createdBy: collaborative.createdBy ?? context.actorId,
      lastModifiedBy: context.actorId ?? collaborative.lastModifiedBy,
      createdAt: collaborative.createdAt ?? context.timestamp,
      updatedAt: context.timestamp,
      lastModifiedAt: context.timestamp,
      ownerMode: resolveOwnerMode(collaborative.ownerMode, collaborative.ownerRecipientIds || []),
      commentsCount:
        typeof collaborative.commentsCount === 'number'
          ? collaborative.commentsCount
          : Array.isArray(collaborative.comments)
            ? collaborative.comments.length
            : 0,
      state: collaborative.state || 'draft',
      saveValue: typeof collaborative.saveValue === 'boolean' ? collaborative.saveValue : true,
      lock: undefined,
    } as SchemaForUI,
    context,
    engine,
  );
};

export const resolveDesignerEngine = (options: UIOptions | Record<string, unknown> | undefined): DesignerEngine => {
  const rawOptions = asRecord(options);
  if (!rawOptions) return {};
  const rawEngine = asRecord(rawOptions.designerEngine);
  if (!rawEngine) return {};
  return rawEngine as unknown as DesignerEngine;
};

export const getSchemaConfigStorageKey = (engine?: DesignerEngine): string =>
  engine?.schema?.configStorageKey || DEFAULT_SCHEMA_CONFIG_STORAGE_KEY;

export const getSchemaDesignerConfig = (
  schema: Schema | SchemaForUI,
  engine?: DesignerEngine,
): SchemaDesignerConfig | undefined => {
  const key = getSchemaConfigStorageKey(engine);
  const rawSchema = asRecord(schema);
  if (!rawSchema) return undefined;
  const rawConfig = asRecord(rawSchema[key]);
  if (!rawConfig) return undefined;
  return rawConfig as unknown as SchemaDesignerConfig;
};

export const setSchemaDesignerConfig = <T extends Schema | SchemaForUI>(
  schema: T,
  config: SchemaDesignerConfig,
  engine?: DesignerEngine,
): T => {
  const key = getSchemaConfigStorageKey(engine);
  const next = cloneDeep(schema) as T & Record<string, unknown>;
  next[key] = config;
  return next;
};

export const mergeSchemaDesignerConfig = <T extends Schema | SchemaForUI>(
  schema: T,
  patch: Partial<SchemaDesignerConfig>,
  engine?: DesignerEngine,
): T => {
  const current = getSchemaDesignerConfig(schema, engine) || {};
  return setSchemaDesignerConfig(
    schema,
    {
      ...current,
      ...patch,
      identity: { ...(current.identity || {}), ...(patch.identity || {}) },
      prefill: { ...(current.prefill || {}), ...(patch.prefill || {}) },
      persistence: { ...(current.persistence || {}), ...(patch.persistence || {}) },
      api: mergeRequestConfig(current.api, patch.api),
      form: { ...(current.form || {}), ...(patch.form || {}) },
      collaboration: mergeSchemaCollaborativeMetadata(current.collaboration, patch.collaboration),
      metadata: { ...(current.metadata || {}), ...(patch.metadata || {}) },
      integrations: patch.integrations || current.integrations,
    },
    engine,
  );
};

export const resolveDesignerHttpClientConfig = (
  schemaConfig?: SchemaDesignerConfig | null,
  engine?: DesignerEngine,
): SchemaHttpClientConfig | undefined => {
  const systemConfig = engine?.http?.axios;
  const schemaConfigHttp = schemaConfig?.api?.http;
  if (!systemConfig && !schemaConfigHttp) return undefined;
  if (!schemaConfigHttp) return cloneDeep(systemConfig);
  if (schemaConfigHttp.inheritSystem === false || !systemConfig) {
    return cloneDeep(schemaConfigHttp);
  }

  return {
    ...(cloneDeep(systemConfig) || {}),
    ...(cloneDeep(schemaConfigHttp) || {}),
    headers: {
      ...(systemConfig?.headers || {}),
      ...(schemaConfigHttp.headers || {}),
    },
    auth: schemaConfigHttp.auth?.mode === 'inherit' ? cloneDeep(systemConfig?.auth) : cloneDeep(schemaConfigHttp.auth || systemConfig?.auth),
  };
};

export type SchemaDataFieldSnapshot = {
  schema: SchemaForUI;
  config: SchemaDesignerConfig | null;
};

export type SchemaDataSnapshot = {
  pageIndex: number;
  totalPages: number;
  unitIndex: number;
  currentInput: Record<string, string>;
  fields: SchemaDataFieldSnapshot[];
};

export type ResolvedSchemaRequest = {
  schemaId: string;
  schemaName: string;
  source: 'api' | 'prefill';
  requestMode: 'read' | 'submit' | 'sync' | 'options';
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  withCredentials?: boolean;
};

export type FormJsonEnvelope = {
  data: Record<string, unknown>;
  meta: {
    format: 'nested' | 'flat';
    rootKey: string;
    pageIndex: number;
    totalPages: number;
    unitIndex: number;
    schemaCount: number;
    generatedAt: number;
  };
};

export type SchemaDataRuntimeAdapter = {
  readPersistedValue: (storageKey: string) => string | null;
  writePersistedValue: (storageKey: string, value: string) => void;
  resolveRequest: (field: SchemaDataFieldSnapshot, snapshot: SchemaDataSnapshot) => ResolvedSchemaRequest | null;
  executeRequest: (request: ResolvedSchemaRequest) => Promise<unknown>;
  mapResponseToValues: (
    response: unknown,
    field: SchemaDataFieldSnapshot,
    request: ResolvedSchemaRequest,
    snapshot: SchemaDataSnapshot,
  ) => Record<string, string>;
  buildFormJson: (snapshot: SchemaDataSnapshot) => FormJsonEnvelope | null;
};

type RuntimeAdapterArgs = {
  engine?: DesignerEngine;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  fetchImpl?: typeof fetch;
  now?: () => number;
};

const toBase64 = (value: string): string => {
  if (typeof globalThis.btoa === 'function') return globalThis.btoa(value);
  if (typeof Buffer !== 'undefined') return Buffer.from(value, 'utf-8').toString('base64');
  return value;
};

const safeRecordPathParts = (path: string): string[] =>
  String(path || '')
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean);

const getByPath = (target: unknown, path: string): unknown => {
  const parts = safeRecordPathParts(path);
  if (parts.length === 0) return undefined;
  return parts.reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[part];
  }, target);
};

const setByPath = (target: Record<string, unknown>, path: string, value: unknown) => {
  const parts = safeRecordPathParts(path);
  if (parts.length === 0) return;
  let cursor: Record<string, unknown> = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    const next = cursor[part];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  });
};

const isEmptyRuntimeValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
};

const buildQueryString = (params?: Record<string, string>): string => {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && `${value}`.length > 0);
  if (entries.length === 0) return '';
  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => searchParams.set(key, String(value)));
  return searchParams.toString();
};

const buildResolvedHeaders = (
  requestHeaders?: Record<string, string>,
  auth?: SchemaHttpAuthConfig,
  systemHeaders?: Record<string, string>,
): Record<string, string> => {
  const headers = {
    ...(systemHeaders || {}),
    ...(requestHeaders || {}),
  };

  if (!auth || auth.mode === 'inherit') return headers;

  const type = auth.type || 'bearer';
  if (type === 'bearer' && auth.token) {
    headers[auth.headerName || 'Authorization'] = auth.headerValue || `Bearer ${auth.token}`;
  } else if (type === 'basic' && (auth.username || auth.password)) {
    headers[auth.headerName || 'Authorization'] = `Basic ${toBase64(`${auth.username || ''}:${auth.password || ''}`)}`;
  } else if (type === 'apiKey' && auth.headerName && (auth.headerValue || auth.token)) {
    headers[auth.headerName] = auth.headerValue || auth.token || '';
  } else if (auth.headerName && (auth.headerValue || auth.token)) {
    headers[auth.headerName] = auth.headerValue || auth.token || '';
  }

  return headers;
};

const buildRequestBodyFromMapping = (input: Record<string, string>, mapping?: Record<string, string>) => {
  if (!mapping || Object.keys(mapping).length === 0) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, value]),
    );
  }

  const body: Record<string, unknown> = {};
  Object.entries(mapping).forEach(([fieldName, path]) => {
    const value = input[fieldName];
    if (value === undefined || value === null || `${value}`.length === 0) return;
    if (!path) {
      body[fieldName] = value;
      return;
    }
    setByPath(body, path, value);
  });
  return body;
};

const buildValuesFromResponse = (
  response: unknown,
  mapping?: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  if (!response || typeof response !== 'object') return result;

  if (mapping && Object.keys(mapping).length > 0) {
    Object.entries(mapping).forEach(([responsePath, fieldName]) => {
      if (!fieldName) return;
      const value = getByPath(response, responsePath);
      if (value === undefined || value === null) return;
      result[fieldName] = String(value);
    });
    return result;
  }

  Object.entries(response as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'object') return;
    result[key] = String(value);
  });
  return result;
};

const resolveRuntimeEndpoint = (
  endpoint?: string,
  baseURL?: string,
  params?: Record<string, string>,
): string | null => {
  const rawEndpoint = String(endpoint || '').trim();
  if (!rawEndpoint) return null;
  const query = buildQueryString(params);
  const url = (() => {
    try {
      if (baseURL) return new URL(rawEndpoint, baseURL);
      if (typeof window !== 'undefined' && window.location?.origin) return new URL(rawEndpoint, window.location.origin);
      return new URL(rawEndpoint);
    } catch {
      return null;
    }
  })();
  if (!url) return null;
  if (query) {
    query.split('&').forEach((pair) => {
      const [key, value = ''] = pair.split('=');
      if (key) url.searchParams.set(decodeURIComponent(key), decodeURIComponent(value));
    });
  }
  return url.toString();
};

const isFormEnabled = (config?: SchemaDesignerConfig | null): boolean => Boolean(config?.form?.enabled && config?.form?.collect !== false);

export const createSchemaDataRuntimeAdapter = ({
  engine,
  storage,
  fetchImpl,
  now = () => Date.now(),
}: RuntimeAdapterArgs = {}): SchemaDataRuntimeAdapter => {
  const safeStorage =
    storage ||
    (typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        });

  const executeRequest = async (request: ResolvedSchemaRequest): Promise<unknown> => {
    const fetchFn = fetchImpl || (typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined);
    if (!fetchFn) {
      throw new Error('[@sisad-pdfme/ui] No fetch implementation available for schema runtime requests.');
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = typeof request.timeoutMs === 'number' && request.timeoutMs > 0 ? request.timeoutMs : undefined;
    const setTimeoutFn = typeof globalThis.setTimeout === 'function' ? globalThis.setTimeout.bind(globalThis) : undefined;
    const clearTimeoutFn =
      typeof globalThis.clearTimeout === 'function' ? globalThis.clearTimeout.bind(globalThis) : undefined;
    const timer = timeout && controller && setTimeoutFn ? setTimeoutFn(() => controller.abort(), timeout) : null;

    try {
      const response = await fetchFn(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        credentials: request.withCredentials ? 'include' : 'same-origin',
        signal: controller?.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      return response.text();
    } finally {
      if (timer && clearTimeoutFn) clearTimeoutFn(timer);
    }
  };

  return {
    readPersistedValue(storageKey) {
      try {
        return safeStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    writePersistedValue(storageKey, value) {
      try {
        safeStorage.setItem(storageKey, value);
      } catch {
        // Ignore storage failures to keep the editor responsive.
      }
    },
    resolveRequest(field, snapshot) {
      const config = field.config;
      const apiConfig = config?.api;
      const prefillConfig = config?.prefill;
      const source = apiConfig?.enabled ? 'api' : prefillConfig?.enabled && prefillConfig.strategy === 'api' ? 'prefill' : null;
      if (!source) return null;

      const requestMode = source === 'api' ? apiConfig?.requestMode || 'read' : 'read';
      const requestConfig = source === 'api' ? apiConfig : undefined;
      const httpConfig = resolveDesignerHttpClientConfig(config, engine);
      const endpoint =
        (source === 'api' ? requestConfig?.endpoint : prefillConfig?.endpoint) ||
        requestConfig?.endpoint ||
        prefillConfig?.endpoint;
      const url = resolveRuntimeEndpoint(endpoint, httpConfig?.baseURL, requestConfig?.params || undefined);
      if (!url) return null;

      const headers = buildResolvedHeaders(
        {
          ...(httpConfig?.headers || {}),
          ...(requestConfig?.headers || {}),
          ...(source === 'prefill' ? (prefillConfig?.headers || {}) : {}),
        },
        httpConfig?.auth,
        undefined,
      );

      const method = (requestConfig?.method || prefillConfig?.method || (requestMode === 'submit' ? 'POST' : 'GET')) as
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'PATCH'
        | 'DELETE';
      const body =
        method === 'GET' || method === 'DELETE'
          ? undefined
          : buildRequestBodyFromMapping(snapshot.currentInput, requestConfig?.requestMapping || prefillConfig?.mapping);

      return {
        schemaId: field.schema.id,
        schemaName: field.schema.name,
        source,
        requestMode,
        method,
        url,
        headers,
        params: requestConfig?.params || {},
        body,
        timeoutMs: requestConfig?.timeoutMs || httpConfig?.timeoutMs,
        withCredentials: Boolean(httpConfig?.withCredentials),
      };
    },
    executeRequest,
    mapResponseToValues(response, field, request) {
      const config = field.config;
      const responseMapping = config?.api?.responseMapping || config?.prefill?.mapping;
      return buildValuesFromResponse(response, responseMapping && Object.keys(responseMapping).length > 0 ? responseMapping : undefined);
    },
    buildFormJson(snapshot) {
      const activeFields = snapshot.fields.filter(({ config }) => isFormEnabled(config));
      if (activeFields.length === 0) return null;

      const referenceConfig = activeFields.find(({ config }) => config?.form)?.config?.form || {};
      const format = referenceConfig.format || 'nested';
      const rootKey = (referenceConfig.rootKey || 'formData').trim() || 'formData';
      const includeEmpty = Boolean(referenceConfig.includeEmpty);
      const includeHidden = Boolean(referenceConfig.includeHidden);
      const includeMeta = Boolean(referenceConfig.includeMeta);

      const data: Record<string, unknown> = {};
      const nestedRoot: Record<string, unknown> = {};

      activeFields.forEach(({ schema, config }) => {
        const fieldConfig = config?.form;
        if (!fieldConfig) return;
        if (!fieldConfig.collect) return;

        const hidden = Boolean((schema as SchemaForUI & { hidden?: boolean }).hidden);
        if (hidden && !includeHidden) return;

        const value = snapshot.currentInput[schema.name] ?? schema.content ?? '';
        if (!includeEmpty && isEmptyRuntimeValue(value)) return;

        if (format === 'flat') {
          data[schema.name] = value;
          return;
        }

        setByPath(nestedRoot, schema.name, value);
      });

      if (format === 'nested') {
        data[rootKey] = nestedRoot;
      }

      if (includeMeta) {
        data._meta = {
          pageIndex: snapshot.pageIndex,
          totalPages: snapshot.totalPages,
          unitIndex: snapshot.unitIndex,
          schemaCount: activeFields.length,
          generatedAt: now(),
        };
      }

      return {
        data,
        meta: {
          format,
          rootKey,
          pageIndex: snapshot.pageIndex,
          totalPages: snapshot.totalPages,
          unitIndex: snapshot.unitIndex,
          schemaCount: activeFields.length,
          generatedAt: now(),
        },
      };
    },
  };
};

export const attachSchemaIdentity = (
  schema: SchemaForUI,
  context: SchemaCreationContext,
  engine?: DesignerEngine,
): SchemaForUI => {
  const schemaEngine = engine?.schema;
  const shouldAttach = schemaEngine?.autoAttachIdentity !== false;
  if (!shouldAttach) return schema;

  const identity = schemaEngine?.identityFactory
    ? schemaEngine.identityFactory(schema, context)
    : {
        id: schema.id,
        key: schema.name,
        namespace: 'designer',
        version: '1',
        tags: [schema.type],
      };

  return mergeSchemaDesignerConfig(schema, { identity }, engine);
};

export const applySchemaCreationHook = (
  schema: SchemaForUI,
  context: SchemaCreationContext,
  engine?: DesignerEngine,
): SchemaForUI => {
  const hook = engine?.schema?.onCreate;
  if (!hook) return schema;
  return hook(schema, context);
};

export class DesignerEngineBuilder {
  private engine: DesignerEngine;

  constructor(seed: DesignerEngine = {}) {
    this.engine = cloneDesignerEngine(seed);
  }

  withLeftSidebar(renderer: React.ComponentType<LeftSidebarProps>) {
    this.engine.renderers = { ...(this.engine.renderers || {}), leftSidebar: renderer };
    return this;
  }

  withRightSidebar(renderer: React.ComponentType<RightSidebarProps>) {
    this.engine.renderers = { ...(this.engine.renderers || {}), rightSidebar: renderer };
    return this;
  }

  withLeftSidebarProps(left: LeftSidebarEngineProps) {
    this.engine.sidebars = {
      ...(this.engine.sidebars || {}),
      left: { ...(this.engine.sidebars?.left || {}), ...(left || {}) },
    };
    return this;
  }

  withRightSidebarProps(right: RightSidebarEngineProps) {
    this.engine.sidebars = {
      ...(this.engine.sidebars || {}),
      right: { ...(this.engine.sidebars?.right || {}), ...(right || {}) },
    };
    return this;
  }

  withCanvasFeatureToggles(featureToggles: CanvasFeatureToggles) {
    this.engine.canvas = { ...(this.engine.canvas || {}), featureToggles };
    return this;
  }

  withCanvasStyleOverrides(styleOverrides: CanvasStyleOverrides) {
    this.engine.canvas = { ...(this.engine.canvas || {}), styleOverrides };
    return this;
  }

  withCanvasClassNames(classNames: CanvasClassNames) {
    this.engine.canvas = { ...(this.engine.canvas || {}), classNames };
    return this;
  }

  withCanvasComponents(components: CanvasComponentSlots) {
    this.engine.canvas = { ...(this.engine.canvas || {}), components };
    return this;
  }

  withCanvasUseDefaultStyles(useDefaultStyles: boolean) {
    this.engine.canvas = { ...(this.engine.canvas || {}), useDefaultStyles };
    return this;
  }

  withHttpAxiosConfig(axios: SchemaHttpClientConfig) {
    this.engine.http = {
      ...(this.engine.http || {}),
      axios: mergeHttpClientConfig(this.engine.http?.axios, axios),
    };
    return this;
  }

  withSchemaConfigStorageKey(configStorageKey: string) {
    this.engine.schema = { ...(this.engine.schema || {}), configStorageKey };
    return this;
  }

  withSchemaIdentityFactory(identityFactory: SchemaIdentityFactory) {
    this.engine.schema = { ...(this.engine.schema || {}), identityFactory };
    return this;
  }

  withSchemaCreationHook(onCreate: SchemaCreationHook) {
    this.engine.schema = { ...(this.engine.schema || {}), onCreate };
    return this;
  }

  withAutoAttachIdentity(autoAttachIdentity: boolean) {
    this.engine.schema = { ...(this.engine.schema || {}), autoAttachIdentity };
    return this;
  }

  withCollaboration(collaboration: CollaborationSyncConfig) {
    this.engine.collaboration = {
      ...(this.engine.collaboration || {}),
      ...(collaboration || {}),
      recipientOptions: normalizeCollaborationRecipients(
        collaboration?.recipientOptions || collaboration?.users || this.engine.collaboration?.recipientOptions,
      ),
      users: normalizeCollaborationRecipients(collaboration?.users || this.engine.collaboration?.users),
    };
    return this;
  }

  build(): DesignerEngine {
    return cloneDesignerEngine(this.engine);
  }

  buildOptions<T extends UIOptions | Record<string, unknown>>(options?: T): T & { designerEngine: DesignerEngine } {
    return {
      ...(options || ({} as T)),
      designerEngine: this.build(),
    };
  }
}
