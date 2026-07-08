import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import LabExampleDownloadButton from './LabExampleDownloadButton.jsx'
import { getLabExamplePresentation, getLabExampleSchemaStats } from './domain/labPresentation.js'

export default function CaseCard({ example }) {
  const navigate = useNavigate()

  if (!example) return null

  const presentation = getLabExamplePresentation(example)
  const schemaStats = getLabExampleSchemaStats(example)
  const coveragePills = presentation.coverage.slice(0, 4)

  const handleDoubleClick = (event) => {
    if (event.target instanceof Element && event.target.closest('a, button')) {
      return
    }

    navigate(example.path)
  }

  return (
    <article
      className={[
        'sisad-pdfme-lab-card group flex h-full min-h-[15rem] flex-col rounded-[1.7rem] border border-slate-200/80 bg-white/95 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40',
        presentation.recommended ? 'border-blue-200 ring-1 ring-blue-100' : '',
      ].filter(Boolean).join(' ')}
      aria-labelledby={`example-${example.id}`}
      data-mode={example.defaultMode}
      data-schema-coverage={schemaStats.isFullCoverage ? 'full' : 'partial'}
      data-recommended={presentation.recommended ? 'true' : 'false'}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 opacity-70" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center rounded-full bg-blue-50 px-3 text-[11px] font-bold tracking-wide text-blue-700">
          {presentation.modeLabel}
        </span>
        <span className="inline-flex h-7 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-600">
          {schemaStats.usedSchemaTypes}/{schemaStats.registeredSchemaTypes} schemas
        </span>
        {presentation.recommended ? (
          <span className="inline-flex h-7 items-center rounded-full bg-emerald-50 px-3 text-[11px] font-bold text-emerald-700">
            Recomendado
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid gap-1.5">
        <h3
          id={`example-${example.id}`}
          className="text-[1.02rem] font-extrabold tracking-tight text-slate-950"
        >
          {presentation.focus}
        </h3>
        <p className="sisad-pdfme-lab-card-summary text-sm leading-5 text-slate-600">
          {presentation.summary}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label={`Cobertura del ejemplo ${example.title}`}>
        {coveragePills.map((badge) => (
          <span
            key={badge}
            className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-semibold text-slate-600"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-sm font-bold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-600"
          to={example.path}
          aria-label={`Abrir ejemplo ${example.title}`}
        >
          Abrir
        </Link>
        <details className="relative shrink-0">
          <summary
            className="flex h-10 w-10 list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-black text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label={`Más acciones para ${example.title}`}
            title="Más acciones"
          >
            <span aria-hidden="true">⋯</span>
          </summary>
          <div className="absolute right-0 top-11 z-20 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
            <div className="grid gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Ruta
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-700">{example.path}</p>
              </div>
              <p className="text-xs leading-5 text-slate-500">{example.description}</p>
              <LabExampleDownloadButton
                className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                aria-label={`Descargar plantilla ${example.title}`}
                example={example}
              >
                Descargar plantilla
              </LabExampleDownloadButton>
            </div>
          </div>
        </details>
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
