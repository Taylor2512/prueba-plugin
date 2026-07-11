/**
 * Footer action area for ListView bulk edit mode.
 *
 * In bulk mode it renders commit/cancel actions. Outside bulk mode it exposes
 * the entry point for mass-renaming field names when schemas exist.
 */
import React from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

const { Text } = Typography;


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
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer', 'flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm')}>
      <Text type="secondary" className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer-hint', 'text-xs font-medium text-slate-500')}>
        Cambios masivos pendientes
      </Text>
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-footer-actions', 'flex items-center gap-2')}>
        <Button
          className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-commit', 'rounded-full bg-sky-600 text-white shadow-sm')}
          size="small"
          type="primary"
          onClick={onCommit}>
          {labels.commitBulkUpdateFieldName}
        </Button>
        <Button
          className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-cancel', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}
          size="small"
          onClick={onCancel}>
          {labels.cancel}
        </Button>
      </div>
    </div>
) : (
      <Tooltip title={labels.bulkUpdateFieldName} placement="top">
        <Button
        className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-update', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}
          size="small"
          type="text"
        onClick={onStartBulk}
        disabled={!hasSchemas}>
        {labels.bulkUpdateFieldName}
      </Button>
    </Tooltip>
  );

export default ListViewFooter;
