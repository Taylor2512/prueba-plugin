/**
 * Footer action area for ListView bulk edit mode.
 *
 * In bulk mode it renders commit/cancel actions. Outside bulk mode it exposes
 * the entry point for mass-renaming field names when schemas exist.
 */
import React from 'react';
import { Button, Tooltip } from 'antd';
import { Check, PencilLine, X } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';


/**
 * Props for the ListView footer.
 */
type Props = {
  bulkMode: boolean;
  hasSchemas: boolean;
  onCommit: () => void;
  onCancel: () => void;
  onStartBulk: () => void;
  labels: {
    bulkUpdateFieldName: string;
    commitBulkUpdateFieldName: string;
    cancel: string;
  };
};


/**
 * Renders either the bulk-mode commit/cancel footer or the idle bulk-entry
 * button, depending on `bulkMode`.
 */
const ListViewFooter = ({ bulkMode, hasSchemas, onCommit, onCancel, onStartBulk, labels }: Props) =>
  bulkMode ? (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer', 'flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm')}>
      <Tooltip title="Edición masiva" placement="top">
        <span className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer-hint', 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-600')}>
          <PencilLine size={12} />
        </span>
      </Tooltip>
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer-actions', 'flex items-center justify-end gap-2')}>
        <Button
          className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-commit', 'inline-flex items-center gap-1 rounded-full bg-sky-600 text-white shadow-sm')}
          size="small"
          type="primary"
          onClick={onCommit}>
          <Check size={14} />
          {labels.commitBulkUpdateFieldName}
        </Button>
        <Button
          className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-cancel', 'inline-flex items-center gap-1 rounded-full border-slate-200 text-slate-700 shadow-sm')}
          size="small"
          onClick={onCancel}>
          <X size={14} />
          {labels.cancel}
        </Button>
      </div>
    </div>
) : (
  <Tooltip title={labels.bulkUpdateFieldName} placement="top">
    <Button
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'bulk-update',
        'inline-flex h-8 w-8 items-center justify-center rounded-full border-slate-200 text-slate-700 shadow-sm',
      )}
      size="small"
      type="text"
      onClick={onStartBulk}
      disabled={!hasSchemas}
      aria-label={labels.bulkUpdateFieldName}
    >
      <PencilLine size={14} />
    </Button>
  </Tooltip>
  );

export default ListViewFooter;
