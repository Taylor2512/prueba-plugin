import type { Plugin, UIRenderProps } from '@sisad-pdfme/common';
import { PenLine } from 'lucide-react';
import image from '../graphics/image.js';
import { isEditable } from '../utils.js';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { applyFieldChrome } from '../shared/fieldChrome.js';
import type { SisadSchemaBase } from '../shared/schemaTypes.js';
import { propPanel } from './propPanel.js';
import { getSignatureProvider, resolveSignatureProviderSource } from './providerRegistry.js';
import { normalizeSignatureSchema } from './types.js';
import type { SignatureSchema } from './types.js';
import { applyCenteredImageFileInputStyle, createImageFileInput } from '../shared/imageFileInput.js';

const buildSignaturePlaceholder = (schema: SignatureSchema) => {
  const modeLabel = {
    draw: 'Draw',
    image: 'Image',
    p12: 'P12',
    provider: 'Provider',
  }[schema.signatureMode || 'draw'];
  const placeholderText = String(schema.placeholderText || 'Firmar aqui').trim() || 'Firmar aqui';
  const strokeColor = String(schema.strokeColor || '#8A5A00');
  const borderColor = String(schema.borderColor || '#D6B46B');
  const backgroundColor = String(schema.backgroundColor || '#FFF9ED');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 180" preserveAspectRatio="none">
      <rect x="6" y="6" width="448" height="168" rx="16" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="6" stroke-dasharray="18 12" />
      <path d="M94 118c24-8 49-49 72-49 17 0 22 21 35 21 17 0 25-34 44-34 18 0 22 30 42 30 13 0 19-16 33-16 10 0 18 6 30 18" fill="none" stroke="${strokeColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="90" y1="136" x2="370" y2="136" stroke="${borderColor}" stroke-width="5" />
      <text x="52" y="36" text-anchor="start" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="${borderColor}">${modeLabel}</text>
      <text x="230" y="158" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${strokeColor}">${placeholderText}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const fullSize = { width: '100%', height: '100%' };

const renderPreviewImage = (rootElement: HTMLDivElement, value: string) => {
  const img = document.createElement('img');
  Object.assign(img.style, {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  });
  img.src = value;
  rootElement.appendChild(img);
};

const signatureSchema: Plugin<SignatureSchema> = createSchemaPlugin<SignatureSchema>({
  pdf: (arg) => {
    if (!arg.value) return;
    return image.pdf(arg);
  },
  ui: (arg: UIRenderProps<SignatureSchema>) => {
    if (!arg.rootElement) return;

    const providerSource = resolveSignatureProviderSource((arg.options as { designerEngine?: unknown } | undefined)?.designerEngine);
    const provider = getSignatureProvider(arg.schema.signatureProviderKey || arg.schema.signatureProvider, providerSource);
    const schema = normalizeSignatureSchema(arg.schema, provider?.capabilities);
    const nextPlaceholder = arg.value ? arg.placeholder : buildSignaturePlaceholder(schema);

    const container = document.createElement('div');
    Object.assign(container.style, {
      ...fullSize,
      position: 'relative',
      backgroundImage: arg.value ? 'none' : `url(${nextPlaceholder})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
    });
    // Shared field chrome (signing-based family) so the signature placeholder
    // gets the same border/focus/selected/readonly/required visual state as
    // every other schema. CSS-driven via data attributes; no geometry change.
    applyFieldChrome(container, {
      schema: schema as unknown as SisadSchemaBase,
      family: 'signing-based',
      renderMode: arg.mode,
    });

    arg.rootElement.appendChild(container);

    if (arg.value) {
      renderPreviewImage(container, arg.value);
    }

    const { rootElement, mode, onChange, stopEditing } = arg;
    const editable = isEditable(mode, schema);

    if (!editable || !rootElement) return;

    const capabilities = schema.signatureCapabilities || {};

    if (arg.value && capabilities.allowClear) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'x';
      Object.assign(removeBtn.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '3',
        height: '24px',
        width: '24px',
        border: '1px solid #767676',
        background: '#f2f2f2',
        borderRadius: '2px',
        cursor: 'pointer',
      });
      removeBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (onChange) onChange([{ key: 'content', value: '' }]);
      };
      container.appendChild(removeBtn);
    }

    if (!arg.value && schema.signatureMode === 'image' && capabilities.allowUploadImage) {
      const label = document.createElement('label');
      Object.assign(label.style, {
        ...fullSize,
        display: 'flex',
        position: 'absolute',
        inset: '0',
        backgroundColor: 'rgba(22,119,255,0.18)',
        cursor: 'pointer',
      });
      const input = createImageFileInput({
        onValue: (result) => onChange?.([{ key: 'content', value: result }]),
        onBlur: stopEditing,
      });
      applyCenteredImageFileInputStyle(input);
      label.appendChild(input);
      container.appendChild(label);
    }

    // small draw button overlay
    if (schema.signatureMode === 'draw' && capabilities.allowDraw) {
      const controls = document.createElement('div');
      controls.style.position = 'absolute';
      controls.style.right = '6px';
      controls.style.bottom = '6px';
      controls.style.zIndex = '2';

      const drawBtn = document.createElement('button');
      drawBtn.type = 'button';
      drawBtn.textContent = 'Dibujar';
      drawBtn.style.cursor = 'pointer';
      drawBtn.style.padding = '6px 8px';
      drawBtn.style.fontSize = '12px';
      drawBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPad();
      });

      controls.appendChild(drawBtn);
      rootElement.appendChild(controls);
    }

    if (!arg.value && (schema.signatureMode === 'provider' || schema.signatureMode === 'p12')) {
      const info = document.createElement('div');
      info.textContent =
        schema.signatureMode === 'provider'
          ? `Proveedor: ${provider?.label || 'sin configurar'}`
          : 'Firma P12 configurada';
      Object.assign(info.style, {
        position: 'absolute',
        left: '8px',
        bottom: '8px',
        fontSize: '12px',
        color: '#475467',
        background: 'rgba(255,255,255,0.85)',
        padding: '4px 6px',
        borderRadius: '6px',
      });
      container.appendChild(info);
    }

    function openPad() {
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
      });

      const panel = document.createElement('div');
      Object.assign(panel.style, {
        background: '#fff',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        maxWidth: '90%',
        maxHeight: '90%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      });

      const canvas = document.createElement('canvas');
      // Default canvas size; scale as needed
      canvas.width = 800;
      canvas.height = 300;
      canvas.style.width = '800px';
      canvas.style.height = '300px';
      canvas.style.border = '1px solid #ddd';
      panel.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = String(schema.strokeColor || '#000');
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
      }

      let drawing = false;
      let lastX = 0;
      let lastY = 0;

      canvas.addEventListener('pointerdown', (ev) => {
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = ev.clientX - rect.left;
        lastY = ev.clientY - rect.top;
      });
      canvas.addEventListener('pointermove', (ev) => {
        if (!drawing || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      });
      const stop = () => (drawing = false);
      canvas.addEventListener('pointerup', stop);
      canvas.addEventListener('pointerleave', stop);

      const buttons = document.createElement('div');
      buttons.style.display = 'flex';
      buttons.style.justifyContent = 'flex-end';
      buttons.style.gap = '8px';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Limpiar';
      clearBtn.addEventListener('click', () => {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      });

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.textContent = 'Guardar';
      saveBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL('image/png');
        if (onChange) onChange([{ key: 'content', value: dataUrl }]);
        document.body.removeChild(overlay);
        if (stopEditing) stopEditing();
      });

      buttons.appendChild(cancelBtn);
      buttons.appendChild(clearBtn);
      buttons.appendChild(saveBtn);
      panel.appendChild(buttons);

      overlay.appendChild(panel);
      document.body.appendChild(overlay);
    }
  },
  propPanel,
  icon: renderLucideIcon(PenLine),
}, {
  key: 'signature',
  type: 'signature',
  label: 'Firma',
  category: 'Firma',
  tags: ['signature', 'firma', 'sign', 'image'],
  capabilities: ['designer', 'form', 'viewer', 'content'],
});

export default signatureSchema;