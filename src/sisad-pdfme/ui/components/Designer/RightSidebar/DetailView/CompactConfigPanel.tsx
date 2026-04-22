import React from 'react';
import { Button, Modal, Tag } from 'antd';
import { Settings2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

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
    <div className={`${DESIGNER_CLASSNAME}compact-config-panel`}>
      <div className={`${DESIGNER_CLASSNAME}compact-config-panel-head`}>
        <div className={`${DESIGNER_CLASSNAME}compact-config-panel-copy`}>
          <div className={`${DESIGNER_CLASSNAME}compact-config-panel-title`}>{title}</div>
          {description ? (
            <div className={`${DESIGNER_CLASSNAME}compact-config-panel-description`}>{description}</div>
          ) : null}
        </div>
        {statusTags.length > 0 ? (
          <div className={`${DESIGNER_CLASSNAME}compact-config-panel-tags`}>
            {statusTags.map((tag, index) => (
              <Tag key={`${tag.label}-${index}`} color={tag.color}>
                {tag.label}
              </Tag>
            ))}
          </div>
        ) : null}
      </div>

      {summary ? (
        <div className={`${DESIGNER_CLASSNAME}compact-config-panel-summary`}>
          <div className={`${DESIGNER_CLASSNAME}compact-config-panel-summary-text`}>{summary}</div>
        </div>
      ) : null}

      {quickActions ? (
        <div className={`${DESIGNER_CLASSNAME}compact-config-panel-actions`}>{quickActions}</div>
      ) : null}

      <div className={`${DESIGNER_CLASSNAME}compact-config-panel-footer`}>
        {footerActions ? <div className={`${DESIGNER_CLASSNAME}compact-config-panel-footer-actions`}>{footerActions}</div> : null}
        <Button
          size="small"
          type="default"
          icon={<Settings2 size={14} />}
          onClick={() => setOpen(true)}
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
