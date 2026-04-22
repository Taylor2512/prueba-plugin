import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { cloneDeep, getInputFromTemplate, validateCollaborativeSchemas } from '@sisad-pdfme/common'
import { Designer, Form, Viewer, DesignerEngineBuilder } from '@sisad-pdfme/ui'
import { generate } from '@sisad-pdfme/generator'
import { flatSchemaPlugins, builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { pdf2img, pdf2size, img2pdf } from '@sisad-pdfme/converter'
import { createObjectUrl, revokeObjectUrls } from './utils/binary.js'
import { createInitialPdfmeTemplate } from './template.js'
import { getLabExampleById, getLabExamples } from './examples/labExamples.js'
import {
  UX_MODE_STORAGE_KEY,
  getErrorMessage,
  isValidUxMode,
  resolveInitialUxMode,
  formatPageStatus,
} from './domain/labState.js'
import {
  decorateCollaborationUsers,
  decorateTemplateWithCollaboration,
} from './domain/collaborationAppearance.js'
import { PageHeader, ResultsPanel, CompactControls } from '../implements'

const fallbackExample = getLabExamples()[0]
const sortSchemaDefinitions = (definitions) =>
  definitions
    .slice()
    .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))

const MODE_LABELS = {
  designer: 'Diseñador',
  form: 'Formulario',
  viewer: 'Visor',
}

// MODE_LABELS removed: use mode strings directly where needed

export default function PdfmeLabPage({ exampleId = fallbackExample?.id } = {}) {
  const containerRef = useRef(null)
  const instanceRef = useRef(null)
  const generatedPdfUrlRef = useRef('')
  const roundtripPdfUrlRef = useRef('')
  const imagesRef = useRef([])

  const example = useMemo(
    () => getLabExampleById(exampleId) ?? fallbackExample,
    [exampleId],
  )
  const collaboration = example?.collaboration || null
  const collaborationUsers = useMemo(
    () => decorateCollaborationUsers(collaboration?.users || []),
    [collaboration?.users],
  )
  const collaborationSessionId = collaboration?.sessionId || example?.id || ''
  const [activeCollaboratorId, setActiveCollaboratorId] = useState(
    collaboration?.activeUserId || collaborationUsers[0]?.id || '',
  )
  const [isGlobalView, setIsGlobalView] = useState(Boolean(collaboration?.isGlobalView))
  const activeCollaborator =
    collaborationUsers.find((user) => user.id === activeCollaboratorId) || collaborationUsers[0] || null
  const designerEngineOptions = useMemo(() => {
    const collaborationConfig = {
      enabled: Boolean(collaborationSessionId),
      provider: 'yjs',
      sessionId: collaborationSessionId,
      actorId: activeCollaborator?.id || collaboration?.activeUserId || collaborationUsers[0]?.id || 'local',
      actorColor: activeCollaborator?.color || null,
      recipientOptions: collaborationUsers,
      users: collaborationUsers,
      activeRecipientId: activeCollaborator?.id || collaboration?.activeUserId || collaborationUsers[0]?.id || null,
      activeUserId: activeCollaborator?.id || collaboration?.activeUserId || collaborationUsers[0]?.id || null,
      isGlobalView,
    }

    return new DesignerEngineBuilder()
      .withCanvasFeatureToggles({
        guides: true,
        snapLines: true,
        padding: true,
        mask: false,
      })
      .withCollaboration(collaborationConfig)
      .buildOptions({ lang: 'es' })
  }, [
    activeCollaborator?.color,
    activeCollaborator?.id,
    collaboration?.activeUserId,
    collaborationSessionId,
    collaborationUsers,
    isGlobalView,
  ])
  const runtimeOptions = useMemo(
    () => cloneDeep(example?.runtimeOptions || {}),
    [example],
  )
  const commonOptions = useMemo(
    () => ({
      ...runtimeOptions,
      ...designerEngineOptions,
    }),
    [designerEngineOptions, runtimeOptions],
  )

  const initialTemplate = useMemo(
    () => decorateTemplateWithCollaboration(example?.template || createInitialPdfmeTemplate(), collaborationUsers),
    [collaborationUsers, example],
  )
  const initialInputs = useMemo(
    () => cloneDeep(example?.inputs || getInputFromTemplate(initialTemplate)),
    [example, initialTemplate],
  )

  const [template, setTemplate] = useState(initialTemplate)
  const [inputs, setInputs] = useState(initialInputs)
  const [uiState, setUiState] = useState(() => ({
    mode: example?.defaultMode || 'designer',
    schemaType: example?.initialSchemaType || 'text',
    uxMode: 'canvas-first',
    busy: false,
    status: example?.status || 'Listo para probar funcionalidades de sisad-pdfme',
  }))
  const [resultsState, setResultsState] = useState({
    generatedPdfUrl: '',
    generatedPdfBytes: null,
    pdfSizes: [],
    images: [],
    roundtripPdfUrl: '',
  })
  const { mode, schemaType, uxMode, busy, status } = uiState
  const { generatedPdfUrl, generatedPdfBytes, pdfSizes, images, roundtripPdfUrl } = resultsState
  const canRunDesignerActions = mode === 'designer' && !busy
  const hasGeneratedArtifacts = Boolean(
    generatedPdfUrl || generatedPdfBytes || pdfSizes.length || images.length || roundtripPdfUrl,
  )

  const schemaCatalog = useMemo(() => sortSchemaDefinitions(builtInSchemaDefinitions), [])
  useEffect(() => {
    setActiveCollaboratorId(collaboration?.activeUserId || collaborationUsers[0]?.id || '')
  }, [collaboration?.activeUserId, collaborationUsers, example?.id])
  useEffect(() => {
    setIsGlobalView(Boolean(collaboration?.isGlobalView))
  }, [collaboration?.isGlobalView, example?.id])

  const pageMetrics = [
    { label: 'Estado', value: busy ? 'Procesando' : 'Listo' },
    { label: 'Modo', value: MODE_LABELS[mode] || mode },
    { label: 'Vista', value: isGlobalView ? 'Global' : activeCollaborator?.name || 'Usuario activo' },
    { label: 'UX', value: uxMode },
    { label: 'Páginas', value: template.schemas.length },
  ]

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
    const modeFromStorage = globalThis.localStorage?.getItem(UX_MODE_STORAGE_KEY)
    setUxMode(resolveInitialUxMode({ search: globalThis.location?.search || '', storedMode: modeFromStorage }))
  }, [])

  useEffect(() => {
    if (!isValidUxMode(uxMode)) return
    globalThis.localStorage?.setItem(UX_MODE_STORAGE_KEY, uxMode)
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

  useEffect(() => {
    if (!containerRef.current) return

    const commonProps = {
      domContainer: containerRef.current,
      template: cloneDeep(template),
      plugins: flatSchemaPlugins,
      options: commonOptions,
    }

    if (mode === 'designer') {
      const designer = new Designer(commonProps)
      globalThis.requestAnimationFrame(() => {
        if (designer && typeof designer.fitToPage === 'function') {
          designer.fitToPage()
        }
      })
      designer.onChangeTemplate((nextTemplate) => {
        setTemplate(decorateTemplateWithCollaboration(nextTemplate, collaborationUsers))
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
    instance.updateOptions(commonOptions)
  }, [commonOptions])

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

  const addBlankPage = () => {
    if (busy) return
    let nextPage = 1
    setTemplate((prev) => {
      const nextSchemas = Array.isArray(prev.schemas) ? [...prev.schemas, []] : [[]]
      nextPage = nextSchemas.length
      return { ...prev, schemas: nextSchemas }
    })

    globalThis.setTimeout(() => {
      const designer = instanceRef.current
      if (mode === 'designer' && designer && typeof designer.setPage === 'function') {
        designer.setPage(nextPage)
      }
    }, 0)
    setStatus(`Página ${nextPage} creada`)
  }

  const fitToPage = () => {
    if (!canRunDesignerActions || !instanceRef.current) return
    instanceRef.current.fitToPage()
  }

  const fitToWidth = () => {
    if (!canRunDesignerActions || !instanceRef.current) return
    instanceRef.current.fitToWidth()
  }

  const addSchema = () => {
    if (!canRunDesignerActions || !instanceRef.current) return
    instanceRef.current.addSchemaByType(schemaType)
  }

  const generatePdf = async () => {
    const collaborationValidation = validateCollaborativeSchemas(template.schemas || [])
    if (!collaborationValidation.valid) {
      setStatus(`Faltan metadatos colaborativos: ${collaborationValidation.issues.map((issue) => `${issue.schemaUid}:${issue.reason}`).join(', ')}`)
      return
    }
    setBusy(true)
    setStatus('Generando PDF...')
    clearDerivedResults()

    try {
      const pdfBytes = await generate({
        template,
        inputs,
        plugins: flatSchemaPlugins,
      })

      if (generatedPdfUrlRef.current) {
        URL.revokeObjectURL(generatedPdfUrlRef.current)
        generatedPdfUrlRef.current = ''
      }
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

      revokeObjectUrls(imagesRef.current)
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

      if (roundtripPdfUrlRef.current) URL.revokeObjectURL(roundtripPdfUrlRef.current)
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
    const nextTemplate = cloneDeep(initialTemplate)
    setTemplate(nextTemplate)
    setInputs(cloneDeep(example.inputs || getInputFromTemplate(nextTemplate)))
    clearDerivedResults({ clearGeneratedPdf: true })
    setStatus(`${example.title}: template reiniciado`)
  }

  const handleModeChange = (nextMode) => {
    globalThis.setTimeout(() => {
      setMode(nextMode)
    }, 0)
  }

  const handleSchemaTypeChange = (event) => {
    setSchemaType(event.target.value)
  }

  return (
    <main
      className="sisad-pdfme-lab-page"
      data-example-id={example.id}
      data-runtime-mode={mode}
      data-ux-mode={uxMode}
    >
      <PageHeader
        example={example}
        pageMetrics={pageMetrics}
        collaborationUsers={collaborationUsers}
        activeCollaborator={activeCollaborator}
        onActiveCollaboratorChange={setActiveCollaboratorId}
        isGlobalView={isGlobalView}
        onToggleGlobalView={setIsGlobalView}
        status={status}
        backLink={
          <Link className="sisad-pdfme-lab-inline-link" to="/">
            Volver al índice
          </Link>
        }
        controls={
          <CompactControls
            mode={mode}
            onModeChange={handleModeChange}
            onGenerate={generatePdf}
            onPdf2Size={runPdf2Size}
            onPdf2Img={runPdf2Img}
            onImg2Pdf={runImg2Pdf}
            onAddPage={addBlankPage}
            onFitPage={fitToPage}
            onFitWidth={fitToWidth}
            onAddSchema={addSchema}
            onReset={resetTemplate}
            schemaCatalog={schemaCatalog}
            schemaType={schemaType}
            onSchemaTypeChange={handleSchemaTypeChange}
            busy={busy}
            hasGeneratedPdf={Boolean(generatedPdfBytes)}
            hasImages={images.length > 0}
          />
        }
      />

      <section className="sisad-pdfme-lab-workspace" aria-labelledby="lab-workspace-title">
        <div className="sisad-pdfme-lab-section-heading">
          <h2 id="lab-workspace-title">Canvas</h2>
          <p>La superficie de edición se monta dentro del runtime de <code>sisad-pdfme</code>.</p>
        </div>

        <div className="sisad-pdfme-lab-canvas-shell">
          <div ref={containerRef} className="sisad-pdfme-canvas" data-ux-mode={uxMode} />
        </div>
      </section>

      <ResultsPanel
        generatedPdfUrl={generatedPdfUrl}
        pdfSizes={pdfSizes}
        images={images}
        roundtripPdfUrl={roundtripPdfUrl}
        hasGeneratedArtifacts={hasGeneratedArtifacts}
      />
    </main>
  )
}

PdfmeLabPage.propTypes = {
  exampleId: PropTypes.string,
}
