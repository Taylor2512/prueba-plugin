import React from 'react'
import PropTypes from 'prop-types'
import { getLabExamples } from './examples/labExamples.js'
import { Hero, CaseGrid } from '../implements'

const defaultExamples = getLabExamples()

export default function LabLandingPage({ examples = defaultExamples } = {}) {
  const metrics = [
    { label: 'Ejemplos', value: examples.length },
    { label: 'Ruta base', value: '/lab' },
    { label: 'Runtime', value: 'BrowserRouter' },
  ]

  return (
    <main className="sisad-pdfme-lab-landing" data-page="landing">
      <Hero
        kicker="SISAD PDFME Lab"
        title="Rutas de ejemplo para probar casos de uso reales"
        description={
          "Cada ruta monta un escenario independiente de sisad-pdfme para evitar mezclar estado entre flujos de edición, colaboración y generación."
        }
        metrics={metrics}
      />

      <section className="sisad-pdfme-lab-card-grid" aria-labelledby="lab-examples-title">
        <div className="sisad-pdfme-lab-section-heading">
          <h2 id="lab-examples-title">Casos de uso</h2>
          <p>Selecciona un ejemplo para abrir el canvas con su propio preset y modo inicial.</p>
        </div>

        <CaseGrid examples={examples} />
      </section>
    </main>
  )
}

LabLandingPage.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      defaultMode: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
}
