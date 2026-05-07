import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import LabExampleDownloadButton from './LabExampleDownloadButton.jsx'

export default function CaseCard({ example }) {
  const navigate = useNavigate()

  if (!example) return null

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
        <span className="sisad-pdfme-lab-chip">{example.defaultMode}</span>
        <span className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">{example.path}</span>
      </div>
      <h3 id={`example-${example.id}`}>{example.title}</h3>
      <p>{example.description}</p>
      <div className="sisad-pdfme-lab-card-actions">
        <Link className="sisad-pdfme-lab-card-link" to={example.path} aria-label={`Abrir ejemplo ${example.title}`}>
          Abrir ejemplo
        </Link>
        <LabExampleDownloadButton
          className="sisad-pdfme-lab-card-link"
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
