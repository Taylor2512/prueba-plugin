import type { DesignerEngine } from '../../ui/designerEngine.js';
import { resolveActiveRecipient } from '../../ui/collaborationContext.js';
import type { PropPanel, PropPanelSchema, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { SignatureSchema, SignatureMode } from './types.js';
import { DEFAULT_OPACITY, HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { markInspectorInteractive, stopInspectorPointerEvent } from '../../ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards.js';
import {
  getAvailableSignatureProviders,
  getSignatureProvider,
  resolveSignatureProviderSource,
  sanitizeSignatureProviderConfig,
  validateSignatureProviderConfig,
  type SignatureProviderDefinition,
} from './providerRegistry.js';
import {
  SIGNATURE_MODE_OPTIONS,
  createModeAwareCapabilities,
  createModeAwareDisplay,
  normalizeSignatureSchema,
  sanitizeSignatureMetadata,
} from './types.js';

const buildColorField = (title: string): PropPanelSchema => ({
  title,
  type: 'string',
  widget: 'color',
  props: {
    disabledAlpha: true,
  },
  rules: [{ pattern: HEX_COLOR_PATTERN, message: 'Usa un color hexadecimal valido.' }],
});

const buildSwitchField = (title: string, hidden = false): PropPanelSchema => ({
  title,
  type: 'boolean',
  widget: 'switch',
  span: 12,
  hidden,
});

const resolveDesignerEngine = (options: unknown): DesignerEngine | undefined => {
  const candidate = options as { designerEngine?: DesignerEngine } | undefined;
  return candidate?.designerEngine;
};

const getProviderSourceFromOptions = (options: unknown) =>
  resolveSignatureProviderSource(resolveDesignerEngine(options));

const createSchemaChanges = (
  schemaId: string | undefined,
  patch: Record<string, unknown>,
) => Object.entries(patch).map(([key, value]) => ({ key, value, schemaId }));

const getBlockedOwnerRole = (activeSchema: SignatureSchema, options: unknown) => {
  const engine = resolveDesignerEngine(options);
  const collaboration = resolveActiveRecipient(engine?.collaboration);
  return collaboration.recipientOptions.find((entry) => entry.id === activeSchema.ownerRecipientId)?.role || null;
};

const buildModePatch = (schema: SignatureSchema, mode: SignatureMode, options: unknown) => {
  const providerSource = getProviderSourceFromOptions(options);
  const currentProvider = getSignatureProvider(schema.signatureProviderKey, providerSource);
  const externalProviders = getAvailableSignatureProviders(providerSource);
  const nextProviderKey =
    mode === 'provider'
      ? currentProvider?.internal !== true
        ? currentProvider?.key
        : externalProviders[0]?.key
      : null;
  const nextProvider = mode === 'provider' ? getSignatureProvider(nextProviderKey, providerSource) : null;

  return {
    signatureMode: mode,
    signatureType: mode,
    signatureProvider: undefined,
    signatureProviderKey: mode === 'provider' ? nextProviderKey || undefined : null,
    signatureProviderConfig:
      mode === 'provider' && nextProvider
        ? sanitizeSignatureProviderConfig(nextProvider.key, nextProvider.defaultConfig || {}, providerSource)
        : {},
    signatureMetadata: sanitizeSignatureMetadata(schema.signatureMetadata, mode),
    signatureCapabilities: createModeAwareCapabilities(mode, schema.signatureCapabilities),
    signatureDisplay: createModeAwareDisplay(mode, schema.signatureDisplay, nextProvider?.capabilities),
  };
};

const prepareInteractiveSignatureWidget = (rootElement: HTMLElement) => {
  rootElement.style.width = '100%';
  markInspectorInteractive(rootElement);
};

const SignatureModeWidget = ({ rootElement, activeSchema, changeSchemas, options }: PropPanelWidgetProps) => {
  const resolvedSchema = normalizeSignatureSchema(activeSchema as SignatureSchema);
  const ownerRole = String(getBlockedOwnerRole(activeSchema as SignatureSchema, options) || '').toLowerCase();
  const isBlocked = ownerRole === 'viewer' || ownerRole === 'reviewer';

  prepareInteractiveSignatureWidget(rootElement);

  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '6px';

  const label = document.createElement('label');
  label.textContent = 'Tipo de firma';
  label.style.fontWeight = '600';

  const select = document.createElement('select');
  select.style.padding = '8px';
  select.value = resolvedSchema.signatureMode || 'draw';
  select.disabled = isBlocked;
  select.addEventListener('pointerdown', stopInspectorPointerEvent);
  select.addEventListener('mousedown', stopInspectorPointerEvent);
  select.addEventListener('click', stopInspectorPointerEvent);

  SIGNATURE_MODE_OPTIONS.forEach((option) => {
    const node = document.createElement('option');
    node.value = option.value;
    node.textContent = option.label;
    select.appendChild(node);
  });

  select.onchange = () => {
    const nextMode = select.value as SignatureMode;
    changeSchemas(createSchemaChanges(activeSchema.id, buildModePatch(resolvedSchema, nextMode, options)));
  };

  wrapper.appendChild(label);
  wrapper.appendChild(select);

  if (isBlocked) {
    const note = document.createElement('div');
    note.textContent = 'El owner actual no tiene permisos de firma en este flujo.';
    note.style.fontSize = '12px';
    note.style.color = '#b42318';
    wrapper.appendChild(note);
  }

  rootElement.appendChild(wrapper);
};

const SignatureProviderStatusWidget = ({ rootElement, activeSchema }: PropPanelWidgetProps) => {
  const resolvedSchema = normalizeSignatureSchema(activeSchema as SignatureSchema);
  const providerStatus = resolvedSchema.signatureProviderStatus || 'pending';
  const providerDisplay = resolvedSchema.signatureProviderDisplay || {};
  const badgeLabel = providerDisplay.badge || providerDisplay.label || 'Proveedor externo';
  const tone = providerDisplay.tone || (providerStatus === 'completed' ? 'success' : providerStatus === 'failed' ? 'danger' : 'neutral');
  const isPositive = tone === 'success' || providerStatus === 'completed' || providerStatus === 'ready';

  const wrapper = document.createElement('div');
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.padding = '8px 10px';
  wrapper.style.borderRadius = '999px';
  wrapper.style.background = isPositive ? '#ecfdf3' : '#f8fafc';
  wrapper.style.color = isPositive ? '#027a48' : '#475467';
  wrapper.style.border = `1px solid ${isPositive ? '#abefc6' : '#d0d5dd'}`;
  wrapper.textContent = `${badgeLabel} · ${providerStatus}`;

  prepareInteractiveSignatureWidget(rootElement);
  rootElement.appendChild(wrapper);
};

const SignatureProviderWidget = ({ rootElement, activeSchema, changeSchemas, options }: PropPanelWidgetProps) => {
  const resolvedSchema = normalizeSignatureSchema(activeSchema as SignatureSchema);
  const providerSource = getProviderSourceFromOptions(options);
  const providers = getAvailableSignatureProviders(providerSource);

  prepareInteractiveSignatureWidget(rootElement);

  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '6px';

  const label = document.createElement('label');
  label.textContent = 'Proveedor externo';
  label.style.fontWeight = '600';

  const select = document.createElement('select');
  select.style.padding = '8px';
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = providers.length > 0 ? 'Selecciona un proveedor' : 'No hay proveedores configurados';
  select.appendChild(emptyOption);

  providers.forEach((provider) => {
    const option = document.createElement('option');
    option.value = provider.key;
    option.textContent = provider.label;
    select.appendChild(option);
  });
  select.value = String(resolvedSchema.signatureProviderKey || '');
  select.disabled = providers.length === 0;

  select.onchange = () => {
    const nextProviderKey = select.value || undefined;
    const provider = getSignatureProvider(nextProviderKey, providerSource);
    changeSchemas(
      createSchemaChanges(activeSchema.id, {
        signatureProviderKey: nextProviderKey,
        signatureProviderConfig: provider
          ? sanitizeSignatureProviderConfig(provider.key, provider.defaultConfig || {}, providerSource)
          : {},
        signatureDisplay: createModeAwareDisplay('provider', resolvedSchema.signatureDisplay, provider?.capabilities),
        signatureMetadata: sanitizeSignatureMetadata(resolvedSchema.signatureMetadata, 'provider'),
      }),
    );
  };

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  rootElement.appendChild(wrapper);
};

const buildSummaryBadges = (provider: SignatureProviderDefinition) => {
  const badges = [...(provider.badges || [])];
  if (provider.capabilities.supportsWebhook) badges.push('webhook');
  if (provider.capabilities.supportsPolling) badges.push('polling');
  if (provider.capabilities.supportsOtp) badges.push('otp');
  return Array.from(new Set(badges));
};

const SignatureProviderConfigWidget = ({ rootElement, activeSchema, changeSchemas, options }: PropPanelWidgetProps) => {
  const resolvedSchema = normalizeSignatureSchema(activeSchema as SignatureSchema);
  const providerSource = getProviderSourceFromOptions(options);
  const provider = getSignatureProvider(resolvedSchema.signatureProviderKey, providerSource);

  prepareInteractiveSignatureWidget(rootElement);

  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '8px';
  wrapper.style.padding = '10px';
  wrapper.style.border = '1px solid #e5e7eb';
  wrapper.style.borderRadius = '10px';
  wrapper.style.background = '#fff';

  const title = document.createElement('div');
  title.style.fontWeight = '600';
  title.textContent = provider ? provider.label : 'Sin proveedor seleccionado';
  wrapper.appendChild(title);

  const description = document.createElement('div');
  description.style.fontSize = '12px';
  description.style.color = '#475467';
  description.textContent = provider?.description || 'Selecciona un proveedor para configurar el flujo externo.';
  wrapper.appendChild(description);

  if (provider) {
    const badges = document.createElement('div');
    badges.style.display = 'flex';
    badges.style.flexWrap = 'wrap';
    badges.style.gap = '6px';
    buildSummaryBadges(provider).forEach((badge) => {
      const badgeNode = document.createElement('span');
      badgeNode.textContent = badge;
      badgeNode.style.fontSize = '11px';
      badgeNode.style.padding = '2px 8px';
      badgeNode.style.borderRadius = '999px';
      badgeNode.style.background = '#f2f4f7';
      badgeNode.style.color = '#344054';
      badges.appendChild(badgeNode);
    });
    wrapper.appendChild(badges);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Configurar proveedor';
  button.disabled = !provider;
  button.style.padding = '8px 10px';
  button.style.border = '1px solid #d0d5dd';
  button.style.borderRadius = '8px';
  button.style.background = '#ffffff';
  button.style.cursor = provider ? 'pointer' : 'not-allowed';
  button.addEventListener('pointerdown', stopInspectorPointerEvent);
  button.addEventListener('mousedown', stopInspectorPointerEvent);
  button.addEventListener('click', stopInspectorPointerEvent);

  button.onclick = () => {
    if (!provider) return;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999',
    });
    markInspectorInteractive(overlay);
    overlay.addEventListener('pointerdown', stopInspectorPointerEvent);
    overlay.addEventListener('mousedown', stopInspectorPointerEvent);
    overlay.addEventListener('click', stopInspectorPointerEvent);

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      width: 'min(560px, calc(100vw - 32px))',
      maxHeight: 'calc(100vh - 32px)',
      overflow: 'auto',
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      display: 'grid',
      gap: '12px',
    });
    markInspectorInteractive(panel);
    panel.addEventListener('pointerdown', stopInspectorPointerEvent);
    panel.addEventListener('mousedown', stopInspectorPointerEvent);
    panel.addEventListener('click', stopInspectorPointerEvent);

    const header = document.createElement('div');
    header.style.display = 'grid';
    header.style.gap = '4px';
    const headerTitle = document.createElement('div');
    headerTitle.textContent = provider.label;
    headerTitle.style.fontWeight = '700';
    const headerDescription = document.createElement('div');
    headerDescription.textContent = provider.description || 'Configura los parametros del proveedor externo.';
    headerDescription.style.fontSize = '12px';
    headerDescription.style.color = '#475467';
    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    panel.appendChild(header);

    const fieldContainer = document.createElement('div');
    fieldContainer.style.display = 'grid';
    fieldContainer.style.gap = '10px';
    const values = { ...(provider.defaultConfig || {}), ...(resolvedSchema.signatureProviderConfig || {}) } as Record<string, unknown>;
    const inputs = new Map<string, HTMLInputElement | HTMLSelectElement>();

    (provider.configFields || []).forEach((field) => {
      const fieldWrapper = document.createElement('label');
      fieldWrapper.style.display = 'grid';
      fieldWrapper.style.gap = '6px';
      const fieldLabel = document.createElement('span');
      fieldLabel.textContent = field.label;
      fieldLabel.style.fontWeight = '600';
      fieldWrapper.appendChild(fieldLabel);

      let input: HTMLInputElement | HTMLSelectElement;
      if (field.type === 'select') {
        const select = document.createElement('select');
        select.style.padding = '8px';
        (field.options || []).forEach((option) => {
          const optionNode = document.createElement('option');
          optionNode.value = option.value;
          optionNode.textContent = option.label;
          select.appendChild(optionNode);
        });
        select.value = String(values[field.key] || field.options?.[0]?.value || '');
        input = select;
      } else {
        const textInput = document.createElement('input');
        textInput.type = field.type === 'switch' ? 'checkbox' : field.type === 'number' ? 'number' : field.type;
        textInput.placeholder = field.placeholder || '';
        textInput.style.padding = field.type === 'switch' ? '0' : '8px';
        if (field.type === 'switch') {
          textInput.checked = values[field.key] === true;
        } else {
          textInput.value = values[field.key] === undefined || values[field.key] === null ? '' : String(values[field.key]);
        }
        if (field.min !== undefined) textInput.min = String(field.min);
        if (field.max !== undefined) textInput.max = String(field.max);
        if (field.step !== undefined) textInput.step = String(field.step);
        input = textInput;
      }

      inputs.set(field.key, input);
      fieldWrapper.appendChild(input);
      fieldContainer.appendChild(fieldWrapper);
    });

    if ((provider.configFields || []).length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'Este proveedor no expone campos configurables en el inspector.';
      empty.style.fontSize = '12px';
      empty.style.color = '#475467';
      fieldContainer.appendChild(empty);
    }

    panel.appendChild(fieldContainer);

    const errorBox = document.createElement('div');
    errorBox.style.color = '#b42318';
    errorBox.style.fontSize = '12px';
    panel.appendChild(errorBox);

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '8px';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancelar';
    cancel.onclick = () => document.body.removeChild(overlay);

    const save = document.createElement('button');
    save.type = 'button';
    save.textContent = 'Guardar';
    save.onclick = () => {
      const nextConfig: Record<string, unknown> = {};
      inputs.forEach((input, key) => {
        if (input instanceof HTMLInputElement && input.type === 'checkbox') {
          nextConfig[key] = input.checked;
          return;
        }
        if (input instanceof HTMLInputElement && input.type === 'number') {
          nextConfig[key] = input.value === '' ? undefined : Number(input.value);
          return;
        }
        nextConfig[key] = input.value;
      });

      const errors = validateSignatureProviderConfig(provider.key, nextConfig, providerSource);
      if (errors.length > 0) {
        errorBox.textContent = errors.join(' ');
        return;
      }

      changeSchemas(
        createSchemaChanges(activeSchema.id, {
          signatureProviderConfig: sanitizeSignatureProviderConfig(provider.key, nextConfig, providerSource),
          signatureDisplay: createModeAwareDisplay('provider', resolvedSchema.signatureDisplay, provider.capabilities),
        }),
      );
      document.body.removeChild(overlay);
    };

    actions.appendChild(cancel);
    actions.appendChild(save);
    panel.appendChild(actions);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  };

  wrapper.appendChild(button);
  rootElement.appendChild(wrapper);
};

export const propPanel: PropPanel<SignatureSchema> = {
  schema: ({ activeSchema, options }) => {
    const providerSource = getProviderSourceFromOptions(options);
    const currentProvider = getSignatureProvider(
      (activeSchema as SignatureSchema).signatureProviderKey || (activeSchema as SignatureSchema).signatureProvider,
      providerSource,
    );
    const resolvedSchema = normalizeSignatureSchema(activeSchema as SignatureSchema, currentProvider?.capabilities);
    const isProviderMode = resolvedSchema.signatureMode === 'provider';
    const isP12Mode = resolvedSchema.signatureMode === 'p12';
    const isImageMode = resolvedSchema.signatureMode === 'image';
    const isDrawMode = resolvedSchema.signatureMode === 'draw';
    const showVisualStampField = currentProvider?.capabilities.supportsVisibleSignature !== false;
    const showCertificateInfoField = !isProviderMode || currentProvider?.capabilities.supportsCertificateMetadata !== false;
    const showReasonField = !isProviderMode || currentProvider?.capabilities.supportsReason !== false;
    const showLocationField = !isProviderMode || currentProvider?.capabilities.supportsLocation !== false;

    return {
      signatureMode: {
        type: 'void',
        widget: 'SignatureModeWidget',
        bind: false,
        span: 24,
      },
      signatureType: {
        title: 'Tipo de firma',
        type: 'string',
        widget: 'select',
        props: {
          options: SIGNATURE_MODE_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          })),
        },
        hidden: true,
      },
      signatureProviderKey: {
        type: 'void',
        widget: 'SignatureProviderWidget',
        bind: false,
        span: 24,
        hidden: !isProviderMode,
      },
      signatureProviderStatus: {
        type: 'void',
        widget: 'SignatureProviderStatusWidget',
        bind: false,
        span: 24,
        hidden: !isProviderMode,
      },
      signatureProviderDisplay: {
        title: 'Visual del proveedor',
        type: 'object',
        widget: 'card',
        column: 2,
        hidden: !isProviderMode,
        properties: {
          label: {
            title: 'Etiqueta',
            type: 'string',
          },
          badge: {
            title: 'Badge',
            type: 'string',
          },
          tone: {
            title: 'Tono',
            type: 'string',
            widget: 'select',
            props: {
              options: [
                { label: 'Neutral', value: 'neutral' },
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
                { label: 'Danger', value: 'danger' },
              ],
            },
          },
        },
      },
      placeholderText: {
        title: 'Ayuda del campo',
        type: 'string',
        span: 24,
      },
      strokeColor: {
        ...buildColorField('Color del trazo'),
        span: 8,
        hidden: !isDrawMode,
      },
      borderColor: {
        ...buildColorField('Color del borde'),
        span: 8,
      },
      backgroundColor: {
        ...buildColorField('Color de fondo'),
        span: 8,
      },
      signatureCapabilities: {
        title: 'Capacidades',
        type: 'object',
        widget: 'card',
        column: 2,
        properties: {
          allowDraw: buildSwitchField('Permitir dibujar', isProviderMode || isP12Mode || isImageMode),
          allowUploadImage: buildSwitchField('Permitir subir imagen', isProviderMode || isP12Mode || isDrawMode),
          allowP12: buildSwitchField('Permitir P12', isProviderMode || isDrawMode || isImageMode),
          allowExternalProvider: buildSwitchField('Permitir proveedor externo', isDrawMode || isImageMode || isP12Mode),
          allowClear: buildSwitchField('Permitir limpiar'),
          allowReplace: buildSwitchField('Permitir reemplazar'),
          allowPreview: buildSwitchField('Permitir preview'),
        },
      },
      signatureDisplay: {
        title: 'Visualizacion',
        type: 'object',
        widget: 'card',
        column: 2,
        properties: {
          showSignerName: buildSwitchField('Mostrar firmante'),
          showSignedAt: buildSwitchField('Mostrar fecha de firma'),
          showReason: buildSwitchField('Mostrar razon', !showReasonField),
          showLocation: buildSwitchField('Mostrar ubicacion', !showLocationField),
          showCertificateInfo: buildSwitchField('Mostrar certificado', !showCertificateInfoField),
          showVisualStamp: buildSwitchField('Mostrar sello visual', !showVisualStampField),
        },
      },
      signatureProviderConfigAction: {
        type: 'void',
        widget: 'SignatureProviderConfigWidget',
        bind: false,
        span: 24,
        hidden: !isProviderMode,
      },
      signatureMetadata: {
        title: 'Configuracion avanzada',
        type: 'object',
        widget: 'card',
        column: 2,
        properties: {
          digestAlgorithm: {
            title: 'Algoritmo digest',
            type: 'string',
            widget: 'select',
            hidden: !isP12Mode,
            props: {
              options: [
                { label: 'SHA-256', value: 'SHA-256' },
                { label: 'SHA-384', value: 'SHA-384' },
                { label: 'SHA-512', value: 'SHA-512' },
              ],
            },
          },
          certSubject: {
            title: 'Subject certificado',
            type: 'string',
            hidden: !isP12Mode,
          },
          certIssuer: {
            title: 'Issuer certificado',
            type: 'string',
            hidden: !isP12Mode,
          },
          certSerial: {
            title: 'Serial certificado',
            type: 'string',
            hidden: !isP12Mode,
          },
          reason: {
            title: 'Razon de firma',
            type: 'string',
            hidden: !(isP12Mode || (isProviderMode && showReasonField)),
          },
          location: {
            title: 'Ubicacion',
            type: 'string',
            hidden: !(isP12Mode || (isProviderMode && showLocationField)),
          },
          providerStatus: {
            title: 'Estado del proveedor',
            type: 'string',
            hidden: !isProviderMode,
          },
          imageFit: {
            title: 'Ajuste de imagen',
            type: 'string',
            widget: 'select',
            hidden: !isImageMode,
            props: {
              options: [
                { label: 'Contain', value: 'contain' },
                { label: 'Cover', value: 'cover' },
                { label: 'Fill', value: 'fill' },
              ],
            },
          },
          transparentBackground: {
            title: 'Fondo transparente',
            type: 'boolean',
            widget: 'switch',
            hidden: !isImageMode,
          },
          guideText: {
            title: 'Ayuda visual',
            type: 'string',
            hidden: !isDrawMode,
          },
          signedAt: {
            title: 'Fecha firmada',
            type: 'string',
          },
        },
      },
    };
  },
  widgets: {
    SignatureModeWidget,
    SignatureProviderWidget,
    SignatureProviderConfigWidget,
    SignatureProviderStatusWidget,
  },
  inspector: createSchemaInspectorConfig('signature', {
    propertyMap: {
      signatureMode: 'data',
      signatureType: 'data',
      signatureProviderKey: 'data',
      signatureProviderStatus: 'data',
      signatureProviderDisplay: 'data',
      placeholderText: 'data',
      strokeColor: 'style',
      borderColor: 'style',
      backgroundColor: 'style',
      signatureCapabilities: 'data',
      signatureDisplay: 'data',
      signatureProviderConfigAction: 'advanced',
      signatureMetadata: 'advanced',
    },
  }),
  defaultSchema: {
    name: '',
    type: 'signature',
    content: '',
    position: { x: 0, y: 0 },
    width: 46,
    height: 18,
    rotate: 0,
    opacity: DEFAULT_OPACITY,
    placeholderText: 'Firmar aqui',
    signatureMode: 'draw',
    signatureType: 'draw',
    signatureProviderKey: undefined,
    signatureProviderConfig: {},
    signatureProviderStatus: 'pending',
    signatureProviderDisplay: {
      label: 'Proveedor externo',
      badge: 'Pendiente',
      tone: 'neutral',
    },
    signatureMetadata: {
      signedAt: null,
      digestAlgorithm: 'SHA-256',
    },
    signatureCapabilities: {
      allowDraw: true,
      allowUploadImage: true,
      allowP12: true,
      allowExternalProvider: true,
      allowClear: true,
      allowReplace: true,
      allowPreview: true,
    },
    signatureDisplay: {
      showSignerName: true,
      showSignedAt: true,
      showReason: false,
      showLocation: false,
      showCertificateInfo: false,
      showVisualStamp: true,
    },
    strokeColor: '#8A5A00',
    borderColor: '#D6B46B',
    backgroundColor: '#FFF9ED',
  },
};
