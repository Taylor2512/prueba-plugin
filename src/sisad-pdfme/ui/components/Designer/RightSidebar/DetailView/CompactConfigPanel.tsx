import React from 'react';
import { Button, Modal, Tag } from 'antd';
import { Settings2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

type StatusTag = {
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' | 'cyan' | 'purple';
};

type CompactConfigPanelProps = {
  title: string;
  description?: string;
  summary?: string;
  statusTags?: StatusTag[];
  quickActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  modalTitle?: string;
  modalWidth?: number;
  modalTriggerLabel?: string;
  children: React.ReactNode;
};

const EMPTY_TAGS: StatusTag[] = [];

const CompactConfigPanel = ({
  title,
  description,
  summary,
  statusTags = EMPTY_TAGS,
  quickActions,
  footerActions,
  modalTitle,
  modalWidth = 720,
  modalTriggerLabel = 'Configurar',
  children,
}: CompactConfigPanelProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel', 'rounded-2xl border border-slate-200/70 bg-white/90 p-3 shadow-sm')}>
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-head', 'flex items-start justify-between gap-3')}>
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-copy', 'min-w-0')}>
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-title', 'text-sm font-semibold text-slate-900')}>{title}</div>
          {description ? (
            <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-description', 'text-xs leading-5 text-slate-500')}>{description}</div>
          ) : null}
        </div>
        {statusTags.length > 0 ? (
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-tags', 'flex flex-wrap gap-1')}>
            {statusTags.map((tag, index) => (
              <Tag key={`${tag.label}-${index}`} color={tag.color} className="m-0 rounded-full border-slate-200 px-2 py-0.5 text-[11px]">
                {tag.label}
              </Tag>
            ))}
          </div>
        ) : null}
      </div>

      {summary ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-summary', 'mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2')}>
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-summary-text', 'text-sm text-slate-700')}>{summary}</div>
        </div>
      ) : null}

      {quickActions ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-actions', 'mt-3 flex flex-wrap gap-2')}>{quickActions}</div>
      ) : null}

      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-footer', 'mt-3 flex items-center justify-end gap-2')}>
        {footerActions ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-footer-actions', 'flex items-center gap-2')}>{footerActions}</div> : null}
        <Button
          size="small"
          type="default"
          icon={<Settings2 size={14} />}
          onClick={() => setOpen(true)}
          className="rounded-full border-slate-200 text-slate-700 shadow-sm"
        >
          {modalTriggerLabel}
        </Button>
      </div>

      <Modal
        destroyOnHidden
        open={open}
        onCancel={() => setOpen(false)}
        title={modalTitle || title}
        width={modalWidth}
        centered
        footer={null}
      >
        {children}
      </Modal>
    </div>
  );
};

export default CompactConfigPanel;
