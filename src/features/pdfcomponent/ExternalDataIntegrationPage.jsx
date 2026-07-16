import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { cloneDeep } from '@sisad-pdfme/common'
import { getLabExampleById } from './labs/examples/labExampleRegistry.ts'
import PdfmeLabPage from './PdfmeLabPage.jsx'

const EXAMPLE_ID = 'multi-document-routing'

const loadAsyncExample = async () =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => {
      resolve(cloneDeep(getLabExampleById(EXAMPLE_ID)))
    }, 250)
  })

export default function ExternalDataIntegrationPage() {
  const [example, setExample] = useState(null)
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  const [mode, setMode] = useState('designer')
  const [activeRecipientId, setActiveRecipientId] = useState('')

  const hydrate = useCallback(async () => {
    setLoading(true)
    const nextExample = await loadAsyncExample()
    setExample(nextExample)
    setMode(nextExample?.defaultMode || 'designer')
    setActiveRecipientId(
      nextExample?.collaboration?.activeUserId ||
        nextExample?.collaboration?.users?.[0]?.id ||
        '',
    )
    setRevision((prev) => prev + 1)
    setLoading(false)
  }, [])

  const visibleExample = useMemo(
    () =>
      example
        ? {
            ...example,
            defaultMode: mode,
            collaboration: {
              ...example.collaboration,
              activeUserId: activeRecipientId || example.collaboration?.activeUserId || '',
            },
          }
        : null,
    [activeRecipientId, example, mode],
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (loading || !example) {
    return (
      <div className="sisad-pdfme-lab-page flex min-h-screen items-center justify-center text-slate-600">
        <p>Cargando datos externos...</p>
      </div>
    )
  }

  return (
    <div className="sisad-pdfme-lab-page" data-page="external-data-integration">
      <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm"
          aria-label="Reinyectar datos externos"
          onClick={hydrate}
        >
          Reinyectar datos externos
        </button>
        <button type="button" className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm" onClick={() => setMode('designer')}>
          Diseñador
        </button>
        <button type="button" className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm" onClick={() => setMode('form')}>
          Formulario
        </button>
        <button type="button" className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm" onClick={() => setMode('viewer')}>
          Visor
        </button>
        <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <span>Usuario activo</span>
          <select
            aria-label="Usuario activo externo"
            className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
            value={activeRecipientId}
            onChange={(event) => setActiveRecipientId(event.target.value)}
          >
            {(example.collaboration?.users || []).map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs font-semibold text-slate-500">Carga asíncrona de recipients, documentos y config</span>
      </div>
      <PdfmeLabPage key={`${revision}-${mode}-${activeRecipientId}`} example={visibleExample} />
    </div>
  )
}
