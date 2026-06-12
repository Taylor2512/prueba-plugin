import React from 'react'
import PropTypes from 'prop-types'
import { getLabExamples } from './examples/labExamples.js'
import { Hero, CaseGrid } from './ui/primitives.jsx'
import { getLabCoverageCounts, getLabExamplePresentation, getLabExampleSchemaStats } from './domain/labPresentation.js'

const defaultExamples = getLabExamples()

export default function LabLandingPage({ examples = defaultExamples } = {}) {
  const coverageCounts = getLabCoverageCounts(examples)
  const coverageHighlights = ['Canvas', 'Schemas', 'Colaboración', 'Multidocumento', 'Firma', 'Generator', 'Converter', 'Viewer', 'Form']
  const collaborationExamples = examples.filter((example) =>
    getLabExamplePresentation(example).coverage.includes('Colaboración'),
  ).length
  const generatorExamples = examples.filter((example) =>
    getLabExamplePresentation(example).coverage.includes('Generator'),
  ).length
  const fullSchemaExamples = examples.filter((example) => getLabExampleSchemaStats(example).isFullCoverage).length

  const metrics = [
    { label: 'Ejemplos', value: examples.length },
    { label: 'Coberturas', value: coverageHighlights.filter((label) => coverageCounts.has(label)).length },
    { label: 'Schemas full', value: fullSchemaExamples },
    { label: 'Colaboración', value: collaborationExamples },
    { label: 'Generator', value: generatorExamples },
  ]

  return (
    <main className="sisad-pdfme-lab-landing" data-page="landing">
      <Hero
        kicker="SISAD PDFME Lab"
        title="Suite de laboratorio para validar casos reales del editor PDF"
        description="Cada ruta aísla un escenario funcional de sisad-pdfme para probar edición, colaboración, firma, multidocumento y generación sin mezclar estado."
        metrics={metrics}
      />

      <section className="sisad-pdfme-lab-card-grid" aria-labelledby="lab-examples-title">
        <div className="sisad-pdfme-lab-section-heading">
          <h2 id="lab-examples-title">Casos de uso</h2>
          <p>Selecciona un ejemplo para abrir un flujo real con su cobertura principal y su plantilla asociada.</p>
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
