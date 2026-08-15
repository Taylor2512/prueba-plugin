/**
 * SchemaConnectionsShared — primitives compartidos para editores de conexiones.
 *
 * Incluye conversores key/value y componentes visuales para listas de pares y
 * encabezados de sección. Se usa para formularios de persistencia, API, headers,
 * params y otras configuraciones de integración.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

const PAIR_EDITOR_ROOT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-pair-editor',
  'flex flex-col gap-1.5 rounded-[0.95rem] border border-slate-200/70 bg-white p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
);

const PAIR_EDITOR_HEAD = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-pair-editor-head',
  'flex items-start justify-between gap-1.5',
);

const PAIR_EDITOR_TITLE = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-pair-editor-title',
  'text-[0.75rem] font-semibold leading-tight text-slate-900',
);

const PAIR_EDITOR_HELP = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-help',
  'mt-0.5 text-[0.625rem] leading-tight text-slate-500',
);

const PAIR_LIST = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-pair-list',
  'flex flex-col gap-1',
);

const PAIR_EMPTY = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-empty',
  'rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-2 py-1 text-[0.6875rem] text-slate-500',
);

const PAIR_ROW = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-pair-row',
  'grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-1 rounded-lg border border-slate-200/70 bg-white/90 p-1 max-[820px]:grid-cols-1',
);

const SECTION_HEAD = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-section-head',
  'flex w-full items-center justify-between gap-2',
);

const SECTION_HEAD_MAIN = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-section-head-main',
  'flex min-w-0 items-center gap-1.5',
);

const SECTION_ICON = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-section-icon',
  'inline-flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center rounded-md border border-slate-200/70 bg-slate-50 text-slate-700 shadow-none',
);

const SECTION_TITLE = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-section-title',
  'text-[0.75rem] font-semibold leading-tight text-slate-900',
);

const SECTION_STATE = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-section-state',
  'inline-flex items-center rounded-full border border-slate-200/70 bg-slate-50 px-1.5 py-[0.14rem] text-[0.5625rem] font-semibold leading-none text-slate-700 data-[active=true]:border-[var(--color-primary-30)] data-[active=true]:bg-[var(--color-primary-200-20)] data-[active=true]:text-[var(--color-primary)]',
);

export const SCHEMA_CONFIG_COLLAPSE = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-collapse',
  'overflow-hidden rounded-[0.625rem] border border-slate-200/70 bg-white transition-[background,border-color]',
  '[&_.ant-collapse-item]:overflow-hidden [&_.ant-collapse-item]:rounded-[0.625rem] [&_.ant-collapse-item]:border-0 [&_.ant-collapse-item]:bg-transparent',
  '[&_.ant-collapse-item>.ant-collapse-header]:px-[0.5rem] [&_.ant-collapse-item>.ant-collapse-header]:py-[0.375rem]',
  '[&_.ant-collapse-item>.ant-collapse-content]:border-t [&_.ant-collapse-item>.ant-collapse-content]:border-slate-200/70',
  '[&_.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box]:px-[0.5rem] [&_.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box]:py-[0.375rem]',
  '[&_.ant-collapse-item:hover]:border-[var(--color-border-20)] [&_.ant-collapse-item:hover]:bg-white',
);

export const SCHEMA_CONFIG_NESTED_COLLAPSE = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-nested-collapse',
  'gap-[0.1875rem] [&_.ant-collapse-item>.ant-collapse-header]:py-[0.3125rem] [&_.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box]:pt-[0.3125rem]',
);

/** Fila key/value editable dentro de configuraciones de conexión. */
export type Pair = { id: string; key: string; value: string };

/**
 * Convierte un record plano a filas editables con id estable.
 */
const toPairs = (values?: Record<string, string> | null): Pair[] => {
  if (!values) return [];
  return Object.entries(values).map(([key, value], index) => ({
    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `pair-${Date.now()}-${index}-${key}`,
    key,
    value,
  }));
};

/**
 * Convierte filas editables a record, ignorando claves vacías.
 */
const toRecord = (pairs: Pair[]): Record<string, string> =>
  pairs.reduce<Record<string, string>>((acc, pair) => {
    const key = pair.key.trim();
    if (!key) return acc;
    acc[key] = pair.value;
    return acc;
  }, {});

/**
 * Editor compacto de pares clave/valor para headers, params o mappings.
 */
export const PairEditor = ({
  title,
  description,
  values,
  onChange,
  placeholderKey,
  placeholderValue,
}: {
  title: string;
  description?: string;
  values?: Record<string, string>;
  onChange: (_next: Record<string, string>) => void;
  placeholderKey: string;
  placeholderValue: string;
}) => {
  const [rows, setRows] = useState<Pair[]>(() => toPairs(values));
  const [latestRows, setLatestRows] = useState<Pair[]>(() => toPairs(values));

  useEffect(() => {
    const nextRows = toPairs(values);
    setRows(nextRows);
    setLatestRows(nextRows);
  }, [values]);

  const commit = useCallback(
    (nextRows: Pair[]) => {
      setRows(nextRows);
      setLatestRows(nextRows);
      onChange(toRecord(nextRows));
    },
    [onChange],
  );

  const updateRow = (index: number, key: 'key' | 'value', value: string) => {
    setRows((prev) => {
      const nextRows = prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
      setLatestRows(nextRows);
      return nextRows;
    });
  };

  return (
    <div className={PAIR_EDITOR_ROOT}>
      <div className={PAIR_EDITOR_HEAD}>
        <div>
          <div className={PAIR_EDITOR_TITLE}>{title}</div>
          {description ? <div className={PAIR_EDITOR_HELP}>{description}</div> : null}
        </div>
        <Button
          size="small"
          type="text"
          icon={<Plus size={14} />}
          onClick={() => commit([...(latestRows || []), { id: `pair-${Date.now()}-${latestRows.length}`, key: '', value: '' }])}
          className="inline-flex h-6 appearance-none items-center justify-center rounded-lg border border-slate-200/80 bg-white px-2 text-[0.68rem] font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-slate-50"
        >
          Añadir
        </Button>
      </div>
      <div className={PAIR_LIST}>
        {rows.length === 0 ? (
          <div className={PAIR_EMPTY}>Sin elementos</div>
        ) : null}
        {rows.map((row, index) => (
          <div key={row.id} className={PAIR_ROW}>
            <Input
              size="small"
              id={`pair-${row.id}-key`}
              name={`pair-${row.id}-key`}
              value={row.key}
              placeholder={placeholderKey}
              className="h-8 rounded-md text-[0.6875rem]"
              onChange={(event) => updateRow(index, 'key', event.target.value)}
              onBlur={() => commit(latestRows)}
            />
            <Input
              size="small"
              id={`pair-${row.id}-value`}
              name={`pair-${row.id}-value`}
              value={row.value}
              placeholder={placeholderValue}
              className="h-8 rounded-md border border-slate-200/80 bg-white text-[0.6875rem] shadow-none"
              onChange={(event) => updateRow(index, 'value', event.target.value)}
              onBlur={() => commit(latestRows)}
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<Trash2 size={13} />}
              className="inline-flex h-6 w-6 appearance-none items-center justify-center rounded-lg border border-slate-200/80 bg-white p-0 text-red-500 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-red-200 hover:bg-red-50"
              onClick={() => {
                const next = latestRows.filter((_, rowIndex) => rowIndex !== index);
                commit(next);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Encabezado visual reutilizable para secciones de configuración.
 */
export const SectionHeader = ({
  icon,
  title,
  active,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  description?: string;
}) => (
  <div className={SECTION_HEAD}>
    <div className={SECTION_HEAD_MAIN}>
      <span className={SECTION_ICON}>{icon}</span>
      <div>
        <div className={SECTION_TITLE}>{title}</div>
        {description ? <div className={PAIR_EDITOR_HELP}>{description}</div> : null}
      </div>
    </div>
    {typeof active === 'boolean' ? (
      <span className={SECTION_STATE} data-active={String(active)}>
        {active ? 'Activo' : 'Inactivo'}
      </span>
    ) : null}
  </div>
);
