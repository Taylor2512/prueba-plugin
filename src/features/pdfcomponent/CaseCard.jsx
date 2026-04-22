import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function CaseCard({ example }) {
  if (!example) return null

  return (
    <article className="sisad-pdfme-lab-card" aria-labelledby={`example-${example.id}`}>
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
