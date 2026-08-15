import type { PDFImage } from 'pdf-lib';
import type { Plugin } from '@sisad-pdfme/common';
import type { Schema } from '@sisad-pdfme/common';
import type * as CSS from 'csstype';
import { px2mm } from '@sisad-pdfme/common';
import { Image } from 'lucide-react';
import {
  convertForPdfLayoutProps,
  addAlphaToHex,
  isEditable,
  createSvgStr,
} from '@sisad-pdfme/schemas/utils';
import { DEFAULT_OPACITY } from '@sisad-pdfme/schemas/constants';
import { getImageDimension } from '@sisad-pdfme/schemas/graphics/imagehelper';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { basicsFields } from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { applyCenteredImageFileInputStyle, createImageFileInput } from '@sisad-pdfme/schemas/shared/imageFileInput';
import { mixHexColor, resolveSchemaOwnerTone } from '@sisad-pdfme/schemas/shared/fieldChrome';

const getImageCacheKey = (schema: Schema, input: string) => `${schema.type}${input}`;
const fullSize = { width: '100%', height: '100%' };
const defaultValue =
  'data:image/png;base64,[LONG_BASE64_OR_TOKEN_REDACTED length=3760]';

type ImageSchema = Schema;

const imageSchema: Plugin<ImageSchema> = {
  pdf: async (arg) => {
    const { value, schema, pdfDoc, page, _cache } = arg;
    if (!value) return;

    const inputImageCacheKey = getImageCacheKey(schema, value);
    let image = _cache.get(inputImageCacheKey) as PDFImage;
    if (!image) {
      const isPng = value.startsWith('data:image/png;');
      image = await (isPng ? pdfDoc.embedPng(value) : pdfDoc.embedJpg(value));
      _cache.set(inputImageCacheKey, image);
    }

    const _schema = { ...schema, position: { ...schema.position } };
    const dimension = getImageDimension(value);
    const imageWidth = px2mm(dimension.width);
    const imageHeight = px2mm(dimension.height);
    const boxWidth = _schema.width;
    const boxHeight = _schema.height;

    const imageRatio = imageWidth / imageHeight;
    const boxRatio = boxWidth / boxHeight;

    if (imageRatio > boxRatio) {
      _schema.width = boxWidth;
      _schema.height = boxWidth / imageRatio;
      _schema.position.y += (boxHeight - _schema.height) / 2;
    } else {
      _schema.width = boxHeight * imageRatio;
      _schema.height = boxHeight;
      _schema.position.x += (boxWidth - _schema.width) / 2;
    }

    const pageHeight = page.getHeight();
    const lProps = convertForPdfLayoutProps({ schema: _schema, pageHeight });
    const { width, height, rotate, position, opacity } = lProps;
    const { x, y } = position;

    const drawOptions = { x, y, rotate, width, height, opacity };
    page.drawImage(image, drawOptions);
  },
  ui: (arg) => {
    const {
      value,
      rootElement,
      mode,
      onChange,
      stopEditing,
      tabIndex,
      placeholder,
      theme,
      schema,
    } = arg;
    /*
     * Misma regla que el resto de schemas: en formulario se puede editar salvo
     * que el campo sea de solo lectura (`isEditable`).
     *
     * Antes se exigía además un flag `uploadable` que ningún sitio podía
     * activar —no estaba en el inspector ni en el `defaultSchema`—, así que
     * ninguna imagen llegaba a ser rellenable en modo formulario. Una imagen
     * decorativa se marca `readOnly`, igual que cualquier otro campo fijo.
     */
    const editable = isEditable(mode, schema);
    const isDefault = value === defaultValue;
    const showCompactPlaceholder = !value || isDefault;

    const container = document.createElement('div');
    const backgroundStyle = placeholder ? `url(${placeholder})` : 'none';
    const containerStyle: CSS.Properties = {
      ...fullSize,
      position: 'relative',
      backgroundImage: value ? 'none' : backgroundStyle,
      backgroundSize: `contain`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
    Object.assign(container.style, containerStyle);
    container.addEventListener('click', (e) => {
      if (editable) {
        e.stopPropagation();
      }
    });
    rootElement.appendChild(container);

    if (showCompactPlaceholder) {
      // El marco de "imagen vacía" es chrome, no contenido: debe identificar al
      // destinatario igual que el resto de campos. La imagen real sigue sin
      // recolorearse (política `content-preserved`).
      const tone = resolveSchemaOwnerTone(schema);
      const placeholderNode = document.createElement('div');
      const placeholderNodeStyle: CSS.Properties = {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        border: `1px solid ${mixHexColor(tone, 40)}`,
        borderRadius: '10px',
        background: `linear-gradient(180deg, rgba(255,255,255,0.97), ${mixHexColor(tone, 10)})`,
        color: mixHexColor(tone, 72, '#000000'),
        pointerEvents: 'none',
      };
      Object.assign(placeholderNode.style, placeholderNodeStyle);

      const placeholderIcon = document.createElement('div');
      Object.assign(placeholderIcon.style, {
        width: '26px',
        height: '26px',
        backgroundImage: `url(${createSvgStr(Image)})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        opacity: '0.82',
      } as CSS.Properties);
      placeholderNode.appendChild(placeholderIcon);

      const placeholderLabel = document.createElement('div');
      placeholderLabel.textContent = 'Imagen';
      Object.assign(placeholderLabel.style, {
        fontSize: '11px',
        fontWeight: '600',
        lineHeight: '1',
        letterSpacing: '0.01em',
      } as CSS.Properties);
      placeholderNode.appendChild(placeholderLabel);

      container.appendChild(placeholderNode);
    } else if (value) {
      const img = document.createElement('img');
      const imgStyle: CSS.Properties = {
        height: '100%',
        width: '100%',
        borderRadius: 0,
        objectFit: 'contain',
      };
      Object.assign(img.style, imgStyle);
      img.src = value;
      container.appendChild(img);
    }

    // remove button
    if (value && !isDefault && editable) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'x';
      const buttonStyle: CSS.Properties = {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333',
        background: '#f2f2f2',
        borderRadius: '2px',
        border: '1px solid #767676',
        cursor: 'pointer',
        height: '24px',
        width: '24px',
      };
      Object.assign(button.style, buttonStyle);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (onChange) onChange([{ key: 'content', value: '' }]);
      });
      container.appendChild(button);
    }

    // file input
    if ((!value || isDefault) && editable) {
      const label = document.createElement('label');
      const labelStyle: CSS.Properties = {
        ...fullSize,
        display: editable ? 'flex' : 'none',
        position: 'absolute',
        top: 0,
        backgroundColor: editable || value ? addAlphaToHex(theme.colorPrimaryBg, 30) : 'none',
        cursor: 'pointer',
      };
      Object.assign(label.style, labelStyle);
      container.appendChild(label);
      const input = createImageFileInput({
        tabIndex: tabIndex || 0,
        onValue: (result) => onChange?.([{ key: 'content', value: result }]),
        onBlur: stopEditing,
      });
      applyCenteredImageFileInputStyle(input);
      label.appendChild(input);
    }
  },
  propPanel: {
    /*
     * Una imagen puede ser campo de carga o decoración fija. La distinción usa
     * el mismo interruptor que el resto de campos —"Solo lectura"— en vez de un
     * flag propio: el runtime ya lo entiende vía `isEditable` y el motor de
     * completion no necesita una regla especial para imágenes.
     */
    schema: {
      readOnly: basicsFields().readOnly,
    },
    inspector: createSchemaInspectorConfig('media'),
    defaultSchema: {
      name: '',
      type: 'image',
      content: defaultValue,
      position: { x: 0, y: 0 },
      width: 40,
      height: 40,
      // If the value of "rotate" is set to undefined or not set at all, rotation will be disabled in the UI.
      // Check this document: https://sisad-pdfme.com//docs/custom-schemas#learning-how-to-create-from-pdfmeschemas-code
      rotate: 0,
      opacity: DEFAULT_OPACITY,
    },
  },
  icon: createSvgStr(Image),
};

export default imageSchema;
