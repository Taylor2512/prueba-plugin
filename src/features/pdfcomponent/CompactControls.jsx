import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Settings2 } from 'lucide-react'
import PopoverMenu from './PopoverMenu.jsx'
import { createLabActionRegistry } from './integration/labActionRegistry'

const EMPTY_ARRAY = []
const joinClasses = (...classes) => classes.filter(Boolean).join(' ')
const MODE_OPTIONS = [
  { id: 'designer', label: 'Diseñador' },
  { id: 'form', label: 'Formulario' },
  { id: 'viewer', label: 'Visor' },
]
const SCHEMA_DEFINITION_PROP_TYPE = PropTypes.shape({
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
})

const ControlSection = ({ label, children, quiet = false }) => (
  <section className={joinClasses('grid gap-[0.3rem] rounded-[12px] border border-[rgba(148,163,184,0.16)] p-[0.42rem] bg-[rgba(248,250,252,0.86)]', quiet && 'bg-[rgba(255,255,255,0.86)]')}>
    <span className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</span>
    {children}
  </section>
)

ControlSection.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  quiet: PropTypes.bool,
}

const ActionButton = ({
  close = null,
  busy,
  onClick,
  label,
  disabled = false,
  disabledReason = '',
  destructive = false,
  testId,
}) => {
  const handleClick = () => {
    if (typeof close === 'function') close()
    if (typeof onClick === 'function') onClick()
  }

  return (
    <button
      type="button"
      className={joinClasses(
        'min-h-[2rem] cursor-pointer rounded-[10px] border border-[rgba(148,163,184,0.26)] bg-white p-[0.28rem_0.55rem] text-left font-semibold text-slate-900',
        destructive && 'text-red-700',
      )}
      disabled={busy || disabled}
      data-testid={testId}
      title={disabled && disabledReason ? disabledReason : undefined}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

ActionButton.propTypes = {
  close: PropTypes.func,
  busy: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  disabledReason: PropTypes.string,
  destructive: PropTypes.bool,
  testId: PropTypes.string,
}

const ActionSection = ({ title, actions, close, busy }) => (
  <ControlSection label={title}>
    {actions.map((action) => (
      <ActionButton
        key={action.key}
        close={close}
        busy={busy}
        onClick={action.run}
        label={action.label}
        disabled={action.enabled === false}
        disabledReason={action.disabledReason}
        destructive={action.destructive}
        testId={action.testId}
      />
    ))}
  </ControlSection>
)

ActionSection.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      destructive: PropTypes.bool,
    }),
  ).isRequired,
  close: PropTypes.func,
  busy: PropTypes.bool.isRequired,
}

export default function CompactControls({
  mode,
  onModeChange,
  onGenerate,
  onPdf2Size,
  onPdf2Img,
  onImg2Pdf,
  onAddPage,
  onFitPage,
  onFitWidth,
  onAddSchema,
  onReset,
  schemaCatalog = EMPTY_ARRAY,
  schemaType,
  onSchemaTypeChange,
  busy = false,
  hasGeneratedPdf = false,
  hasImages = false,
  compact = false,
}) {
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false)

  const modeLabel = useMemo(
    () =>
      ({
        designer: 'Diseñador',
        form: 'Formulario',
        viewer: 'Visor',
      }[mode] || mode),
    [mode],
  )

  const runAndClose = (close, action) => () => {
    close()
    setResetConfirmationOpen(false)
    if (typeof action === 'function') action()
  }

  const applyMode = (close, nextMode) => () => {
    close()
    setResetConfirmationOpen(false)
    if (typeof onModeChange === 'function') onModeChange(nextMode)
  }

  const actionSections = useMemo(
    () =>
      createLabActionRegistry({
        mode,
        busy,
        hasGeneratedPdf,
        hasImages,
        onGenerate,
        onPdf2Size,
        onPdf2Img,
        onImg2Pdf,
        onAddPage,
        onFitPage,
        onFitWidth,
        onAddSchema,
        onReset,
      }),
    [
      busy,
      hasGeneratedPdf,
      hasImages,
      mode,
      onGenerate,
      onPdf2Size,
      onPdf2Img,
      onImg2Pdf,
      onAddPage,
      onFitPage,
      onFitWidth,
      onAddSchema,
      onReset,
    ],
  )

  return (
    <PopoverMenu
      // Canvas-first keeps the command center icon-only to avoid consuming
      // horizontal space in the header chrome.
      label=""
      icon={<Settings2 size={compact ? 14 : 16} />}
      align="end"
      panelClassName="min-w-[16rem] max-w-[min(22rem,_calc(100vw_-_1rem))]"
      triggerClassName={compact ? 'h-8 w-8 min-h-8 min-w-8 p-0' : ''}
      ariaLabel="Abrir controles"
    >
      {({ close }) => (
        <div className="grid gap-[0.35rem]">
          <ControlSection label="Modo">
            <div className="grid grid-cols-3 gap-[0.25rem]">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={joinClasses(
                    'min-h-[2rem] rounded-[10px] border border-[rgba(148,163,184,0.26)] bg-white p-[0.28rem_0.55rem] text-left font-semibold text-slate-900 cursor-pointer',
                    mode === option.id && 'border-[rgba(59,130,246,0.28)] bg-blue-50 text-blue-700',
                  )}
                  onClick={applyMode(close, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="text-[0.68rem] leading-[1.3] text-slate-500">Modo activo: {modeLabel}</span>
          </ControlSection>

          {actionSections
            .filter((section) => section.visible)
            .map((section) => (
              <ActionSection key={section.key} title={section.title} actions={section.actions} close={close} busy={busy} />
            ))}
          {mode === 'designer' ? (
            <ControlSection label="Schema">
              <label className="text-[0.72rem] font-semibold text-slate-700" htmlFor="schema-type-select-compact">
                Tipo de schema
              </label>
              <select
                id="schema-type-select-compact"
                className="min-h-[2rem] rounded-[10px] border border-[rgba(148,163,184,0.28)] bg-white px-[0.55rem] text-slate-900"
                value={schemaType}
                onChange={onSchemaTypeChange}
                disabled={busy}
              >
                {schemaCatalog.map((definition) => (
                  <option key={definition.type} value={definition.type}>
                    {definition.category} · {definition.label}
                  </option>
                ))}
              </select>
              <ActionButton close={close} busy={busy} onClick={onAddSchema} label="Agregar schema" testId="lab-action-add-schema-inline" />
            </ControlSection>
          ) : null}

          <ControlSection label="Avanzado" quiet>
            {!resetConfirmationOpen ? (
              <>
                <ActionButton
                  busy={busy}
                  onClick={() => setResetConfirmationOpen(true)}
                  label="Reiniciar template"
                  destructive
                  testId="lab-action-reset-template"
                />
                <span className="text-[0.68rem] leading-[1.3] text-slate-500">
                  Acción de riesgo. Requiere confirmación.
                </span>
              </>
            ) : (
              <div className="grid gap-[0.35rem]">
                <span className="text-[0.68rem] leading-[1.3] text-slate-500">
                  Confirmar reinicio del template actual.
                </span>
                <div className="flex flex-wrap gap-[0.3rem]">
                  <button
                    type="button"
                    className="min-h-[2rem] cursor-pointer rounded-[10px] border border-[rgba(148,163,184,0.26)] bg-white p-[0.28rem_0.55rem] text-left font-semibold text-red-700"
                    disabled={busy}
                    onClick={runAndClose(close, onReset)}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="min-h-[2rem] cursor-pointer rounded-[10px] border border-[rgba(148,163,184,0.26)] bg-white p-[0.28rem_0.55rem] text-left font-semibold text-slate-900"
                    disabled={busy}
                    onClick={() => setResetConfirmationOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </ControlSection>
        </div>
      )}
    </PopoverMenu>
  )
}

CompactControls.propTypes = {
  mode: PropTypes.oneOf(['designer', 'form', 'viewer']),
  onModeChange: PropTypes.func,
  onGenerate: PropTypes.func,
  onPdf2Size: PropTypes.func,
  onPdf2Img: PropTypes.func,
  onImg2Pdf: PropTypes.func,
  onAddPage: PropTypes.func,
  onFitPage: PropTypes.func,
  onFitWidth: PropTypes.func,
  onAddSchema: PropTypes.func,
  onReset: PropTypes.func,
  schemaCatalog: PropTypes.arrayOf(
    SCHEMA_DEFINITION_PROP_TYPE,
  ),
  schemaType: PropTypes.string,
  onSchemaTypeChange: PropTypes.func,
  busy: PropTypes.bool,
  hasGeneratedPdf: PropTypes.bool,
  hasImages: PropTypes.bool,
  compact: PropTypes.bool,
}
