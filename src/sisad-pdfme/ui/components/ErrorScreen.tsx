import React, { useContext } from 'react';
import { Size } from '@sisad-pdfme/common';
import { I18nContext } from '../contexts.js';
import { UI_CLASSNAME } from '../constants.js';
import { Result } from 'antd';

const ErrorScreen = ({ size, error }: { size: Size; error: Error }) => {
  const i18n = useContext(I18nContext);
  void size;

  return (
    <div className={UI_CLASSNAME + 'error-screen p-4'}>
      <div className={UI_CLASSNAME + 'error-screen-body rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-sm'}>
        <Result
          icon={null}
          className="m-0 px-0 py-2"
          title={<span className="text-sm font-black tracking-[0.2em] text-rose-600">ERROR</span>}
          subTitle={<span className="text-sm text-slate-600">{i18n('errorOccurred')}</span>}
          extra={<span className="block max-w-[36rem] text-xs leading-5 text-slate-500">{error.message}</span>}
        />
      </div>
    </div>
  );
};

export default ErrorScreen;
