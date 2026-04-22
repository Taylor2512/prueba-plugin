import React from 'react'
import PropTypes from 'prop-types'

const EMPTY_ARRAY = []

export default function ResultsPanel({ generatedPdfUrl, pdfSizes = EMPTY_ARRAY, images = EMPTY_ARRAY, roundtripPdfUrl, hasGeneratedArtifacts }) {
  return (
    <details className="sisad-pdfme-lab-results" open={hasGeneratedArtifacts} aria-labelledby="lab-results-title">
      <summary className="sisad-pdfme-lab-results-summary">
        <div className="sisad-pdfme-lab-section-heading sisad-pdfme-lab-section-heading-tight">
          <h2 id="lab-results-title">Resultados</h2>
        </div>
        <span className="sisad-pdfme-lab-results-badge">{hasGeneratedArtifacts ? 'Visible' : 'Oculto'}</span>
      </summary>

      <div className="sisad-pdfme-lab-results-body">
        <div className="sisad-pdfme-lab-results-grid">
          <article className="sisad-pdfme-lab-result-card">
            <h3>PDF generado</h3>
            {generatedPdfUrl ? (
              <a href={generatedPdfUrl} target="_blank" rel="noreferrer">Abrir PDF generado</a>
            ) : (
              <p>No hay PDF generado todavía.</p>
            )}
          </article>

          <article className="sisad-pdfme-lab-result-card">
            <h3>Tamaños de página</h3>
            {pdfSizes.length > 0 ? (
              <ul>
                {pdfSizes.map((size, index) => (
                  <li key={`${Math.round(size.width)}-${Math.round(size.height)}`}>
                    Página {index + 1}: {Math.round(size.width)} x {Math.round(size.height)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aún no se ha ejecutado pdf2size.</p>
            )}
          </article>

          <article className="sisad-pdfme-lab-result-card">
            <h3>Imágenes</h3>
            {images.length > 0 ? (
              <div className="sisad-pdfme-lab-image-grid">
                {images.map((url, index) => (
                  <figure key={url} className="sisad-pdfme-lab-image-card">
                    <img src={url} alt={`Vista previa generada ${index + 1}`} />
                    <figcaption>Página {index + 1}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p>No hay imágenes generadas todavía.</p>
            )}
          </article>

          <article className="sisad-pdfme-lab-result-card">
            <h3>Roundtrip</h3>
            {roundtripPdfUrl ? (
              <a href={roundtripPdfUrl} target="_blank" rel="noreferrer">Abrir PDF de ida y vuelta</a>
            ) : (
              <p>Aún no se ejecutó img2pdf.</p>
            )}
          </article>
        </div>
      </div>
    </details>
  )
}

ResultsPanel.propTypes = {
  generatedPdfUrl: PropTypes.string,
  pdfSizes: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
  ),
  images: PropTypes.arrayOf(PropTypes.string),
  roundtripPdfUrl: PropTypes.string,
  hasGeneratedArtifacts: PropTypes.bool,
}
