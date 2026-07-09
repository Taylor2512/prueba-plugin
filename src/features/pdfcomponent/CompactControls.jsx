import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Settings2 } from 'lucide-react'
import PopoverMenu from './PopoverMenu.jsx'

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
  <section className={joinClasses('sisad-pdfme-popover-section', quiet && 'sisad-pdfme-popover-section-quiet')}>
    <span className="sisad-pdfme-popover-section-label">{label}</span>
    {children}
  </section>
)

ControlSection.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  quiet: PropTypes.bool,
}

const ActionButton = ({ close = null, busy, onClick, label, disabled = false, destructive = false }) => {
  const handleClick = () => {
    if (typeof close === 'function') close()
    if (typeof onClick === 'function') onClick()
  }

  return (
    <button
      type="button"
      className={joinClasses('sisad-pdfme-popover-action', destructive && 'is-destructive')}
      disabled={busy || disabled}
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
  destructive: PropTypes.bool,
}

const buildActionRows = (hasGeneratedPdf, hasImages, handlers) => ({
  pdf: [
    { label: 'Generar PDF', onClick: handlers.onGenerate },
    { label: 'Leer tamaños', onClick: handlers.onPdf2Size, disabled: !hasGeneratedPdf },
    { label: 'PDF → imágenes', onClick: handlers.onPdf2Img, disabled: !hasGeneratedPdf },
    { label: 'Imágenes → PDF', onClick: handlers.onImg2Pdf, disabled: !hasImages },
  ],
  canvas: [
    { label: 'Agregar página', onClick: handlers.onAddPage },
    { label: 'Ajustar a página', onClick: handlers.onFitPage },
    { label: 'Ajustar al ancho', onClick: handlers.onFitWidth },
  ],
  schema: [
    { label: 'Agregar schema', onClick: handlers.onAddSchema },
  ],
  advanced: [
    { label: 'Reiniciar template', onClick: handlers.onReset, destructive: true },
  ],
})

const ActionSection = ({ title, actions, close, busy }) => (
  <ControlSection label={title}>
    {actions.map((action) => (
      <ActionButton
        key={action.label}
        close={close}
        busy={busy}
        onClick={action.onClick}
        label={action.label}
        disabled={action.disabled}
        destructive={action.destructive}
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

  const actionRows = buildActionRows(hasGeneratedPdf, hasImages, { onGenerate, onPdf2Size, onPdf2Img, onImg2Pdf, onAddPage, onFitPage, onFitWidth, onAddSchema, onReset })

  return (
    <PopoverMenu
      // Canvas-first keeps the command center icon-only to avoid consuming
      // horizontal space in the header chrome.
      label=""
      icon={<Settings2 size={16} />}
      align="end"
      panelClassName="sisad-pdfme-lab-command-center"
      ariaLabel="Abrir controles"
    >
      {({ close }) => (
        <div className="sisad-pdfme-compact-controls-panel">
          <ControlSection label="Modo">
            <div className="sisad-pdfme-popover-grid">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={joinClasses('sisad-pdfme-popover-action', mode === option.id && 'is-active')}
                  onClick={applyMode(close, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="sisad-pdfme-popover-section-caption">Modo activo: {modeLabel}</span>
          </ControlSection>

          <ActionSection title="PDF" actions={actionRows.pdf} close={close} busy={busy} />

          {mode === 'designer' ? (
            <ActionSection title="Canvas" actions={actionRows.canvas} close={close} busy={busy} />
          ) : null}

          {mode === 'designer' ? (
            <ControlSection label="Schema">
              <label className="sisad-pdfme-popover-label" htmlFor="schema-type-select-compact">
                Tipo de schema
              </label>
              <select
                id="schema-type-select-compact"
                className="sisad-pdfme-popover-select"
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
              <ActionButton
                close={close}
                busy={busy}
                onClick={onAddSchema}
                label="Agregar schema"
              />
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
                />
                <span className="sisad-pdfme-popover-section-caption">
                  Acción de riesgo. Requiere confirmación.
                </span>
              </>
            ) : (
              <div className="sisad-pdfme-popover-confirmation">
                <span className="sisad-pdfme-popover-section-caption">
                  Confirmar reinicio del template actual.
                </span>
                <div className="sisad-pdfme-popover-confirmation-actions">
                  <button
                    type="button"
                    className="sisad-pdfme-popover-action is-destructive"
                    disabled={busy}
                    onClick={runAndClose(close, onReset)}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="sisad-pdfme-popover-action"
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
