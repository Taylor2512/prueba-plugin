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
        <div className="sisad-pdfme-lab-image-grid">
          {images.map((url, index) => (
            <figure key={url} className="sisad-pdfme-lab-image-card">
              <img src={url} alt={`Vista previa generada ${index + 1}`} />
              <figcaption>Página {index + 1}</figcaption>
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
    <article className="sisad-pdfme-lab-result-card">
      <h3>{card.title}</h3>
      {body || card.emptyMessage}
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
    <div className="sisad-pdfme-lab-results-body">
      <div className="sisad-pdfme-lab-results-grid">
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

  // Drawer: floating pill when closed, compact overlay panel when open. The
  // closed state renders NO body so it never covers the document/toolbar.
  if (isDrawer) {
    return (
      <section
        className={cn('sisad-pdfme-lab-results-drawer fixed bottom-3 left-3 z-[70] w-[min(32rem,calc(100vw-1.5rem))]')}
        data-open={isOpen ? 'true' : 'false'}
        aria-label="Resultados"
      >
        <button
          type="button"
          className={cn('sisad-pdfme-lab-results-pill inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[0.72rem] font-semibold text-slate-700 shadow-md backdrop-blur-md')}
          aria-expanded={isOpen}
          aria-controls="sisad-pdfme-lab-results-drawer-panel"
          onClick={() => setIsOpen((v) => !v)}
        >
          Resultados
          <span className="sisad-pdfme-lab-results-badge">
            {hasGeneratedArtifacts ? 'Con artefactos' : 'Colapsado'}
          </span>
        </button>
        {isOpen ? (
          <div
            id="sisad-pdfme-lab-results-drawer-panel"
            className={cn('sisad-pdfme-lab-results-drawer-panel mt-2 grid max-h-[min(300px,38dvh)] overflow-auto rounded-[0.95rem] border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-md')}
            role="dialog"
            aria-modal="false"
            aria-label="Panel de resultados"
            tabIndex={-1}
          >
            <div className="sisad-pdfme-lab-results-drawer-header">
              <div className="sisad-pdfme-lab-results-drawer-heading">
                <span className="sisad-pdfme-lab-summary-label">Resultados</span>
                <strong>Artefactos del laboratorio</strong>
              </div>
              <button
                type="button"
                ref={drawerCloseButtonRef}
                className={cn('sisad-pdfme-lab-results-close inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.72rem] font-semibold text-slate-700 hover:bg-slate-100')}
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
            <div className="sisad-pdfme-lab-results-drawer-body">{cards}</div>
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <details
      className={cn('sisad-pdfme-lab-results rounded-[0.95rem] border border-slate-200 bg-white/90 shadow-lg backdrop-blur-md')}
      data-variant={variant}
      aria-labelledby="lab-results-title"
    >
      <summary
        className={cn('sisad-pdfme-lab-results-summary flex cursor-pointer list-none items-center justify-between gap-2 rounded-[0.95rem] px-2.5 py-1.5')}
      >
        <div className="sisad-pdfme-lab-section-heading sisad-pdfme-lab-section-heading-tight">
          <h2 id="lab-results-title">Resultados</h2>
          <p>{hasGeneratedArtifacts ? 'Artefactos listos para revisar o descargar.' : 'Abre esta sección para revisar salidas de generación y conversión.'}</p>
        </div>
        <span className="sisad-pdfme-lab-results-badge">{hasGeneratedArtifacts ? 'Con artefactos' : 'Colapsado'}</span>
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
