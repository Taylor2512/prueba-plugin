import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { theme } from 'antd';

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
