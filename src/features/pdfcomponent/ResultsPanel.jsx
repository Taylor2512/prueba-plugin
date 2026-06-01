import React from 'react'
import PropTypes from 'prop-types'

const EMPTY_ARRAY = []

export default function ResultsPanel({ generatedPdfUrl, pdfSizes = EMPTY_ARRAY, images = EMPTY_ARRAY, roundtripPdfUrl, hasGeneratedArtifacts }) {
  return (
    <details className="sisad-pdfme-lab-results" aria-labelledby="lab-results-title">
      <summary className="sisad-pdfme-lab-results-summary">
        <div className="sisad-pdfme-lab-section-heading sisad-pdfme-lab-section-heading-tight">
          <h2 id="lab-results-title">Resultados</h2>
          <p>{hasGeneratedArtifacts ? 'Artefactos listos para revisar o descargar.' : 'Abre esta sección para revisar salidas de generación y conversión.'}</p>
        </div>
        <span className="sisad-pdfme-lab-results-badge">{hasGeneratedArtifacts ? 'Con artefactos' : 'Colapsado'}</span>
      </summary>

      <div className="sisad-pdfme-lab-results-body">
        <div className="sisad-pdfme-lab-results-grid">
          <article className="sisad-pdfme-lab-result-card">
            <h3>PDF generado</h3>
            {generatedPdfUrl ? (
              <a href={generatedPdfUrl} target="_blank" rel="noreferrer">Abrir PDF generado</a>
            ) : (
              <p>Ejecuta <strong>Generar PDF</strong> para crear el primer artefacto.</p>
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
              <p>Ejecuta <strong>Leer tamaños</strong> para inspeccionar el documento generado.</p>
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
              <p>Ejecuta <strong>PDF → imágenes</strong> para obtener previsualizaciones.</p>
            )}
          </article>

          <article className="sisad-pdfme-lab-result-card">
            <h3>Roundtrip</h3>
            {roundtripPdfUrl ? (
              <a href={roundtripPdfUrl} target="_blank" rel="noreferrer">Abrir PDF de ida y vuelta</a>
            ) : (
              <p>Ejecuta <strong>Imágenes → PDF</strong> para cerrar el ciclo.</p>
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
