import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Input, Modal, Tag, Typography } from 'antd';
import type { InputRef } from 'antd';
import type { ShortcutDefinition } from '../shared/keyboardShortcuts.js';
import { formatShortcutForPlatform, getShortcuts } from '../shared/keyboardShortcutRegistry.js';

type ShortcutHelpPanelProps = {
  open: boolean;
  onClose: () => void;
  shortcuts?: ShortcutDefinition[];
  title?: React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: React.ReactNode;
  scopeLabels?: Partial<Record<ShortcutDefinition['scope'], string>>;
  scopeOrder?: ShortcutDefinition['scope'][];
};

const scopeLabels: Record<ShortcutDefinition['scope'], string> = {
  global: 'Global',
  canvas: 'Canvas',
  selection: 'Selección',
  schema: 'Campo',
  'text-editing': 'Texto',
  navigation: 'Navegación',
  view: 'Vista',
  collaboration: 'Colaboración',
};

const normalize = (value: string) => value.toLowerCase().trim();

const splitShortcutCombos = (value: string): string[] =>
  value.split(',').reduce<string[]>((acc, entry) => {
    const normalized = entry.trim();
    if (normalized) acc.push(normalized);
    return acc;
  }, []);

const ShortcutHelpPanel = ({
  open,
  onClose,
  shortcuts,
  title = 'Atajos del diseñador',
  searchPlaceholder = 'Buscar atajo',
  emptyMessage = 'No hay atajos que coincidan con la búsqueda.',
  scopeLabels: scopeLabelOverrides,
  scopeOrder: scopeOrderOverride,
}: ShortcutHelpPanelProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<InputRef | null>(null);
  const resolvedShortcuts = shortcuts || getShortcuts();
  const scopeOrder: ShortcutDefinition['scope'][] = scopeOrderOverride || [
    'global',
    'selection',
    'canvas',
    'schema',
    'navigation',
    'view',
    'collaboration',
    'text-editing',
  ];

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus({ cursor: 'all' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const grouped = useMemo(() => {
    const filtered = resolvedShortcuts.filter((shortcut) => {
      if (!query.trim()) return true;
      const haystack = [
        shortcut.label,
        shortcut.description || '',
        shortcut.scope,
        shortcut.actionId || '',
        shortcut.commandId || '',
        formatShortcutForPlatform(shortcut),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalize(query));
    });

    return filtered.reduce<Record<string, ShortcutDefinition[]>>((acc, shortcut) => {
      const key = shortcut.scope;
      if (!acc[key]) acc[key] = [];
      acc[key].push(shortcut);
      return acc;
    }, {});
  }, [query, resolvedShortcuts]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      title={title}
      className="sisad-pdfme-shortcuts-panel"
      destroyOnClose
      afterClose={() => setQuery('')}
    >
      <div className="sisad-pdfme-shortcuts-panel-body">
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          allowClear
        />

        {Object.keys(grouped).length === 0 ? (
          <Empty description={emptyMessage} />
        ) : (
          <div className="sisad-pdfme-shortcuts-groups">
            {scopeOrder.reduce<React.ReactNode[]>((acc, scope) => {
              if (!grouped[scope]?.length) return acc;
              acc.push(
                <section key={scope} className="sisad-pdfme-shortcuts-group">
                  <Typography.Title level={5} className="sisad-pdfme-shortcuts-group-title">
                    {scopeLabelOverrides?.[scope] || scopeLabels[scope] || scope}
                  </Typography.Title>
                  <div className="sisad-pdfme-shortcuts-group-items">
                    {grouped[scope].map((shortcut) => (
                      <article key={shortcut.id} className="sisad-pdfme-shortcuts-row">
                        <div className="sisad-pdfme-shortcuts-row-copy">
                          <strong>{shortcut.label}</strong>
                          {shortcut.description ? <span>{shortcut.description}</span> : null}
                        </div>
                        <div className="sisad-pdfme-shortcuts-row-keys" aria-label={shortcut.label}>
                          {splitShortcutCombos(formatShortcutForPlatform(shortcut)).map((keyCombo) => (
                            <Tag key={`${shortcut.id}-${keyCombo}`} className="sisad-pdfme-shortcuts-key" bordered={false}>
                              {keyCombo}
                            </Tag>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
              return acc;
            }, [])}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ShortcutHelpPanel);
