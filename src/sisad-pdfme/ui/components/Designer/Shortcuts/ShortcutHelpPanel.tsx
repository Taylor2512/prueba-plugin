import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Input, Modal, Tag, Typography } from 'antd';
import type { InputRef } from 'antd';
import type { ShortcutDefinition } from '../shared/keyboardShortcuts.js';
import { formatShortcutForPlatform, getShortcuts } from '../shared/keyboardShortcutRegistry.js';

type ShortcutHelpPanelProps = {
  open: boolean;
  onClose: () => void;
  shortcuts?: ShortcutDefinition[];
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

const ShortcutHelpPanel = ({ open, onClose, shortcuts }: ShortcutHelpPanelProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<InputRef | null>(null);
  const resolvedShortcuts = shortcuts || getShortcuts();
  const scopeOrder: ShortcutDefinition['scope'][] = [
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
      title="Atajos del diseñador"
      className="sisad-pdfme-shortcuts-panel"
      destroyOnClose
      afterClose={() => setQuery('')}
    >
      <div className="sisad-pdfme-shortcuts-panel-body">
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar atajo"
          allowClear
        />

        {Object.keys(grouped).length === 0 ? (
          <Empty description="No hay atajos que coincidan con la búsqueda." />
        ) : (
          <div className="sisad-pdfme-shortcuts-groups">
            {scopeOrder
              .filter((scope) => Boolean(grouped[scope]?.length))
              .map((scope) => (
                <section key={scope} className="sisad-pdfme-shortcuts-group">
                  <Typography.Title level={5} className="sisad-pdfme-shortcuts-group-title">
                    {scopeLabels[scope] || scope}
                  </Typography.Title>
                  <div className="sisad-pdfme-shortcuts-group-items">
                    {grouped[scope].map((shortcut) => (
                      <article key={shortcut.id} className="sisad-pdfme-shortcuts-row">
                        <div className="sisad-pdfme-shortcuts-row-copy">
                          <strong>{shortcut.label}</strong>
                          {shortcut.description ? <span>{shortcut.description}</span> : null}
                        </div>
                        <div className="sisad-pdfme-shortcuts-row-keys" aria-label={shortcut.label}>
                          {formatShortcutForPlatform(shortcut)
                            .split(',')
                            .map((keyCombo) => keyCombo.trim())
                            .filter(Boolean)
                            .map((keyCombo) => (
                              <Tag key={`${shortcut.id}-${keyCombo}`} className="sisad-pdfme-shortcuts-key" bordered={false}>
                                {keyCombo}
                              </Tag>
                            ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ShortcutHelpPanel);
