import { DESIGNER_CLASSNAME } from "../../constants.js";
import React, { useContext, useMemo } from 'react';
import { Plugin, Schema } from '@sisad-pdfme/common';
import { OptionsContext } from '../../contexts.js';
import { theme } from 'antd';
import DOMPurify from 'dompurify';

interface PluginIconProps {
  plugin: Plugin<Schema>;
  label: string;
  size?: number;
  styles?: React.CSSProperties;
  className?: string;
  useDefaultStyles?: boolean;
  activeRecipientColor?: string | null;
  /** Optional data-testid stamped on the icon root (surface-specific, e.g. left-sidebar-schema-icon). */
  testId?: string;
  'data-schema-type'?: string;
  'data-active-recipient-color'?: string;
}

const SVGIcon = ({ svgString, size, styles, label }: {
  svgString: string;
  size?: number;
  styles?: React.CSSProperties;
  label: string;
}) => {
  const normalizePaintToCurrentColor = (value: string) =>
    value.replace(
      /\b(stroke|fill)="(?!none\b|transparent\b|url\(|currentColor\b)([^"]+)"/gi,
      (_match, attr) => `${attr}="currentColor"`,
    );

  const processedSVG = useMemo(() => {
    // First sanitize the SVG string using DOMPurify with SVG profile.
    const sanitizedSVG = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'g', 'defs', 'title', 'desc', 'metadata'],
      ALLOWED_ATTR: ['class', 'id', 'fill', 'stroke', 'stroke-width', 'viewBox', 'width', 'height', 'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'rx', 'ry', 'transform'],
      FORBID_TAGS: ['script', 'foreignObject', 'use', 'embed', 'iframe', 'object', 'link', 'style'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'href', 'xlink:href', 'src', 'action', 'formaction'],
      KEEP_CONTENT: false
    });

    if (!sanitizedSVG || typeof sanitizedSVG !== 'string') {
      return null;
    }

    const colorAwareSVG = normalizePaintToCurrentColor(sanitizedSVG);

    if (size) {
      return colorAwareSVG.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
        const safeAttrs = String(attrs || '')
          .replace(/\swidth="[^"]*"/i, '')
          .replace(/\sheight="[^"]*"/i, '');
        return `<svg${safeAttrs} width="${size}" height="${size}">`;
      });
    }

    return colorAwareSVG;
  }, [svgString, size]);

  if (!processedSVG) {
    return null;
  }

  return (
    <div
      style={styles}
      dangerouslySetInnerHTML={{ __html: processedSVG }}
    />
  );
};

const PluginIcon = (props: PluginIconProps) => {
  const { plugin, label, size, styles, className, useDefaultStyles = true, activeRecipientColor, testId } = props;
  const { token } = theme.useToken();
  const options = useContext(OptionsContext);
  const hasCustomClass = typeof className === 'string' && className.trim().length > 0;
  const resolvedFallbackClassName = hasCustomClass
    ? `${DESIGNER_CLASSNAME}custom-${className.trim()}`
    : `${DESIGNER_CLASSNAME}plugin-icon-fallback`;

  const schemaType = plugin.propPanel.defaultSchema?.type ?? '';
  const resolvedIconColor = activeRecipientColor || token.colorText;

  const icon = options.icons?.[schemaType] ?? plugin.icon;
  const iconStyles = {
    ...(useDefaultStyles
      ? {
        color: resolvedIconColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
      : {}),
    ...styles,
  };

  const dataAttrs = {
    ...(testId ? { 'data-testid': testId } : {}),
    'data-schema-type': schemaType || undefined,
    ...(activeRecipientColor ? { 'data-active-recipient-color': activeRecipientColor } : {}),
  };

  if (icon) {
    return (
      <div
        className={useDefaultStyles ? `flex items-center justify-center ${className || ''}`.trim() : className}
        {...dataAttrs}
      >
        <SVGIcon svgString={icon} size={size} styles={iconStyles} label={label} />
      </div>
    );
  }

  return (
    <div
      className={useDefaultStyles ? `flex items-center justify-center ${resolvedFallbackClassName}`.trim() : resolvedFallbackClassName}
      style={{
        ...(useDefaultStyles
          ? {
              color: resolvedIconColor,
            }
          : {}),
        ...styles,
      }}
      {...dataAttrs}>
      {label}
    </div>
  );
};

export default PluginIcon;
