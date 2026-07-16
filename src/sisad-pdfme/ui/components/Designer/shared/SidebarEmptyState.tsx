import React from 'react';
import { Button, Typography } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeClassNames } from './className.js';

const { Text } = Typography;

export type SidebarEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  density?: 'comfortable' | 'compact' | 'minimal';
};

/**
 * Componente unificado para los estados vacíos de los sidebars (izquierdo y derecho).
 * Sigue el diseño de Wix Studio con bordes punteados, fondo slate-50 y tipografía compacta.
 */
export const SidebarEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  className,
  density = 'comfortable',
}: SidebarEmptyStateProps) => {
  const isMini = density === 'minimal';

  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}sidebar-empty`,
        'flex flex-col items-start gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 transition-all',
        isMini ? 'p-2 py-3' : '',
        className
      )}
      data-density={density}
    >
      <Text 
        strong 
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}sidebar-empty-title`, 
          'font-semibold text-slate-800',
          isMini ? 'text-[10px] leading-tight' : 'text-sm'
        )}
      >
        {title}
      </Text>
      
      {description && (
        <Text 
          type="secondary" 
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}sidebar-empty-hint`, 
            'text-slate-500',
            isMini ? 'text-[9px] leading-snug' : 'text-xs leading-5'
          )}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          size="small"
          type="default"
          onClick={onAction}
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}sidebar-empty-action`,
            'mt-1 rounded-full border-slate-200 text-slate-700 shadow-sm transition-all hover:border-sky-300 hover:text-sky-600 active:scale-95',
            isMini ? 'h-5 px-2 text-[9px]' : ''
          )}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
