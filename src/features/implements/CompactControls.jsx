import React from 'react'
import PropTypes from 'prop-types'
import { Settings2 } from 'lucide-react'
import PopoverMenu from './PopoverMenu.jsx'

const EMPTY_ARRAY = []

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
}) {
  const runAndClose = (close, action) => () => {
    close()
    if (typeof action === 'function') action()
  }

  const applyMode = (close, nextMode) => () => {
    close()
    if (typeof onModeChange === 'function') onModeChange(nextMode)
  }

  return (
    <PopoverMenu label="Controles" icon={<Settings2 size={16} />} align="start">
      {({ close }) => (
        <div className="sisad-pdfme-compact-controls-panel">
          <section className="sisad-pdfme-popover-section">
            <span className="sisad-pdfme-popover-section-label">Modo</span>
            <div className="sisad-pdfme-popover-grid">
              <button
                type="button"
                className={['sisad-pdfme-popover-action', mode === 'designer' ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={applyMode(close, 'designer')}
              >
                Diseñador
              </button>
              <button
                type="button"
                className={['sisad-pdfme-popover-action', mode === 'form' ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={applyMode(close, 'form')}
              >
                Formulario
              </button>
              <button
                type="button"
                className={['sisad-pdfme-popover-action', mode === 'viewer' ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={applyMode(close, 'viewer')}
              >
                Visor
              </button>
            </div>
          </section>

          <section className="sisad-pdfme-popover-section">
            <span className="sisad-pdfme-popover-section-label">Generación</span>
            <button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={runAndClose(close, onGenerate)}>
              Generar PDF
            </button>
            <button type="button" className="sisad-pdfme-popover-action" disabled={busy || !hasGeneratedPdf} onClick={runAndClose(close, onPdf2Size)}>
              Leer tamaños
            </button>
            <button type="button" className="sisad-pdfme-popover-action" disabled={busy || !hasGeneratedPdf} onClick={runAndClose(close, onPdf2Img)}>
              PDF → imágenes
            </button>
            <button type="button" className="sisad-pdfme-popover-action" disabled={busy || !hasImages} onClick={runAndClose(close, onImg2Pdf)}>
              Imágenes → PDF
            </button>
          </section>

          {mode === 'designer' ? (
            <section className="sisad-pdfme-popover-section">
              <span className="sisad-pdfme-popover-section-label">Canvas</span>
              <button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={runAndClose(close, onAddPage)}>
                Agregar página
              </button>
              <button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={runAndClose(close, onFitPage)}>
                Ajustar a página
              </button>
              <button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={runAndClose(close, onFitWidth)}>
                Ajustar al ancho
              </button>
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
              <button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={runAndClose(close, onAddSchema)}>
                Agregar schema
              </button>
            </section>
          ) : null}

          <section className="sisad-pdfme-popover-section sisad-pdfme-popover-section-quiet">
            <span className="sisad-pdfme-popover-section-label">Sesión</span>
            <button type="button" className="sisad-pdfme-popover-action is-destructive" disabled={busy} onClick={runAndClose(close, onReset)}>
              Reiniciar template
            </button>
          </section>
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
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  schemaType: PropTypes.string,
  onSchemaTypeChange: PropTypes.func,
  busy: PropTypes.bool,
  hasGeneratedPdf: PropTypes.bool,
  hasImages: PropTypes.bool,
}
