import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { cn } from '@/sisad-pdfme/ui/utils/cn'

const EMPTY_ARRAY = []
const PDF_SIZE_PROP_TYPE = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
})
const CARD_CONTENT_PROP_TYPE = PropTypes.shape({
  generatedPdfUrl: PropTypes.string,
  pdfSizes: PropTypes.arrayOf(PDF_SIZE_PROP_TYPE),
  images: PropTypes.arrayOf(PropTypes.string),
  roundtripPdfUrl: PropTypes.string,
})

const RESULTS_BODY_STYLE = {
  padding: '0.9rem',
}

const RESULTS_GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '0.9rem',
}

const RESULT_CARD_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem',
  borderRadius: '16px',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))',
  padding: '0.95rem',
  boxShadow: '0 10px 24px rgba(15,23,42,0.07)',
  backdropFilter: 'blur(12px)',
}

const RESULTS_PANEL_CLASSES =
  'rounded-[0.95rem] border border-sky-200/70 bg-white/90 shadow-md backdrop-blur-md'
const RESULTS_SUMMARY_CLASSES =
  'flex cursor-pointer list-none items-center justify-between gap-2 rounded-[0.95rem] px-2.5 py-1.5'
const RESULTS_DRAWER_CLASSES =
  'pointer-events-none absolute left-2 right-2 bottom-2 flex w-auto flex-col gap-1.5 rounded-[1rem] border border-slate-200/80 bg-white/92 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md'
const RESULTS_DRAWER_RAIL_CLASSES = 'flex flex-wrap items-center justify-between gap-2'
const RESULTS_DRAWER_BUTTON_CLASSES =
  'inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-3 py-1 text-[0.7rem] font-bold text-slate-700 shadow-sm'
const RESULTS_DRAWER_PANEL_CLASSES =
  'grid max-h-[min(240px,30dvh)] overflow-auto rounded-[0.9rem] border border-slate-200/80 bg-white/95 p-1.5 shadow-none backdrop-blur-md'
const RESULTS_DRAWER_HEADER_CLASSES = 'flex items-start justify-between gap-3'
const RESULTS_DRAWER_HEADING_CLASSES = 'grid min-w-0 gap-[0.05rem]'
const RESULTS_DRAWER_CLOSE_CLASSES =
  'inline-flex min-h-[1.6rem] items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 px-2 py-[0.08rem] text-[0.7rem] font-bold text-slate-700'
const RESULTS_BODY_CLASSES = 'p-4'
const RESULTS_GRID_CLASSES = 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5'
const RESULT_CARD_CLASSES =
  'flex flex-col gap-2.5 rounded-[16px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-md'
const RESULT_CARD_TITLE_CLASSES = 'm-0 text-[0.9rem] font-bold text-slate-800'
const RESULT_CARD_TEXT_CLASSES = 'text-[0.71rem] leading-[1.4] text-slate-600'

const RESULT_IMAGE_GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '0.75rem',
}

const RESULT_IMAGE_CARD_STYLE = {
  margin: 0,
  padding: '0.5rem',
  borderRadius: '14px',
  background: '#fff',
  border: '1px solid rgba(148, 163, 184, 0.18)',
}

const RESULT_IMAGE_CARD_IMG_STYLE = {
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: '10px',
}

const RESULT_IMAGE_CARD_FIGCAPTION_STYLE = {
  marginTop: '0.5rem',
  fontSize: '0.82rem',
  color: '#475569',
}

const RESULTS_DRAWER_STYLE = {
  position: 'absolute',
  left: '0.5rem',
  right: '0.5rem',
  bottom: '0.5rem',
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  borderRadius: '1rem',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))',
  padding: '0.45rem',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.07)',
  backdropFilter: 'blur(12px)',
  pointerEvents: 'none',
}

const RESULTS_DRAWER_RAIL_STYLE = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
}

const RESULTS_DRAWER_BUTTON_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '9999px',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  background: 'rgba(255,255,255,0.98)',
  padding: '0.375rem 0.75rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#334155',
  boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
}

const RESULTS_DRAWER_PANEL_STYLE = {
  display: 'grid',
  maxHeight: 'min(250px, 34dvh)',
  overflow: 'auto',
  borderRadius: '0.9rem',
  border: '1px solid rgba(148, 163, 184, 0.16)',
  background: 'rgba(255,255,255,0.97)',
  padding: '0.3125rem',
  boxShadow: 'none',
  backdropFilter: 'blur(12px)',
}

const RESULTS_DRAWER_HEADER_STYLE = {
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'space-between',
  gap: '0.75rem',
}

const RESULTS_DRAWER_HEADING_STYLE = {
  display: 'grid',
  gap: '0.05rem',
  minWidth: 0,
}

const RESULTS_DRAWER_CLOSE_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '1.6rem',
  padding: '0.08rem 0.48rem',
  borderRadius: '9999px',
  border: '1px solid rgba(148, 163, 184, 0.28)',
  background: 'rgba(248, 250, 252, 0.98)',
  color: '#334155',
  fontSize: '0.7rem',
  fontWeight: 700,
  cursor: 'pointer',
}

const RESULT_CARDS = [
  {
    key: 'generated-pdf',
    title: 'PDF generado',
    emptyMessage: (
      <p>
        Ejecuta <strong>Generar PDF</strong> para crear el primer artefacto.
      </p>
    ),
    render: ({ generatedPdfUrl }) =>
      generatedPdfUrl ? (
        <a href={generatedPdfUrl} target="_blank" rel="noreferrer">
          Abrir PDF generado
        </a>
      ) : null,
  },
  {
    key: 'page-sizes',
    title: 'Tamaños de página',
    emptyMessage: (
      <p>
        Ejecuta <strong>Leer tamaños</strong> para inspeccionar el documento generado.
      </p>
    ),
    render: ({ pdfSizes }) =>
      pdfSizes.length > 0 ? (
        <ul>
          {pdfSizes.map((size, index) => (
            <li key={`${Math.round(size.width)}-${Math.round(size.height)}`}>
              Página {index + 1}: {Math.round(size.width)} x {Math.round(size.height)}
            </li>
          ))}
        </ul>
      ) : null,
  },
  {
    key: 'images',
    title: 'Imágenes',
    emptyMessage: (
      <p>
        Ejecuta <strong>PDF → imágenes</strong> para obtener previsualizaciones.
      </p>
    ),
      render: ({ images }) =>
        images.length > 0 ? (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]" style={RESULT_IMAGE_GRID_STYLE}>
          {images.map((url, index) => (
            <figure key={url} className="m-0 rounded-[14px] border border-slate-200/80 bg-white p-2" style={RESULT_IMAGE_CARD_STYLE}>
              <img src={url} alt={`Vista previa generada ${index + 1}`} style={RESULT_IMAGE_CARD_IMG_STYLE} />
              <figcaption style={RESULT_IMAGE_CARD_FIGCAPTION_STYLE}>Página {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      ) : null,
  },
  {
    key: 'roundtrip',
    title: 'Roundtrip',
    emptyMessage: (
      <p>
        Ejecuta <strong>Imágenes → PDF</strong> para cerrar el ciclo.
      </p>
    ),
    render: ({ roundtripPdfUrl }) =>
      roundtripPdfUrl ? (
        <a href={roundtripPdfUrl} target="_blank" rel="noreferrer">
          Abrir PDF de ida y vuelta
        </a>
      ) : null,
  },
]

const ResultCard = ({ card, cardProps }) => {
  const body = card.render(cardProps)

  return (
    <article className={RESULT_CARD_CLASSES} style={RESULT_CARD_STYLE}>
      <h3 className={RESULT_CARD_TITLE_CLASSES}>
        {card.title}
      </h3>
      <div className={RESULT_CARD_TEXT_CLASSES}>
        {body || card.emptyMessage}
      </div>
    </article>
  )
}

ResultCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.node.isRequired,
    emptyMessage: PropTypes.node.isRequired,
    render: PropTypes.func.isRequired,
  }).isRequired,
  cardProps: CARD_CONTENT_PROP_TYPE.isRequired,
}

function ResultsCards({ generatedPdfUrl, pdfSizes, images, roundtripPdfUrl }) {
  const cardProps = { generatedPdfUrl, pdfSizes, images, roundtripPdfUrl }

  return (
    <div className={RESULTS_BODY_CLASSES} style={RESULTS_BODY_STYLE}>
      <div className={RESULTS_GRID_CLASSES} style={RESULTS_GRID_STYLE}>
        {RESULT_CARDS.map((card) => (
          <ResultCard key={card.key} card={card} cardProps={cardProps} />
        ))}
      </div>
    </div>
  )
}

export default function ResultsPanel({ generatedPdfUrl, pdfSizes = EMPTY_ARRAY, images = EMPTY_ARRAY, roundtripPdfUrl, hasGeneratedArtifacts, variant = 'inline', defaultCollapsed = false }) {
  const [isOpen, setIsOpen] = useState(() => !defaultCollapsed)
  const drawerCloseButtonRef = useRef(null)
  const isDrawer = variant === 'drawer'
  const cards = (
    <ResultsCards
      generatedPdfUrl={generatedPdfUrl}
      pdfSizes={pdfSizes}
      images={images}
      roundtripPdfUrl={roundtripPdfUrl}
    />
  )

  useEffect(() => {
    if (!isDrawer || !isOpen) return undefined

    const onWindowKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
      }
    }

    globalThis.window?.addEventListener('keydown', onWindowKeyDown, true)
    drawerCloseButtonRef.current?.focus()

    return () => {
      globalThis.window?.removeEventListener('keydown', onWindowKeyDown, true)
    }
  }, [isDrawer, isOpen])

  // Drawer: compact in-flow bar below the workspace. The closed state renders
  // no body, so it stays lightweight and never overlays the canvas.
  if (isDrawer) {
      return (
      <section
        className={cn(RESULTS_DRAWER_CLASSES)}
        style={RESULTS_DRAWER_STYLE}
        data-open={isOpen ? 'true' : 'false'}
        aria-label="Resultados"
      >
        <div className={RESULTS_DRAWER_RAIL_CLASSES} style={RESULTS_DRAWER_RAIL_STYLE}>
          <button
            type="button"
            className={cn(RESULTS_DRAWER_BUTTON_CLASSES)}
            style={RESULTS_DRAWER_BUTTON_STYLE}
            aria-expanded={isOpen}
            aria-controls="sisad-pdfme-lab-results-drawer-panel"
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className={cn('block h-2 w-2 rounded-full', hasGeneratedArtifacts ? 'bg-green-500 animate-pulse' : 'bg-slate-300')} />
            Resultados
            <span className="ml-0.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.64rem] font-normal text-slate-500">
              {hasGeneratedArtifacts ? 'Artefactos listos' : 'Sin artefactos'}
            </span>
          </button>
          {isOpen ? <span className="text-[0.66rem] font-medium text-slate-400">Abierto</span> : null}
        </div>
        {isOpen ? (
          <div
            id="sisad-pdfme-lab-results-drawer-panel"
            className={cn(RESULTS_DRAWER_PANEL_CLASSES, 'pointer-events-auto')}
            style={RESULTS_DRAWER_PANEL_STYLE}
            role="dialog"
            aria-modal="false"
            aria-label="Panel de resultados"
            tabIndex={-1}
          >
            <div className={RESULTS_DRAWER_HEADER_CLASSES} style={RESULTS_DRAWER_HEADER_STYLE}>
        <div className={RESULTS_DRAWER_HEADING_CLASSES} style={RESULTS_DRAWER_HEADING_STYLE}>
                <span className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-slate-500">Resultados</span>
                <strong className="text-[0.88rem] leading-tight text-slate-900">Artefactos del laboratorio</strong>
              </div>
              <button
                type="button"
                ref={drawerCloseButtonRef}
                className={cn(RESULTS_DRAWER_CLOSE_CLASSES)}
                style={RESULTS_DRAWER_CLOSE_STYLE}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsOpen(false)
                  }
                }}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar resultados"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-1.5">{cards}</div>
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <details
      className={cn(RESULTS_PANEL_CLASSES)}
      data-variant={variant}
      aria-labelledby="lab-results-title"
    >
      <summary
        className={cn(RESULTS_SUMMARY_CLASSES)}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 id="lab-results-title">Resultados</h2>
          <p>{hasGeneratedArtifacts ? 'Artefactos listos para revisar o descargar.' : 'Abre esta sección para revisar salidas de generación y conversión.'}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.68rem] font-semibold text-slate-500">{hasGeneratedArtifacts ? 'Con artefactos' : 'Cerrado'}</span>
      </summary>
      {cards}
    </details>
  )
}

ResultsCards.propTypes = {
  generatedPdfUrl: PropTypes.string,
  pdfSizes: PropTypes.arrayOf(PDF_SIZE_PROP_TYPE),
  images: PropTypes.arrayOf(PropTypes.string),
  roundtripPdfUrl: PropTypes.string,
}

ResultsPanel.propTypes = {
  generatedPdfUrl: PropTypes.string,
  pdfSizes: PropTypes.arrayOf(PDF_SIZE_PROP_TYPE),
  images: PropTypes.arrayOf(PropTypes.string),
  roundtripPdfUrl: PropTypes.string,
  hasGeneratedArtifacts: PropTypes.bool,
  variant: PropTypes.oneOf(['inline', 'drawer']),
  defaultCollapsed: PropTypes.bool,
}
