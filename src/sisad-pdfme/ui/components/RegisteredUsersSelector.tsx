/**
 * RegisteredUsersSelector — selector compacto de "usuario activo" para la banda
 * superior del diseñador embebido.
 *
 * Se monta DENTRO del diseñador (CtlBar) porque el wrapper público
 * `SisadPdfmeDesigner` es un punto de montaje imperativo (`<div ref>`), no un
 * padre React: no se puede inyectar un ReactNode como slot desde el host. Por eso
 * consume `recipientOptions`/`activeRecipient` del `collaborationContext` interno
 * (fuente única = RecipientRegistry) y notifica el cambio vía `onChange`, que debe
 * enrutarse a `registry.setActiveRecipient`.
 */
import { ChevronDown, Users } from 'lucide-react';
import { UI_CLASSNAME } from '../constants.js';
import { mergeClassNames } from './Designer/shared/className.js';

/**
 * Destinatario mínimo que necesita el selector para pintarse.
 */
export type RegisteredUsersSelectorRecipient = {
  id: string;
  name?: string;
  tag?: string;
  role?: string | null;
  color?: string | null;
};

/**
 * Props del selector de usuario activo.
 */
export type RegisteredUsersSelectorProps = {
  recipients: RegisteredUsersSelectorRecipient[];
  activeRecipientId: string | null;
  onChange: (recipientId: string) => void;
  /** Vista global activa: el selector muestra "Vista global" como estado. */
  isGlobalView?: boolean;
  disabled?: boolean;
};

/**
 * Renderiza un `<select>` compacto con el destinatario activo y su color.
 *
 * No colorea toda la superficie con el owner color: solo el punto/acento, para no
 * confundir ownership con selección.
 */
export const RegisteredUsersSelector = ({
  recipients,
  activeRecipientId,
  onChange,
  isGlobalView = false,
  disabled = false,
}: RegisteredUsersSelectorProps) => {
  if (recipients.length === 0) {
    return (
      <div
        className={mergeClassNames(
          UI_CLASSNAME + 'activerecipient-empty',
          // `border-solid` explícito: preflight está desactivado.
          'inline-flex h-8 items-center gap-2 rounded-lg border border-solid border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500',
        )}
        data-testid="designer-activerecipient-empty"
      >
        <Users size={14} aria-hidden="true" />
        Sin usuarios
      </div>
    );
  }

  const activeRecipient =
    recipients.find((recipient) => recipient.id === activeRecipientId) || recipients[0];

  // Un solo usuario: visible pero deshabilitado (no hay a quién cambiar).
  const isDisabled = disabled || recipients.length <= 1;

  return (
    <label
      className={mergeClassNames(
        UI_CLASSNAME + 'activerecipient-selector',
        'relative inline-flex h-8 min-w-[10rem] max-w-[14rem] items-center gap-2 rounded-lg',
        // `border-solid` explícito por preflight desactivado.
        'border border-solid border-slate-200 bg-white px-2.5 text-xs shadow-none transition-colors',
        'hover:border-slate-300 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100',
        isDisabled && 'opacity-70',
      )}
      data-global-view={isGlobalView ? 'true' : 'false'}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
        style={{ backgroundColor: (!isGlobalView && activeRecipient?.color) || '#64748b' }}
        aria-hidden="true"
      />

      <select
        value={isGlobalView ? '' : activeRecipient?.id || ''}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Seleccionar usuario activo"
        data-testid="designer-activerecipient-select"
        disabled={isDisabled}
        className="min-w-0 flex-1 appearance-none truncate border-0 bg-transparent p-0 text-xs font-semibold text-slate-700 outline-none disabled:cursor-not-allowed"
      >
        {isGlobalView ? <option value="">Vista global</option> : null}
        {recipients.map((recipient) => (
          <option key={recipient.id} value={recipient.id}>
            {recipient.name || recipient.tag || recipient.id}
            {recipient.role ? ` · ${recipient.role}` : ''}
          </option>
        ))}
      </select>

      <ChevronDown size={13} className="pointer-events-none shrink-0 text-slate-400" aria-hidden="true" />
    </label>
  );
};
