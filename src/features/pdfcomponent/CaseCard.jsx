import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import LabExampleDownloadButton from './LabExampleDownloadButton.jsx'
import { getLabExamplePresentation } from './domain/labPresentation.js'

export default function CaseCard({ example }) {
  const navigate = useNavigate()

  if (!example) return null

  const presentation = getLabExamplePresentation(example)

  const handleDoubleClick = (event) => {
    if (event.target instanceof Element && event.target.closest('a, button')) {
      return
    }

    navigate(example.path)
  }

  return (
    <article
      className="sisad-pdfme-lab-card"
      aria-labelledby={`example-${example.id}`}
      onDoubleClick={handleDoubleClick}
    >
      <div className="sisad-pdfme-lab-card-topline">
        <span className="sisad-pdfme-lab-chip">{presentation.modeLabel}</span>
        <span className="sisad-pdfme-lab-card-path">{example.path}</span>
      </div>
      <div className="sisad-pdfme-lab-card-titleWrap">
        <h3 id={`example-${example.id}`}>{presentation.focus}</h3>
        <p className="sisad-pdfme-lab-card-summary">{presentation.summary}</p>
      </div>
      <div className="sisad-pdfme-lab-card-badges" aria-label={`Cobertura del ejemplo ${example.title}`}>
        {presentation.coverage.map((badge) => (
          <span key={badge} className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">
            {badge}
          </span>
        ))}
      </div>
      <p className="sisad-pdfme-lab-card-description">{example.description}</p>
      <div className="sisad-pdfme-lab-card-actions">
        <Link className="sisad-pdfme-lab-card-primary" to={example.path} aria-label={`Abrir ejemplo ${example.title}`}>
          Abrir
        </Link>
        <LabExampleDownloadButton
          className="sisad-pdfme-lab-card-secondary"
          aria-label={`Descargar plantilla ${example.title}`}
          example={example}
        >
          Descargar plantilla
        </LabExampleDownloadButton>
      </div>
    </article>
  )
}

CaseCard.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMode: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
}
