import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import React, { useContext, useMemo } from 'react';
import { Plugin, Schema } from '@sisad-pdfme/common';
import { OptionsContext } from '@sisad-pdfme/ui/contexts';
import { theme } from 'antd';
import DOMPurify from 'dompurify';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

export type PluginIconColorMode = 'owner' | 'semantic' | 'original';

interface PluginIconProps {
  plugin: Plugin<Schema>;
  label: string;
  size?: number;
  styles?: React.CSSProperties;
  className?: string;
  useDefaultStyles?: boolean;
  activeRecipientColor?: string | null;
  /** Color mode policy: 'owner' (default) follows recipient, 'semantic' keeps green/red, 'original' keeps all. */
  colorMode?: PluginIconColorMode;
  /** Optional data-testid stamped on the icon root (surface-specific, e.g. left-sidebar-schema-icon). */
  testId?: string;
  density?: 'comfortable' | 'compact' | 'minimal';
  'data-schema-type'?: string;
  'data-activerecipient-color'?: string;
}

const SVGIcon = ({ svgString, size, styles, label, colorMode = 'owner' }: {
  svgString: string;
  size?: number;
  styles?: React.CSSProperties;
  label: string;
  colorMode?: PluginIconColorMode;
}) => {
  const normalizePaintToCurrentColor = useMemo(() => {
    return (value: string) => {
      if (colorMode === 'original') return value;

      return value.replace(
        /\b(stroke|fill)="(?!none\b|transparent\b|url\(|currentColor\b)([^"]+)"/gi,
        (_match, attr) => {
          if (colorMode === 'semantic') return _match;
          return `${attr}="currentColor"`;
        },
      );
    };
  }, [colorMode]);

  const processedSVG = useMemo(() => {
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
  }, [svgString, size, normalizePaintToCurrentColor]);

  if (!processedSVG) {
    return null;
  }

  return (
    <div
      aria-label={label}
      style={styles}
      dangerouslySetInnerHTML={{ __html: processedSVG }}
    />
  );
};

const PluginIcon = (props: PluginIconProps) => {
  const { 
    plugin, 
    label, 
    size: userSize, 
    styles, 
    className, 
    useDefaultStyles = true, 
    activeRecipientColor, 
    colorMode = 'owner', 
    testId,
    density = 'comfortable'
  } = props;
  
  const { token } = theme.useToken();
  useContext(OptionsContext);

  const resolvedSize = useMemo(() => {
    if (userSize) return userSize;
    if (density === 'minimal') return 14;
    if (density === 'compact') return 18;
    return 20;
  }, [userSize, density]);

  const iconColor = useMemo(() => {
    if (colorMode === 'original') return undefined;
    if (activeRecipientColor) return activeRecipientColor;
    return token.colorText;
  }, [activeRecipientColor, colorMode, token.colorText]);

  const baseStyles: React.CSSProperties = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: resolvedSize,
    height: resolvedSize,
    color: iconColor,
    ...styles,
  }), [resolvedSize, iconColor, styles]);

  // Some plugin declarations may not include a registration key on the
  // object instance; prefer the provided label and fall back to a stable
  // string to avoid TS errors referencing `plugin.key`.
  const iconName = label || (plugin as any)?.key || 'schema-icon';

  const iconContent = useMemo(() => {
    if (typeof plugin.icon === 'string') {
      return <SVGIcon svgString={plugin.icon} size={resolvedSize} label={iconName} colorMode={colorMode} />;
    }
    if (typeof plugin.icon === 'function') {
      const IconComp = plugin.icon as React.ComponentType<{ size?: number }>;
      return <IconComp size={resolvedSize} />;
    }
    return null;
  }, [plugin.icon, resolvedSize, iconName, colorMode]);

  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}plugin-icon`,
        useDefaultStyles && 'transition-colors duration-200',
        className
      )}
      style={baseStyles}
      data-testid={testId}
      data-schema-type={props['data-schema-type']}
      data-activerecipient-color={props['data-activerecipient-color']}
    >
      {iconContent}
    </div>
  );
};

export default PluginIcon;
