import React from 'react'
import PropTypes from 'prop-types'

const EMPTY_ARRAY = []

export default function Hero({ kicker, title, description, metrics = EMPTY_ARRAY }) {
  return (
    <section className="sisad-pdfme-lab-hero" aria-labelledby="lab-hero-title">
      <div className="sisad-pdfme-lab-hero-copy">
        {kicker ? <p className="sisad-pdfme-lab-kicker">{kicker}</p> : null}
        <h1 id="lab-hero-title">{title}</h1>
        {description ? <p className="sisad-pdfme-lab-hero-text">{description}</p> : null}
      </div>

      <dl className="sisad-pdfme-lab-hero-metrics" aria-label="Resumen del laboratorio">
        {metrics.map((m) => (
          <div key={m.label} className="sisad-pdfme-lab-hero-metric">
            <dt className="sisad-pdfme-lab-summary-label">{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

Hero.propTypes = {
  kicker: PropTypes.node,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    }),
  ),
}
