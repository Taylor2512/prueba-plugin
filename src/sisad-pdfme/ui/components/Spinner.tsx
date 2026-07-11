/**
 * Indicador de carga común del runtime.
 *
 * Usa el color primario del tema Ant Design para mantener consistencia visual
 * con el resto del diseñador/visor.
 */
import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { theme } from 'antd';

/**
 * Spinner accesible usado mientras el runtime prepara escala o recursos.
 */
const Spinner: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
      style={{ color: colorPrimary }}
      aria-label="Cargando"
      role="status"
    >
      <LoaderCircle size={42} className="animate-spin" />
    </div>
  );
};

export default Spinner;
