import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getInputFromTemplate, cloneDeep } from '@sisad-pdfme/common'
import { Designer, Form, Viewer, DesignerEngineBuilder } from '@sisad-pdfme/ui'
import { generate } from '@sisad-pdfme/generator'
import { flatSchemaPlugins, builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { pdf2img, pdf2size, img2pdf } from '@sisad-pdfme/converter'
import { createInitialPdfmeTemplate } from './template'
import { createObjectUrl, revokeObjectUrls } from './utils/binary'
import {

  UX_MODE_STORAGE_KEY,
  getErrorMessage,
  isValidUxMode,
  resolveInitialUxMode,
  formatPageStatus,
} from './domain/labState'

export default function PdfmeLabPage() {
  const containerRef = useRef(null)
  const instanceRef = useRef(null)
  const generatedPdfUrlRef = useRef('')
  const roundtripPdfUrlRef = useRef('')
  const imagesRef = useRef([])

  const initialTemplate = useMemo(() => createInitialPdfmeTemplate(), [])
  const [template, setTemplate] = useState(initialTemplate)
  const [inputs, setInputs] = useState(() => getInputFromTemplate(initialTemplate))
  const [uiState, setUiState] = useState({
    mode: 'designer',
    schemaType: 'text',
    uxMode: 'canvas-first',
    busy: false,
    status: 'Listo para probar funcionalidades de sisad-pdfme',
    isControlPanelPinned: false,
  })
  const [resultsState, setResultsState] = useState({
    generatedPdfUrl: '',
    generatedPdfBytes: null,
    pdfSizes: [],
    images: [],
    roundtripPdfUrl: '',
  })
  const {
    mode,
    schemaType,
    uxMode,
    busy,
    status,
    isControlPanelPinned,
  } = uiState
  const {
    generatedPdfUrl,
    generatedPdfBytes,
    pdfSizes,
    images,
    roundtripPdfUrl,
  } = resultsState
  const canRunDesignerActions = mode === 'designer' && !busy

  const setMode = (nextMode) => {
    setUiState((prev) => ({ ...prev, mode: nextMode }))
  }

  const setSchemaType = (nextSchemaType) => {
    setUiState((prev) => ({ ...prev, schemaType: nextSchemaType }))
  }

  const setUxMode = (nextUxMode) => {
    setUiState((prev) => ({ ...prev, uxMode: nextUxMode }))
  }

  const setBusy = (nextBusy) => {
    setUiState((prev) => ({ ...prev, busy: nextBusy }))
  }

  const setStatus = (nextStatus) => {
    setUiState((prev) => ({ ...prev, status: nextStatus }))
  }

  const setIsControlPanelPinned = (nextPinned) => {
    setUiState((prev) => ({ ...prev, isControlPanelPinned: nextPinned }))
  }

  const setGeneratedPdfUrl = (nextGeneratedPdfUrl) => {
    setResultsState((prev) => ({ ...prev, generatedPdfUrl: nextGeneratedPdfUrl }))
  }

  const setGeneratedPdfBytes = (nextGeneratedPdfBytes) => {
    setResultsState((prev) => ({ ...prev, generatedPdfBytes: nextGeneratedPdfBytes }))
  }

  const setPdfSizes = (nextPdfSizes) => {
    setResultsState((prev) => ({ ...prev, pdfSizes: nextPdfSizes }))
  }

  const setImages = (nextImages) => {
    setResultsState((prev) => ({ ...prev, images: nextImages }))
  }

  const setRoundtripPdfUrl = (nextRoundtripPdfUrl) => {
    setResultsState((prev) => ({ ...prev, roundtripPdfUrl: nextRoundtripPdfUrl }))
  }

  useEffect(() => {
    const modeFromStorage = window.localStorage.getItem(UX_MODE_STORAGE_KEY)
    setUxMode(resolveInitialUxMode({ search: window.location.search, storedMode: modeFromStorage }))
  }, [])

  useEffect(() => {
    if (!isValidUxMode(uxMode)) return
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
        setStatus(formatPageStatus(pageInfo))
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
  }, [mode, template])

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
    <div className="app-shell">
    <main className="sisad-pdfme-page" data-ux-mode={uxMode}>
    

      <section className="sisad-pdfme-grid">
       
        <section className="sisad-pdfme-workspace" data-ux-mode={uxMode}>
          <div ref={containerRef} className="sisad-pdfme-canvas" data-ux-mode={uxMode} />

       
        </section>
      </section>
    </main>
    </div>
  )
}
