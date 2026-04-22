import React from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

const { Text } = Typography;

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
    <div className={DESIGNER_CLASSNAME + 'bulk-footer'}>
      <Text type="secondary" className={DESIGNER_CLASSNAME + 'bulk-footer-hint'}>
        Cambios masivos pendientes
      </Text>
      <div className={DESIGNER_CLASSNAME + 'bulk-footer-actions'}>
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
      </div>
    </div>
  ) : (
    <Tooltip title={labels.bulkUpdateFieldName} placement="top">
      <Button
        className={DESIGNER_CLASSNAME + 'bulk-update'}
        size="small"
        type="text"
        onClick={onStartBulk}
        disabled={!hasSchemas}>
        {labels.bulkUpdateFieldName}
      </Button>
    </Tooltip>
  );

export default ListViewFooter;
