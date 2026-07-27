import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { normalizeLooseText } from '../../sisad-pdfme/shared/text.ts'
import { getLabExamples } from './labs/examples/labExampleRegistry.ts'
import { getLabCoverageCounts, getLabExamplePresentation, getLabExampleSchemaStats } from './domain/labPresentation.js'
import CaseCard from './CaseCard.jsx'

const defaultExamples = getLabExamples()

const FILTERS = [
  {
    id: 'all',
    label: 'Todos',
    matches: () => true,
  },
  {
    id: 'designer',
    label: 'Diseñador',
    matches: (example) => example.defaultMode === 'designer',
  },
  {
    id: 'collaboration',
    label: 'Colaboración',
    matches: (example) => getLabExamplePresentation(example).coverage.includes('Colaboración'),
  },
  {
    id: 'multidocument',
    label: 'Multidocumento',
    matches: (example) => getLabExamplePresentation(example).coverage.includes('Multidocumento'),
  },
  {
    id: 'runtime',
    label: 'Runtime',
    matches: (example) => example.defaultMode === 'form',
  },
  {
    id: 'generator',
    label: 'Generator',
    matches: (example) => getLabExamplePresentation(example).coverage.includes('Generator'),
  },
]

const normalizeLabSearchText = (value) => normalizeLooseText(value).toLowerCase()

const LANDING_ROOT_STYLE = {
  fontFamily: "var(--font-family-ui, 'DM Sans', system-ui, sans-serif)",
  minHeight: '100vh',
  padding: 'clamp(0.75rem, 1.4vw, 1.25rem)',
  width: '100%',
  overflowX: 'clip',
  color: '#0f172a',
  background:
    'radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 30%), radial-gradient(circle at top right, rgba(244, 114, 182, 0.12), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
}

const LANDING_BACKDROP_STYLE = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: -1,
  background:
    'radial-gradient(circle at 8% 14%, rgba(59, 130, 246, 0.12), transparent 24%), radial-gradient(circle at 90% 18%, rgba(14, 165, 233, 0.1), transparent 20%), radial-gradient(circle at 55% 92%, rgba(99, 102, 241, 0.08), transparent 26%), radial-gradient(circle at 20% 84%, rgba(15, 118, 110, 0.06), transparent 24%)',
}

export default function LabLandingPage({ examples = defaultExamples } = {}) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const coverageCounts = getLabCoverageCounts(examples)
  const coverageHighlights = ['Canvas', 'Schemas', 'Colaboración', 'Multidocumento', 'Firma', 'Generator', 'Converter', 'Viewer', 'Form']
  const collaborationExamples = examples.filter((example) =>
    getLabExamplePresentation(example).coverage.includes('Colaboración'),
  ).length
  const generatorExamples = examples.filter((example) =>
    getLabExamplePresentation(example).coverage.includes('Generator'),
  ).length
  const fullSchemaExamples = examples.filter((example) => getLabExampleSchemaStats(example).isFullCoverage).length

  const query = normalizeLabSearchText(search)
  const active = FILTERS.find((filter) => filter.id === activeFilter) || FILTERS[0]
  const visibleExamples = examples.filter((example) => {
    const presentation = getLabExamplePresentation(example)
    const haystack = normalizeLabSearchText(
      [
        example.title,
        example.description,
        example.path,
        presentation.focus,
        presentation.summary,
        presentation.coverage.join(' '),
      ].join(' '),
    )

    return active.matches(example) && (query === '' || haystack.includes(query))
  })

  const filters = FILTERS.map((filter) => ({
    ...filter,
    count: examples.filter((example) => filter.matches(example)).length,
  }))

  const metrics = [
    { label: 'Ejemplos', value: examples.length },
    { label: 'Coberturas', value: coverageHighlights.filter((label) => coverageCounts.has(label)).length },
    { label: 'Schemas full', value: fullSchemaExamples },
    { label: 'Colaboración', value: collaborationExamples },
    { label: 'Generator', value: generatorExamples },
  ]

  return (
    <main
      className="sisad-pdfme-lab-landing relative isolate font-sans text-slate-900"
      data-page="landing"
      style={LANDING_ROOT_STYLE}
    >
      <div aria-hidden="true" style={LANDING_BACKDROP_STYLE} />
      <div className="sisad-pdfme-lab-landing-shell mx-auto flex w-full max-w-[94rem] flex-col gap-4">
        <section className="sisad-pdfme-lab-landing-hero rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur lg:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.92fr)] xl:items-start">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 items-center rounded-full bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  SISAD PDFME Lab
                </span>
                <span className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-600">
                  {examples.length} ejemplos
                </span>
                <span className="inline-flex h-8 items-center rounded-full border border-blue-200 bg-blue-50 px-3 text-[11px] font-semibold text-blue-700">
                  Catálogo rápido de laboratorios
                </span>
              </div>

              <h1 className="mt-4 text-[clamp(1.85rem,3vw,2.85rem)] font-black tracking-tight text-slate-950">
                Suite de laboratorios para abrir el ejemplo correcto en segundos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[0.96rem]">
                Cada tarjeta aísla un caso real de sisad-pdfme: diseñador básico, colaboración,
                multidocumento, runtime y generator. La idea es escanear, abrir y validar sin leer
                documentación pesada.
              </p>

              <dl className="mt-4 flex flex-wrap gap-2" aria-label="Resumen del laboratorio">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    <dt className="text-slate-500">{metric.label}</dt>
                    <dd className="text-slate-900">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="sisad-pdfme-lab-landing-panel grid gap-3 rounded-[1.6rem] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
              <div className="grid gap-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Explorar catálogo
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  Filtra por cobertura, cruza modos y abre el caso correcto con menos fricción.
                </p>
              </div>

              <label className="block">
                <span className="sr-only">Buscar ejemplo</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, cobertura o ruta"
                  className="h-12 w-full rounded-[1.15rem] border border-slate-200 bg-white/96 px-4 text-sm text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={[
                      'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition',
                      activeFilter === filter.id
                        ? 'border-blue-200 bg-blue-600 text-white shadow-sm shadow-blue-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700',
                    ].join(' ')}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={[
                        'inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                        activeFilter === filter.id
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500',
                      ].join(' ')}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}

                {(search || activeFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setActiveFilter('all')
                    }}
                    className="inline-flex h-9 items-center rounded-full border border-transparent px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                Casos de uso
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {visibleExamples.length} de {examples.length} ejemplos visibles. Cada tarjeta abre su
                ruta real y mantiene la descarga de plantilla.
              </p>
            </div>

            <span className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">
              Vista: tarjetas
            </span>
          </div>

          {visibleExamples.length ? (
            <div className="sisad-pdfme-lab-case-grid mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleExamples.map((example) => (
                <CaseCard key={example.id} example={example} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-500">
              No hay ejemplos que coincidan con el filtro actual.
            </div>
          )}
        </section>
      </div>
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
