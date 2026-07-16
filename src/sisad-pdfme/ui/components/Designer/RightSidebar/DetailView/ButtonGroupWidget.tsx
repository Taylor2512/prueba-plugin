/**
 * ButtonGroupWidget — widget genérico para grupos de botones declarados por plugin.
 *
 * Permite alternar propiedades booleanas o asignar valores select sobre todos los
 * schemas activos. Se usa como adaptador visual entre `form-render`, Ant Design y
 * configuraciones de plugins sin acoplar el DetailView a un tipo concreto.
 */
import { DESIGNER_CLASSNAME } from "../../../../constants.js";
import { Button, Form, Tooltip, theme } from 'antd';
import React from 'react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { isRecord } from '../../shared/objectGuards.js';
import { mergeClassNames } from '../../shared/className.js';
/**
 * Configuración declarativa de cada botón del grupo.
 *
 * `boolean` alterna el valor actual; `select` asigna `value` directamente.
 */
interface ButtonConfig {
  key: string;
  icon: string;
  type: 'boolean' | 'select';
  value?: string;
}

/**
 * Renderiza un grupo de botones configurable desde el schema del plugin.
 *
 * @param props Props entregadas por form-render/PropPanel.
 * @returns Widget visual de botones para mutar propiedades de schemas activos.
 */
const ButtonGroupWidget = (props: PropPanelWidgetProps) => {
  const { activeElements, changeSchemas, schemas, schema } = props;
  const { token } = theme.useToken();

  /**
   * Aplica la acción declarada sobre todos los schemas seleccionados.
   *
   * @param btn Configuración del botón seleccionado.
   */
  const apply = (btn: ButtonConfig) => {
    const key = btn.key;
    const type = btn.type;
    const ids = activeElements.filter(Boolean).map((ae) => ae.id);
    const ass = schemas.filter((s) => ids.includes(s.id));
    changeSchemas(
      ass.map((s: SchemaForUI) => {
        const oldValue = Boolean((isRecord(s) ? s[key] : undefined) ?? false);
        const newValue = type === 'boolean' ? !oldValue : btn.value;
        return { key, value: newValue, schemaId: s.id };
      }),
    );
  };

  /**
   * Determina si el botón debe mostrarse activo según la selección actual.
   *
   * @param btn Configuración del botón evaluado.
   * @returns `true` cuando el último schema evaluado cumple el valor esperado.
   */
  const isActive = (btn: ButtonConfig) => {
    const key = btn.key;
    const type = btn.type;
    let active = false;
    const ids = activeElements.filter(Boolean).map((ae) => ae.id);
    const ass = schemas.filter((s) => ids.includes(s.id));
    ass.forEach((s: SchemaForUI) => {
      const schemaRecord = isRecord(s) ? s : {};
      active =
        type === 'boolean' ? Boolean(schemaRecord[key] ?? false) : schemaRecord[key] === btn.value;
    });
    return active;
  };

  /**
   * Reemplaza `currentColor` dentro del SVG para heredar el color del tema.
   */
  const replaceCurrentColor = (svgString: string, color?: string) =>
    color ? svgString.replace(/="currentColor"/g, `="${color}"`) : svgString;

  /**
   * Convierte un string SVG en una imagen embebida segura para Ant Button.
   */
  const svgIcon = (svgString: string) => {
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
      replaceCurrentColor(svgString, token.colorText),
    )}`;
    return <img width={17} height={17} src={svgDataUrl} alt="" />;
  };

  return (
    <Form.Item>
      <div
        className={mergeClassNames(DESIGNER_CLASSNAME + 'button-group', 'flex flex-wrap gap-[0.125rem] gap-y-[0.125rem] w-full')}
      >
        {(schema.buttons as ButtonConfig[]).map((btn: ButtonConfig, index: number) => {
          const active = isActive(btn);
          return (
          <Tooltip key={index} title={btn.key} placement="top" mouseEnterDelay={0.35}>
            <Button
              type="text"
              onClick={() => apply(btn)}
              icon={svgIcon(btn.icon)}
              className={mergeClassNames(
                active
                  ? 'inline-flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-lg border border-[var(--color-primary)] bg-[linear-gradient(180deg,_var(--color-primary-light),_var(--color-primary))] text-white shadow-[0_1px_3px_var(--color-primary-20)] transition hover:-translate-y-px hover:bg-[linear-gradient(180deg,_var(--color-primary),_var(--color-primary))] hover:shadow-[0_3px_8px_var(--color-primary-25)]'
                  : 'inline-flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-none transition hover:border-slate-300 hover:bg-slate-50',
              )}
            />
          </Tooltip>
          );
        })}
      </div>
    </Form.Item>
  );
};

export default ButtonGroupWidget;
