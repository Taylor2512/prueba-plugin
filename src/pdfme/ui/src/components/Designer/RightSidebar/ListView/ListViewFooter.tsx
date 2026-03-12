import React from 'react';
import { Button, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

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

const ListViewFooter = ({ bulkMode, hasSchemas, onCommit, onCancel, onStartBulk, labels }: Props) =>
  bulkMode ? (
    <>
      <Button
        className={DESIGNER_CLASSNAME + 'bulk-commit'}
        size="small"
        type="primary"
        onClick={onCommit}>
        {labels.commitBulkUpdateFieldName}
      </Button>
      <Button
        className={DESIGNER_CLASSNAME + 'bulk-cancel'}
        size="small"
        onClick={onCancel}>
        {labels.cancel}
      </Button>
    </>
  ) : (
    <Tooltip title={labels.bulkUpdateFieldName} placement="top">
      <Button
        className={DESIGNER_CLASSNAME + 'bulk-update'}
        size="small"
        type="text"
        onClick={onStartBulk}
        disabled={!hasSchemas}>
        <u>{labels.bulkUpdateFieldName}</u>
      </Button>
    </Tooltip>
  );

export default ListViewFooter;
