import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

export type Pair = { id: string; key: string; value: string };

export const toPairs = (values?: Record<string, string> | null): Pair[] => {
  if (!values) return [];
  return Object.entries(values).map(([key, value], index) => ({
    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `pair-${Date.now()}-${index}-${key}`,
    key,
    value,
  }));
};

export const toRecord = (pairs: Pair[]): Record<string, string> =>
  pairs.reduce<Record<string, string>>((acc, pair) => {
    const key = pair.key.trim();
    if (!key) return acc;
    acc[key] = pair.value;
    return acc;
  }, {});

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
    <div className={`${DESIGNER_CLASSNAME}schema-config-pair-editor`}>
      <div className={`${DESIGNER_CLASSNAME}schema-config-pair-editor-head`}>
        <div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-pair-editor-title`}>{title}</div>
          {description ? <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>{description}</div> : null}
        </div>
        <Button
          size="small"
          type="text"
          icon={<Plus size={14} />}
          onClick={() => commit([...(latestRows || []), { id: `pair-${Date.now()}-${latestRows.length}`, key: '', value: '' }])}
        >
          Añadir
        </Button>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-pair-list`}>
        {rows.length === 0 ? (
          <div className={`${DESIGNER_CLASSNAME}schema-config-empty`}>Sin elementos</div>
        ) : null}
        {rows.map((row, index) => (
          <div key={row.id} className={`${DESIGNER_CLASSNAME}schema-config-pair-row`}>
            <Input
              size="small"
              value={row.key}
              placeholder={placeholderKey}
              onChange={(event) => updateRow(index, 'key', event.target.value)}
              onBlur={() => commit(latestRows)}
            />
            <Input
              size="small"
              value={row.value}
              placeholder={placeholderValue}
              onChange={(event) => updateRow(index, 'value', event.target.value)}
              onBlur={() => commit(latestRows)}
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<Trash2 size={13} />}
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
  <div className={`${DESIGNER_CLASSNAME}schema-config-section-head`}>
    <div className={`${DESIGNER_CLASSNAME}schema-config-section-head-main`}>
      <span className={`${DESIGNER_CLASSNAME}schema-config-section-icon`}>{icon}</span>
      <div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-section-title`}>{title}</div>
        {description ? <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>{description}</div> : null}
      </div>
    </div>
    {typeof active === 'boolean' ? (
      <span className={`${DESIGNER_CLASSNAME}schema-config-section-state`} data-active={String(active)}>
        {active ? 'Activo' : 'Inactivo'}
      </span>
    ) : null}
  </div>
);
