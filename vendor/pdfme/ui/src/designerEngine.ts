import { cloneDeep, Schema, SchemaForUI, UIOptions } from '@pdfme/common';
import type React from 'react';
import type { LeftSidebarProps } from './components/Designer/LeftSidebar.js';
import type { RightSidebarProps } from './components/Designer/RightSidebar/index.js';
import type {
  CanvasClassNames,
  CanvasComponentSlots,
  CanvasFeatureToggles,
  CanvasStyleOverrides,
} from './components/Designer/Canvas/index.js';

export const DEFAULT_SCHEMA_CONFIG_STORAGE_KEY = '__designer';

export type SchemaIdentity = {
  id?: string;
  key?: string;
  namespace?: string;
  version?: string;
  tags?: string[];
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
  integrations?: SchemaIntegrationConfig[];
  metadata?: Record<string, unknown>;
};

export type SchemaCreationContext = {
  pageIndex: number;
  totalPages: number;
  timestamp: number;
};

export type SchemaCreationHook = (schema: SchemaForUI, context: SchemaCreationContext) => SchemaForUI;
export type SchemaIdentityFactory = (schema: SchemaForUI, context: SchemaCreationContext) => SchemaIdentity;

export type DesignerEngine = {
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
  schema: engine.schema
    ? {
        configStorageKey: engine.schema.configStorageKey,
        autoAttachIdentity: engine.schema.autoAttachIdentity,
        identityFactory: engine.schema.identityFactory,
        onCreate: engine.schema.onCreate,
      }
    : undefined,
});

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

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
      metadata: { ...(current.metadata || {}), ...(patch.metadata || {}) },
      integrations: patch.integrations || current.integrations,
    },
    engine,
  );
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
