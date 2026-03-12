import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getInputFromTemplate, cloneDeep } from '@pdfme/common'
import { Designer, Form, Viewer, DesignerEngineBuilder } from '@pdfme/ui'
import { generate } from '@pdfme/generator'
import { flatSchemaPlugins, builtInSchemaDefinitions } from '@pdfme/schemas'
import { pdf2img, pdf2size, img2pdf } from '@pdfme/converter'
import { createInitialPdfmeTemplate } from './template'
import { createObjectUrl, revokeObjectUrls, downloadUrl } from './utils/binary'

const MODES = ['designer', 'form', 'viewer']
const UX_MODES = ['default', 'canvas-first']
const UX_MODE_STORAGE_KEY = 'pdfme.lab.ux-mode'
const getErrorMessage = (error) => (error instanceof Error ? error.message : 'Error inesperado')

export default function PdfmeLabPage() {
  const containerRef = useRef(null)
  const instanceRef = useRef(null)
  const generatedPdfUrlRef = useRef('')
  const roundtripPdfUrlRef = useRef('')
  const imagesRef = useRef([])

  const initialTemplate = useMemo(() => createInitialPdfmeTemplate(), [])
  const [template, setTemplate] = useState(initialTemplate)
  const [inputs, setInputs] = useState(getInputFromTemplate(initialTemplate))
  const [mode, setMode] = useState('designer')
  const [schemaType, setSchemaType] = useState('text')
  const [uxMode, setUxMode] = useState('canvas-first')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('Listo para probar funcionalidades de pdfme')

  const [generatedPdfUrl, setGeneratedPdfUrl] = useState('')
  const [generatedPdfBytes, setGeneratedPdfBytes] = useState(null)
  const [pdfSizes, setPdfSizes] = useState([])
  const [images, setImages] = useState([])
  const [roundtripPdfUrl, setRoundtripPdfUrl] = useState('')
  const [isControlPanelPinned, setIsControlPanelPinned] = useState(false)
  const canRunDesignerActions = mode === 'designer' && !busy

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const modeFromQuery = searchParams.get('ux')
    const modeFromStorage = window.localStorage.getItem(UX_MODE_STORAGE_KEY)
    const candidate = [modeFromQuery, modeFromStorage].find((value) => UX_MODES.includes(String(value)))
    if (candidate) {
      setUxMode(candidate)
      return
    }
    setUxMode('canvas-first')
  }, [])

  useEffect(() => {
    if (!UX_MODES.includes(uxMode)) return
    window.localStorage.setItem(UX_MODE_STORAGE_KEY, uxMode)
  }, [uxMode])

  const clearDerivedResults = ({ clearGeneratedPdf = false } = {}) => {
    if (clearGeneratedPdf) {
      setGeneratedPdfBytes(null)
      if (generatedPdfUrlRef.current) {
        URL.revokeObjectURL(generatedPdfUrlRef.current)
        generatedPdfUrlRef.current = ''
      }
      setGeneratedPdfUrl('')
    }

    setPdfSizes([])
    revokeObjectUrls(imagesRef.current)
    imagesRef.current = []
    setImages([])

    if (roundtripPdfUrlRef.current) {
      URL.revokeObjectURL(roundtripPdfUrlRef.current)
      roundtripPdfUrlRef.current = ''
    }
    setRoundtripPdfUrl('')
  }

  const schemaCatalog = useMemo(() => {
    return builtInSchemaDefinitions
      .slice()
      .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const commonProps = {
      domContainer: containerRef.current,
      template: cloneDeep(template),
      plugins: flatSchemaPlugins,
      options: { lang: 'es' },
    }

    if (mode === 'designer') {
      const options = new DesignerEngineBuilder()
        .withCanvasFeatureToggles({
          guides: true,
          snapLines: true,
          padding: true,
          mask: false,
        })
        .buildOptions(commonProps.options)

      const designer = new Designer({ ...commonProps, options })
      window.requestAnimationFrame(() => {
        if (designer && typeof designer.fitToPage === 'function') {
          designer.fitToPage()
        }
      })
      designer.onChangeTemplate((nextTemplate) => {
        setTemplate(nextTemplate)
      })
      designer.onPageChange((pageInfo) => {
        const current = Math.max(1, Number(pageInfo?.currentPage || 1))
        const total = Math.max(1, Number(pageInfo?.totalPages || 1))
        setStatus(`Página ${current} / ${total}`)
      })
      instanceRef.current = designer
    }

    if (mode === 'form') {
      const form = new Form({ ...commonProps, inputs: cloneDeep(inputs) })
      form.onChangeInput(({ index, name, value }) => {
        setInputs((prev) => {
          const next = cloneDeep(prev)
          if (!next[index]) next[index] = {}
          next[index][name] = value
          return next
        })
      })
      instanceRef.current = form
    }

    if (mode === 'viewer') {
      const viewer = new Viewer({ ...commonProps, inputs: cloneDeep(inputs) })
      instanceRef.current = viewer
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    const instance = instanceRef.current
    if (!instance) return
    instance.updateTemplate(cloneDeep(template))
  }, [template])

  useEffect(() => {
    const instance = instanceRef.current
    if (!instance || mode === 'designer') return
    instance.setInputs(cloneDeep(inputs))
  }, [inputs, mode])

  useEffect(() => {
    generatedPdfUrlRef.current = generatedPdfUrl
  }, [generatedPdfUrl])

  useEffect(() => {
    roundtripPdfUrlRef.current = roundtripPdfUrl
  }, [roundtripPdfUrl])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      if (generatedPdfUrlRef.current) URL.revokeObjectURL(generatedPdfUrlRef.current)
      if (roundtripPdfUrlRef.current) URL.revokeObjectURL(roundtripPdfUrlRef.current)
      revokeObjectUrls(imagesRef.current)
    }
  }, [])

  const runDesignerAction = (action) => {
    if (!instanceRef.current || mode !== 'designer') return

    const designer = instanceRef.current
    if (action === 'undo') designer.undo()
    if (action === 'redo') designer.redo()
    if (action === 'fitWidth') designer.fitToWidth()
    if (action === 'fitPage') designer.fitToPage()
    if (action === 'nextPage') designer.nextPage()
    if (action === 'prevPage') designer.prevPage()
    if (action === 'toggleSidebar') designer.toggleSidebar()
    if (action === 'addSchema') designer.addSchemaByType(schemaType)
    if (action === 'prefillDemo') {
      designer.applyExternalPrefill(
        {
          full_name: 'Taylor Demo',
          email: 'taylor@example.com',
          notes: 'Prefill aplicado desde runtime API',
        },
        'name',
      )
    }
  }

  const addBlankPage = () => {
    if (busy) return
    let nextPage = 1
    setTemplate((prev) => {
      const nextSchemas = Array.isArray(prev.schemas) ? [...prev.schemas, []] : [[]]
      nextPage = nextSchemas.length
      return { ...prev, schemas: nextSchemas }
    })

    window.setTimeout(() => {
      const designer = instanceRef.current
      if (mode === 'designer' && designer && typeof designer.setPage === 'function') {
        designer.setPage(nextPage)
      }
    }, 0)
    setStatus(`Página ${nextPage} creada`)
  }

  const generatePdf = async () => {
    setBusy(true)
    setStatus('Generando PDF...')
    clearDerivedResults()

    try {
      const pdfBytes = await generate({
        template,
        inputs,
        plugins: flatSchemaPlugins,
      })

      if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl)
      const nextUrl = createObjectUrl(pdfBytes, 'application/pdf')
      setGeneratedPdfBytes(pdfBytes)
      setGeneratedPdfUrl(nextUrl)
      setStatus('PDF generado correctamente')
    } catch (error) {
      setGeneratedPdfBytes(null)
      setStatus(`Error al generar PDF: ${getErrorMessage(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const runPdf2Size = async () => {
    if (!generatedPdfBytes) return

    setBusy(true)
    setStatus('Leyendo tamaño de páginas...')

    try {
      const sizes = await pdf2size(generatedPdfBytes)
      setPdfSizes(sizes)
      setStatus('Tamaños leídos correctamente')
    } catch (error) {
      setStatus(`Error en pdf2size: ${getErrorMessage(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const runPdf2Img = async () => {
    if (!generatedPdfBytes) return

    setBusy(true)
    setStatus('Convirtiendo PDF a imágenes...')

    try {
      const imageBuffers = await pdf2img(generatedPdfBytes, {
        scale: 1,
        imageType: 'png',
      })

      revokeObjectUrls(images)
      const imageUrls = imageBuffers.map((buffer) => createObjectUrl(buffer, 'image/png'))
      setImages(imageUrls)
      if (roundtripPdfUrlRef.current) {
        URL.revokeObjectURL(roundtripPdfUrlRef.current)
        roundtripPdfUrlRef.current = ''
      }
      setRoundtripPdfUrl('')
      setStatus(`pdf2img completado: ${imageUrls.length} imagen(es)`)
    } catch (error) {
      setStatus(`Error en pdf2img: ${getErrorMessage(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const runImg2Pdf = async () => {
    if (images.length === 0) return

    setBusy(true)
    setStatus('Convirtiendo imágenes a PDF...')

    try {
      const buffers = await Promise.all(images.map(async (url) => fetch(url).then((r) => r.arrayBuffer())))

      const pdfBuffer = await img2pdf(buffers, {
        margin: [10, 10, 10, 10],
        size: { width: 210, height: 297 },
      })

      if (roundtripPdfUrl) URL.revokeObjectURL(roundtripPdfUrl)
      const nextRoundtripUrl = createObjectUrl(pdfBuffer, 'application/pdf')
      setRoundtripPdfUrl(nextRoundtripUrl)
      setStatus('img2pdf completado')
    } catch (error) {
      setStatus(`Error en img2pdf: ${getErrorMessage(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const resetTemplate = () => {
    const nextTemplate = createInitialPdfmeTemplate()
    setTemplate(nextTemplate)
    setInputs(getInputFromTemplate(nextTemplate))
    clearDerivedResults({ clearGeneratedPdf: true })
    setStatus('Template reiniciado')
  }

  const handleModeChange = (nextMode) => {
    window.setTimeout(() => {
      setMode(nextMode)
    }, 0)
  }

  return (
    <main className="pdfme-page" data-ux-mode={uxMode}>
      <header className="pdfme-header">
        <div>
          <h1>Laboratorio PDFME</h1>
          <p>
            Esta página agrupa funcionalidades documentadas: UI (`Designer`, `Form`, `Viewer`),
            generación (`generate`) y conversión (`pdf2size`, `pdf2img`, `img2pdf`).
          </p>
        </div>
      </header>

      <section className="pdfme-grid">
        <div className={`pdfme-panel-dock ${isControlPanelPinned ? 'is-pinned' : ''}`}>
          <button
            type="button"
            className="pdfme-panel-trigger"
            aria-expanded={isControlPanelPinned}
            aria-controls="pdfme-control-panel"
            onClick={() => setIsControlPanelPinned((prev) => !prev)}
            title={isControlPanelPinned ? 'Ocultar controles' : 'Mostrar controles'}
          >
            {isControlPanelPinned ? '✕' : '☰'}
          </button>
          <aside id="pdfme-control-panel" className="pdfme-panel">
          <h2>Control</h2>

          <label>
            Modo UI
            <select
              data-testid="mode-select"
              value={mode}
              onChange={(e) => handleModeChange(e.target.value)}
              disabled={busy}
            >
              {MODES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            UX Mode
            <select
              data-testid="ux-mode-select"
              value={uxMode}
              onChange={(e) => setUxMode(e.target.value)}
              disabled={busy}
            >
              {UX_MODES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Tipo de schema para insertar
            <select
              data-testid="schema-select"
              value={schemaType}
              onChange={(e) => setSchemaType(e.target.value)}
              disabled={busy}
            >
              {schemaCatalog.map((item) => (
                <option key={`${item.type}-${item.key}`} value={item.type}>
                  {item.category} - {item.label} ({item.type})
                </option>
              ))}
            </select>
          </label>

          <div className="pdfme-actions">
            <button data-testid="btn-reset-template" type="button" onClick={resetTemplate} disabled={busy}>Reiniciar template</button>
            <button data-testid="btn-generate-pdf" type="button" onClick={generatePdf} disabled={busy}>Generar PDF</button>
          </div>

          <h3>Acciones DesignerRuntimeApi</h3>
          <div className="pdfme-actions">
            <button data-testid="btn-undo" type="button" onClick={() => runDesignerAction('undo')} disabled={!canRunDesignerActions}>Undo</button>
            <button data-testid="btn-redo" type="button" onClick={() => runDesignerAction('redo')} disabled={!canRunDesignerActions}>Redo</button>
            <button data-testid="btn-fit-width" type="button" onClick={() => runDesignerAction('fitWidth')} disabled={!canRunDesignerActions}>Fit Width</button>
            <button data-testid="btn-fit-page" type="button" onClick={() => runDesignerAction('fitPage')} disabled={!canRunDesignerActions}>Fit Page</button>
            <button data-testid="btn-prev-page" type="button" onClick={() => runDesignerAction('prevPage')} disabled={!canRunDesignerActions}>Prev Page</button>
            <button data-testid="btn-next-page" type="button" onClick={() => runDesignerAction('nextPage')} disabled={!canRunDesignerActions}>Next Page</button>
            <button data-testid="btn-add-page" type="button" onClick={addBlankPage} disabled={busy}>Add Page</button>
            <button data-testid="btn-toggle-sidebar" type="button" onClick={() => runDesignerAction('toggleSidebar')} disabled={!canRunDesignerActions}>Toggle Sidebar</button>
            <button data-testid="btn-add-schema" type="button" onClick={() => runDesignerAction('addSchema')} disabled={!canRunDesignerActions}>Add Schema</button>
            <button data-testid="btn-prefill-demo" type="button" onClick={() => runDesignerAction('prefillDemo')} disabled={!canRunDesignerActions}>Prefill Demo</button>
          </div>

          <h3>Conversión</h3>
          <div className="pdfme-actions">
            <button data-testid="btn-pdf2size" type="button" onClick={runPdf2Size} disabled={!generatedPdfBytes || busy}>pdf2size</button>
            <button data-testid="btn-pdf2img" type="button" onClick={runPdf2Img} disabled={!generatedPdfBytes || busy}>pdf2img</button>
            <button data-testid="btn-img2pdf" type="button" onClick={runImg2Pdf} disabled={images.length === 0 || busy}>img2pdf</button>
          </div>

          <p className="pdfme-status">{status}</p>

          {pdfSizes.length > 0 && (
            <div className="pdfme-results">
              <h4>Tamaño de páginas (mm)</h4>
              <ul>
                {pdfSizes.map((item, index) => (
                  <li key={`size-${index}`}>
                    Página {index + 1}: {item.width.toFixed(2)} x {item.height.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          </aside>
        </div>

        <section className="pdfme-workspace" data-ux-mode={uxMode}>
          <div ref={containerRef} className="pdfme-canvas" data-ux-mode={uxMode} />

          <div className="pdfme-output-grid">
            <article className="pdfme-output-card">
              <h3>PDF generado</h3>
              {generatedPdfUrl ? (
                <>
                  <iframe title="PDF generado" src={generatedPdfUrl} />
                  <button type="button" onClick={() => downloadUrl(generatedPdfUrl, 'pdfme-output.pdf')}>
                    Descargar PDF
                  </button>
                </>
              ) : (
                <p>Aún no se generó un PDF.</p>
              )}
            </article>

            <article className="pdfme-output-card">
              <h3>Imágenes (pdf2img)</h3>
              {images.length > 0 ? (
                <div className="pdfme-images">
                  {images.map((url, index) => (
                    <img key={`img-${index}`} src={url} alt={`Página ${index + 1}`} />
                  ))}
                </div>
              ) : (
                <p>No hay imágenes convertidas.</p>
              )}
            </article>

            <article className="pdfme-output-card">
              <h3>PDF reconstruido (img2pdf)</h3>
              {roundtripPdfUrl ? (
                <>
                  <iframe title="PDF reconstruido" src={roundtripPdfUrl} />
                  <button
                    type="button"
                    onClick={() => downloadUrl(roundtripPdfUrl, 'pdfme-roundtrip.pdf')}
                  >
                    Descargar Roundtrip PDF
                  </button>
                </>
              ) : (
                <p>Ejecuta `pdf2img` y luego `img2pdf` para ver este resultado.</p>
              )}
            </article>
          </div>
        </section>
      </section>
    </main>
  )
}
