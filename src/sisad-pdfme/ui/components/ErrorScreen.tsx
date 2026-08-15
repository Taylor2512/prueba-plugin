/**
 * Pantalla de error visual del runtime.
 *
 * Renderiza una superficie consistente con Ant Design Result cuando el
 * preprocesamiento del PDF/template falla. No intenta recuperar ni mutar estado;
 * solo muestra el mensaje de error recibido.
 */
import { useContext } from 'react';
import { Size } from '@sisad-pdfme/common';
import { I18nContext } from '@sisad-pdfme/ui/contexts';
import { UI_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { Result } from 'antd';

/**
 * Renderiza el estado de error del runtime.
 *
 * @param size Tamaño disponible del contenedor; actualmente se conserva por
 * compatibilidad de API.
 * @param error Error recibido desde el preprocesador/render runtime.
 */
const ErrorScreen = ({ size, error }: { size: Size; error: Error }) => {
  const i18n = useContext(I18nContext);
  void size;

  return (
    <div className={UI_CLASSNAME + 'error-screen grid h-full w-full place-items-center p-4'}>
      <div className={UI_CLASSNAME + 'error-screen-body w-full max-w-[min(32.5rem,_calc(100%_-_1.5rem))] rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-sm'}>
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
