import React from 'react'
import PropTypes from 'prop-types'
import CaseCard from '../CaseCard.jsx'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

// ── IconButton ────────────────────────────────────────────────────────────────

export function IconButton({
  label,
  onClick,
  icon,
  className = '',
  disabled = false,
  isActive = false,
  title,
  ariaHasPopup,
  ariaExpanded,
}) {
  const classNameList = joinClasses('sisad-pdfme-compact-icon-button', isActive && 'is-active', className)

  return (
    <button
      type="button"
      className={classNameList}
      aria-label={label}
      title={title || label}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ?? <span style={{ fontWeight: 700 }}>{label?.[0] || '?'}</span>}
    </button>
  )
}

IconButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  title: PropTypes.string,
  ariaHasPopup: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  ariaExpanded: PropTypes.bool,
}

// ── Hero ──────────────────────────────────────────────────────────────────────

const EMPTY_METRICS = []

export function Hero({ kicker, title, description, metrics = EMPTY_METRICS }) {
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

// ── CaseGrid ──────────────────────────────────────────────────────────────────

const EMPTY_EXAMPLES = []

export function CaseGrid({ examples = EMPTY_EXAMPLES }) {
  return (
    <div className="sisad-pdfme-lab-card-list">
      {examples.map((ex) => (
        <CaseCard key={ex.id} example={ex} />
      ))}
    </div>
  )
}

CaseGrid.propTypes = {
  examples: PropTypes.arrayOf(PropTypes.object),
}
