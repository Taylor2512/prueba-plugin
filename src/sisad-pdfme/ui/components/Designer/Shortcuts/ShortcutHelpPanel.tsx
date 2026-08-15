import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Input, Modal, Tag, Typography } from 'antd';
import type { InputRef } from 'antd';
import type { ShortcutDefinition } from '@sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts';
import { formatShortcutForPlatform, getShortcuts } from '@sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

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

const normalizeShortcutQuery = (value: string) => value.toLowerCase().trim();

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
      return haystack.includes(normalizeShortcutQuery(query));
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
      classNames={{
        wrapper: 'backdrop-blur-[1px]',
        mask: 'bg-slate-950/45',
        content:
          'overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]',
        header: 'border-b border-slate-200/80 px-5 py-4',
        body: 'bg-slate-50/70 p-0',
      }}
      destroyOnHidden
      afterClose={() => setQuery('')}
    >
      <div className={mergeClassNames('sisad-pdfme-shortcuts-panel-body', 'space-y-4 rounded-b-2xl bg-slate-50/70 p-4')}>
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          allowClear
          className="rounded-xl border-slate-200 bg-white shadow-sm"
        />

        {Object.keys(grouped).length === 0 ? (
          <Empty description={emptyMessage} />
        ) : (
          <div className={mergeClassNames('sisad-pdfme-shortcuts-groups', 'space-y-4')}>
            {scopeOrder.reduce<React.ReactNode[]>((acc, scope) => {
              if (!grouped[scope]?.length) return acc;
              acc.push(
                <section key={scope} className="sisad-pdfme-shortcuts-group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <Typography.Title level={5} className="sisad-pdfme-shortcuts-group-title mb-3 text-sm font-semibold text-slate-800">
                    {scopeLabelOverrides?.[scope] || scopeLabels[scope] || scope}
                  </Typography.Title>
                  <div className="sisad-pdfme-shortcuts-group-items space-y-2">
                    {grouped[scope].map((shortcut) => (
                      <article
                        key={shortcut.id}
                        className="sisad-pdfme-shortcuts-row flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                      >
                        <div className="sisad-pdfme-shortcuts-row-copy min-w-0">
                          <strong className="block text-sm font-medium text-slate-800">{shortcut.label}</strong>
                          {shortcut.description ? <span className="block text-xs text-slate-500">{shortcut.description}</span> : null}
                        </div>
                        <div className="sisad-pdfme-shortcuts-row-keys flex flex-wrap justify-end gap-1" aria-label={shortcut.label}>
                          {splitShortcutCombos(formatShortcutForPlatform(shortcut)).map((keyCombo) => (
                            <Tag
                              key={`${shortcut.id}-${keyCombo}`}
                              className="sisad-pdfme-shortcuts-key m-0 rounded-lg border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
                              bordered={false}
                            >
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
