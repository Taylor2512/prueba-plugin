import { DESIGNER_CLASSNAME } from "../../constants.js";
import React, { useContext, useMemo } from 'react';
import { Plugin, Schema } from '@pdfme/common';
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
}

const SVGIcon = ({ svgString, size, styles, label }: {
  svgString: string;
  size?: number;
  styles?: React.CSSProperties;
  label: string;
}) => {
  const processedSVG = useMemo(() => {
    // First sanitize the SVG string using DOMPurify with SVG profile
    const sanitizedSVG = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'g', 'defs', 'title', 'desc', 'metadata'],
      ALLOWED_ATTR: ['class', 'id', 'fill', 'stroke', 'stroke-width', 'viewBox', 'width', 'height', 'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'rx', 'ry', 'transform'],
      FORBID_TAGS: ['script', 'foreignObject', 'use', 'embed', 'iframe', 'object', 'link', 'style'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'href', 'xlink:href', 'src', 'action', 'formaction'],
      KEEP_CONTENT: false
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedSVG, 'image/svg+xml');

    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      return null;
    }

    // Apply size attributes if specified
    if (size) {
      svgElement.setAttribute('width', size.toString());
      svgElement.setAttribute('height', size.toString());
    }

    return svgElement.outerHTML;
  }, [svgString, size]);

  if (!processedSVG) {
    return null;
  }

  return (
    <div
      title={label}
      dangerouslySetInnerHTML={{ __html: processedSVG }}
      className={DESIGNER_CLASSNAME + "div-auto"}
    />
  );
};

const PluginIcon = (props: PluginIconProps) => {
  const { plugin, label, size, styles, className, useDefaultStyles = true } = props;
  const { token } = theme.useToken();
  const options = useContext(OptionsContext);
  const hasCustomClass = typeof className === 'string' && className.trim().length > 0;
  const resolvedFallbackClassName = hasCustomClass
    ? `${DESIGNER_CLASSNAME}custom-${className.trim()}`
    : `${DESIGNER_CLASSNAME}plugin-icon-fallback`;

  const schemaType = plugin.propPanel.defaultSchema?.type ?? '';

  const icon = options.icons?.[schemaType] ?? plugin.icon;
  const iconStyles = {
    ...styles,
    ...(useDefaultStyles
      ? {
        color: token.colorText,
        display: 'flex',
        justifyContent: 'center',
      }
      : {}),
  };

  if (icon) {
    return (
      <div className={className}>
        <SVGIcon svgString={icon} size={size} styles={iconStyles} label={label} />
      </div>
    );
  }

  return (
    <div
      className={resolvedFallbackClassName}
      title={label}>
      {label}
    </div>
  );
};

export default PluginIcon;
