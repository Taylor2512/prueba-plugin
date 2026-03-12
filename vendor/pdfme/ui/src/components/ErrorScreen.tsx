import React, { useContext } from 'react';
import { Size } from '@pdfme/common';
import { I18nContext } from '../contexts.js';
import { UI_CLASSNAME } from '../constants.js';
import { Result } from 'antd';

const ErrorScreen = ({ size, error }: { size: Size; error: Error }) => {
  const i18n = useContext(I18nContext);
  void size;

  return (
    <div className={UI_CLASSNAME + 'error-screen'}>
      <div className={UI_CLASSNAME + 'error-screen-body'}>
        <Result
          icon={null}
          title="ERROR"
          subTitle={i18n('errorOccurred')}
          extra={<span>{error.message}</span>}
        />
      </div>
    </div>
  );
};

export default ErrorScreen;
