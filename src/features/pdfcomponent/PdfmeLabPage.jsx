import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common'
import { flatSchemaPlugins, builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '@/sisad-pdfme/react'
import { createObjectUrl, revokeObjectUrls } from '@/sisad-pdfme/browser/objectUrls'
import {
  getLabExampleById,
  getLabExamples,
} from './labs/examples/labExampleRegistry.ts'
import LabExampleDownloadButton from './LabExampleDownloadButton.jsx'
import {
  UX_MODE_STORAGE_KEY,
  getErrorMessage,
  isValidUxMode,
  resolveInitialUxMode,
} from './domain/labState.js'
import {
  flattenSchemasFromTemplate,
  getUniqueSchemaTypes,
  getLabCollaborationSummary,
} from './domain/labPresentation.js'
import { cn } from '@/sisad-pdfme/ui/utils/cn'
import PageHeader, { CompactCollaborationBar } from './PageHeader.jsx'
import ResultsPanel from './ResultsPanel.jsx'
import CompactControls from './CompactControls.jsx'
import { usePdfmeLabIntegration } from './hooks/usePdfmeLabIntegration'
import {
  convertLabImagesToPdf,
  convertLabPdfToImages,
  generateLabPdf,
  getLabPdfSizes,
  validateLabTemplateForGeneration,
} from './integration/labArtifactService'

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

const schemaCatalog = sortSchemaDefinitions(builtInSchemaDefinitions)
const resolveInitialCollaboratorId = (activeUserId, users) => activeUserId || users[0]?.id || ''
const resolveLabInitialUxMode = ({ search = '', storedMode = '' } = {}) =>
  resolveInitialUxMode({ search, storedMode, fallback: 'default' })

const DEFAULT_SIGNATURE_PROVIDERS = [
  {
    key: 'provider.remoto.tenantA',
    label: 'Tenant A Sign',
    description: 'Proveedor remoto embebido para flujos de firma del tenant A.',
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: true,
      supportsPolling: false,
      supportsCertificateMetadata: false,
      supportsReason: true,
      supportsLocation: false,
      supportsOtp: true,
      supportsBiometric: false,
    },
    defaultConfig: {
      flow: 'embedded',
      visibleSignature: true,
      baseUrl: 'https://firma.tenant-a.example.com',
    },
    configFields: [
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: true },
      {
        key: 'flow',
        label: 'Flow',
        type: 'select',
        required: true,
        options: [
          { label: 'Embedded', value: 'embedded' },
          { label: 'Redirect', value: 'redirect' },
        ],
      },
      { key: 'visibleSignature', label: 'Firma visible', type: 'switch' },
    ],
  },
  {
    key: 'provider.remoto.tenantB',
    label: 'Tenant B Sign',
    description: 'Proveedor remoto por polling para tenant B.',
    capabilities: {
      supportsVisibleSignature: false,
      supportsWebhook: false,
      supportsPolling: true,
      supportsCertificateMetadata: true,
      supportsReason: true,
      supportsLocation: true,
      supportsOtp: false,
      supportsBiometric: true,
    },
    defaultConfig: {
      flow: 'redirect',
      callbackUrl: 'https://app.tenant-b.example.com/sign/callback',
    },
    configFields: [
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: true },
      {
        key: 'flow',
        label: 'Flow',
        type: 'select',
        required: true,
        options: [
          { label: 'Redirect', value: 'redirect' },
          { label: 'Embedded', value: 'embedded' },
        ],
      },
      { key: 'callbackUrl', label: 'Callback URL', type: 'text', required: true },
    ],
  },
]

export default function PdfmeLabPage({ exampleId = fallbackExample?.id, example: exampleProp = null } = {}) {
  const generatedPdfUrlRef = useRef('')
  const roundtripPdfUrlRef = useRef('')
  const imagesRef = useRef([])
  const pendingPageSelectionRef = useRef(null)

  const example = useMemo(
    () => exampleProp || getLabExampleById(exampleId) || fallbackExample,
    [exampleId, exampleProp],
  )
  const collaboration = example?.collaboration || null
  const [activeCollaboratorId, setActiveCollaboratorId] = useState(() =>
    resolveInitialCollaboratorId(collaboration?.activeUserId, collaboration?.users || []),
  )
  const [isGlobalView, setIsGlobalView] = useState(() =>
    Boolean(collaboration?.isGlobalView),
  )
  const initialTemplate = useMemo(() => cloneDeep(example?.template || { schemas: [[]] }), [example?.template])
  const initialInputs = useMemo(
    () => cloneDeep(example?.inputs || getInputFromTemplate(initialTemplate)),
    [example?.inputs, initialTemplate],
  )

  const [template, setTemplate] = useState(initialTemplate)
  const [inputs, setInputs] = useState(initialInputs)
  const [uiState, setUiState] = useState(() => ({
    mode: example?.defaultMode || 'designer',
    schemaType: example?.initialSchemaType || 'text',
    uxMode: resolveLabInitialUxMode({
      search: globalThis.location?.search || '',
      storedMode: globalThis.localStorage?.getItem(UX_MODE_STORAGE_KEY) || '',
    }),
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
  const labIntegration = usePdfmeLabIntegration({
    example,
    template,
    inputs,
    activeRecipientId: isGlobalView ? null : activeCollaboratorId,
    isGlobalView,
    generatedPdfUrl,
    generatedPdfBytes,
    pdfSizes,
    images,
    roundtripPdfUrl,
  })
  const collaborationUsers = labIntegration.recipients
  const activeCollaborator = useMemo(
    () => collaborationUsers.find((user) => user.id === activeCollaboratorId) || collaborationUsers[0] || null,
    [activeCollaboratorId, collaborationUsers],
  )
  // Fuente controlada real del destinatario activo: cuando el registry interno
  // del diseñador cambia el destinatario (p.ej. selector de la barra superior),
  // sincronizamos el estado del host para que el prop controlado no lo revierta.
  const handleActiveRecipientChange = useCallback((recipient) => {
    setActiveCollaboratorId(recipient?.id || '')
  }, [])
  const canRunDesignerActions = mode === 'designer' && !busy
  const pageMetrics = useMemo(
    () => {
      const allSchemas = flattenSchemasFromTemplate(template)
      const schemaTypes = getUniqueSchemaTypes(allSchemas)
      const registeredSchemaTypes = getUniqueSchemaTypes(schemaCatalog)

      return [
        { label: 'Estado', value: busy ? 'Procesando' : 'Listo' },
        { label: 'Modo', value: MODE_LABELS[mode] || mode },
        { label: 'Vista', value: isGlobalView ? 'Global' : activeCollaborator?.name || 'Usuario activo' },
        { label: 'UX', value: uxMode },
        { label: 'Páginas', value: template.schemas.length },
        { label: 'Schemas', value: `${schemaTypes.size}/${registeredSchemaTypes.size}` },
      ]
    },
    [activeCollaborator?.name, busy, isGlobalView, mode, template, uxMode],
  )

  const collaborationSummary = useMemo(() => {
    const activeUserId = activeCollaborator?.id || activeCollaboratorId || ''
    return getLabCollaborationSummary({
      schemas: flattenSchemasFromTemplate(template),
      activeUserId,
      isGlobalView,
    })
  }, [activeCollaborator?.id, activeCollaboratorId, isGlobalView, template])

  const setMode = useCallback((nextMode) => {
    setUiState((prev) => ({ ...prev, mode: nextMode }))
  }, [])

  const setSchemaType = useCallback((nextSchemaType) => {
    setUiState((prev) => ({ ...prev, schemaType: nextSchemaType }))
  }, [])

  const setUxMode = useCallback((nextUxMode) => {
    setUiState((prev) => ({ ...prev, uxMode: nextUxMode }))
  }, [])

  const setBusy = useCallback((nextBusy) => {
    setUiState((prev) => ({ ...prev, busy: nextBusy }))
  }, [])

  const setStatus = useCallback((nextStatus) => {
    setUiState((prev) => ({ ...prev, status: nextStatus }))
  }, [])

  const setGeneratedPdfUrl = useCallback((nextGeneratedPdfUrl) => {
    setResultsState((prev) => ({ ...prev, generatedPdfUrl: nextGeneratedPdfUrl }))
  }, [])

  const setGeneratedPdfBytes = useCallback((nextGeneratedPdfBytes) => {
    setResultsState((prev) => ({ ...prev, generatedPdfBytes: nextGeneratedPdfBytes }))
  }, [])

  const setPdfSizes = useCallback((nextPdfSizes) => {
    setResultsState((prev) => ({ ...prev, pdfSizes: nextPdfSizes }))
  }, [])

  const setImages = useCallback((nextImages) => {
    setResultsState((prev) => ({ ...prev, images: nextImages }))
  }, [])

  const setRoundtripPdfUrl = useCallback((nextRoundtripPdfUrl) => {
    setResultsState((prev) => ({ ...prev, roundtripPdfUrl: nextRoundtripPdfUrl }))
  }, [])

  useEffect(() => {
    const modeFromStorage = globalThis.localStorage?.getItem(UX_MODE_STORAGE_KEY)
    setUxMode(
      resolveLabInitialUxMode({
        search: globalThis.location?.search || '',
        storedMode: modeFromStorage || '',
      }),
    )
  }, [setUxMode])

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
    generatedPdfUrlRef.current = generatedPdfUrl
  }, [generatedPdfUrl])

  useEffect(() => {
    roundtripPdfUrlRef.current = roundtripPdfUrl
  }, [roundtripPdfUrl])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    const pendingPage = pendingPageSelectionRef.current
    if (pendingPage == null || mode !== 'designer') return

    labIntegration.controller.setPage(pendingPage)
    pendingPageSelectionRef.current = null
  }, [labIntegration.controller, mode, template.schemas.length])

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
    pendingPageSelectionRef.current = nextPage
    setStatus(`Página ${nextPage} creada`)
  }

  const fitToPage = () => {
    if (!canRunDesignerActions) return
    labIntegration.controller.fitToPage()
  }

  const fitToWidth = () => {
    if (!canRunDesignerActions) return
    labIntegration.controller.fitToWidth()
  }

  const addSchema = () => {
    if (!canRunDesignerActions) return
    labIntegration.controller.addSchemaByType(schemaType)
  }

  const generatePdf = async () => {
    const collaborationValidation = validateLabTemplateForGeneration(template)
    if (!collaborationValidation.valid) {
      setStatus(`Faltan metadatos colaborativos: ${collaborationValidation.issues.map((issue) => `${issue.schemaUid}:${issue.reason}`).join(', ')}`)
      return
    }
    setBusy(true)
    setStatus('Generando PDF...')
    clearDerivedResults()

    try {
      const pdfBytes = await generateLabPdf({ template, inputs, plugins: flatSchemaPlugins })

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
      const sizes = await getLabPdfSizes(generatedPdfBytes)
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
      const imageBuffers = await convertLabPdfToImages(generatedPdfBytes)

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

      const pdfBuffer = await convertLabImagesToPdf({ imageBuffers: buffers })

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

  const handleModeChange = useCallback((nextMode) => {
    setMode(nextMode)
  }, [setMode])

  const handleSchemaTypeChange = useCallback((event) => {
    setSchemaType(event.target.value)
  }, [setSchemaType])

  const isCanvasFirst = uxMode === 'canvas-first'
  const usesEmbeddedDesignerShell = isCanvasFirst || example.id === 'multi-document-routing'
  const usesDockedResultsRail = isCanvasFirst || example.id === 'multi-document-routing'
  const headerCollaborationControls = isCanvasFirst && collaborationUsers.length > 0 ? (
    <div
      className="sisad-pdfme-lab-header-collaboration"
      role="region"
      aria-label="Colaboración del ejemplo"
    >
      <CompactCollaborationBar
        collaborationUsers={collaborationUsers}
        activeCollaborator={activeCollaborator}
        onActiveCollaboratorChange={setActiveCollaboratorId}
        isGlobalView={isGlobalView}
        onToggleGlobalView={setIsGlobalView}
        collaborationSummary={collaborationSummary}
      />
    </div>
  ) : null

  return (
    <main
      className={cn(
        [
          'sisad-pdfme-lab-page',
          'relative',
          'isolate',
          'box-border',
          'max-w-full',
          'overflow-x-clip',
          'font-sans',
          'text-slate-900',
          'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]',
        ].join(' '),
        usesEmbeddedDesignerShell
          ? [
              'grid',
              'h-[100dvh]',
              'min-h-0',
              'w-full',
              'grid-rows-[minmax(0,1fr)]',
              'gap-0',
              'overflow-hidden',
              'p-0',
            ].join(' ')
          : [
              'min-h-screen',
              'w-full',
              'gap-[0.45rem]',
              'p-[clamp(0.45rem,0.8vw,0.9rem)]',
              'max-[640px]:gap-[0.35rem]',
            ].join(' '),
      )}
      data-example-id={example.id}
      data-runtime-mode={mode}
      data-ux-mode={uxMode}
    >
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none',
          'fixed',
          'inset-0',
          '-z-10',
          'bg-[radial-gradient(circle_at_12%_18%,rgba(56,189,248,0.10),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(249,115,22,0.08),transparent_34%)]',
        ].join(' ')}
      />
      {!usesEmbeddedDesignerShell ? (
        <PageHeader
          example={example}
          pageMetrics={pageMetrics}
          collaborationUsers={collaborationUsers}
          activeCollaborator={activeCollaborator}
          onActiveCollaboratorChange={setActiveCollaboratorId}
          isGlobalView={isGlobalView}
          onToggleGlobalView={setIsGlobalView}
          status={status}
          collaborationSummary={collaborationSummary}
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
              compact={isCanvasFirst}
            />
          }
          downloadLink={
            <LabExampleDownloadButton className="sisad-pdfme-lab-inline-link" example={example}>
              Descargar plantilla
            </LabExampleDownloadButton>
          }
          rightSlot={headerCollaborationControls}
          density={usesEmbeddedDesignerShell ? 'compact' : 'full'}
        />
      ) : null}

      <section
        className={cn(
          'sisad-pdfme-lab-workspace min-h-0 min-w-0',
          usesEmbeddedDesignerShell
            ? [
                'grid',
                'h-full',
                'grid-rows-[minmax(0,1fr)]',
                'gap-0',
                'overflow-hidden',
                'rounded-none',
                'border-0',
                'bg-transparent',
                'p-0',
                'shadow-none',
                'backdrop-filter-none',
              ].join(' ')
            : [
                'flex',
                'flex-1',
                'flex-col',
                'gap-2',
                'rounded-[20px]',
                'border',
                'border-slate-200/70',
                'bg-white/90',
                'p-2',
                'shadow-[0_18px_40px_rgba(15,23,42,0.08)]',
                'backdrop-blur-[12px]',
              ].join(' '),
        )}
        aria-labelledby="lab-workspace-title"
        data-ux-mode={uxMode}
      >
        <div className={cn('sisad-pdfme-lab-section-heading', usesEmbeddedDesignerShell && 'sr-only')} data-ux-mode={uxMode}>
          <h2 id="lab-workspace-title">Canvas</h2>
          <p>La superficie de edición se monta dentro del runtime de <code>sisad-pdfme</code>.</p>
        </div>

        <div
          className={cn(
            usesEmbeddedDesignerShell
              ? [
                  'sisad-pdfme-lab-canvas-shell',
                  'relative',
                  'h-full',
                  'min-h-0',
                  'min-w-0',
                  'w-full',
                  'overflow-hidden',
                  'rounded-none',
                  'border-0',
                  'bg-transparent',
                  'shadow-none',
                ].join(' ')
              : [
                  'sisad-pdfme-lab-canvas-shell',
                  'relative',
                  'min-h-[min(72vh,52rem)]',
                  'min-w-0',
                  'w-full',
                  'flex-1',
                  'overflow-hidden',
                  'rounded-[20px]',
                  'border',
                  'border-slate-200/70',
                  'bg-white/90',
                  'shadow-[0_18px_40px_rgba(15,23,42,0.08)]',
                ].join(' '),
          )}
          data-ux-mode={uxMode}
          style={
            usesEmbeddedDesignerShell
              ? undefined
              : {
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
                }
          }
        >
          {mode === 'designer' ? (
            <SisadPdfmeDesigner
              config={labIntegration.config}
              template={labIntegration.template}
              documents={labIntegration.documents}
              recipients={labIntegration.recipients}
              activeRecipientId={labIntegration.activeRecipientId}
              onActiveRecipientChange={handleActiveRecipientChange}
              onTemplateChange={setTemplate}
              onControllerReady={labIntegration.onControllerReady}
            />
          ) : mode === 'form' ? (
            <SisadPdfmeForm
              config={labIntegration.config}
              template={labIntegration.template}
              values={labIntegration.inputs}
              documents={labIntegration.documents}
              recipients={labIntegration.recipients}
              activeRecipientId={labIntegration.activeRecipientId}
              onInputChange={setInputs}
            />
          ) : (
            <SisadPdfmeViewer
              config={labIntegration.config}
              template={labIntegration.template}
              documents={labIntegration.documents}
              recipients={labIntegration.recipients}
              activeRecipientId={labIntegration.activeRecipientId}
            />
          )}
        </div>
      </section>

      <ResultsPanel
        key={`${uxMode}-${usesDockedResultsRail ? 'drawer' : 'inline'}`}
        generatedPdfUrl={labIntegration.artifacts.generatedPdfUrl}
        pdfSizes={labIntegration.artifacts.pdfSizes}
        images={labIntegration.artifacts.images}
        roundtripPdfUrl={labIntegration.artifacts.roundtripPdfUrl}
        hasGeneratedArtifacts={labIntegration.artifacts.hasGeneratedArtifacts}
        variant={usesDockedResultsRail ? 'drawer' : 'inline'}
        defaultCollapsed={usesDockedResultsRail}
      />
    </main>
  )
}

PdfmeLabPage.propTypes = {
  exampleId: PropTypes.string,
  example: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    defaultMode: PropTypes.string,
    template: PropTypes.shape({
      schemas: PropTypes.array,
    }),
  }),
}