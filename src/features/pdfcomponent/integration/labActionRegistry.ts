type LabActionDescriptor = {
  key: string
  label: string
  testId: string
  visible: boolean
  enabled?: boolean
  disabledReason?: string
  destructive?: boolean
  run?: () => void
}

type LabActionSection = {
  key: string
  title: string
  visible: boolean
  actions: LabActionDescriptor[]
}

type LabActionRegistryArgs = {
  mode: 'designer' | 'form' | 'viewer' | string
  busy?: boolean
  hasGeneratedPdf?: boolean
  hasImages?: boolean
  onGenerate?: () => void
  onPdf2Size?: () => void
  onPdf2Img?: () => void
  onImg2Pdf?: () => void
  onAddPage?: () => void
  onFitPage?: () => void
  onFitWidth?: () => void
  onReset?: () => void
}

const createAction = (
  key: string,
  label: string,
  {
    testId,
    run,
    enabled = true,
    disabledReason = '',
    destructive = false,
  }: {
    testId: string
    run?: () => void
    enabled?: boolean
    disabledReason?: string
    destructive?: boolean
  },
): LabActionDescriptor => ({
  key,
  label,
  testId,
  run,
  visible: true,
  enabled,
  disabledReason,
  destructive,
})

const isDesignerMode = (mode: LabActionRegistryArgs['mode']) => mode === 'designer'

export const createLabActionRegistry = ({
  mode,
  busy = false,
  hasGeneratedPdf = false,
  hasImages = false,
  onGenerate,
  onPdf2Size,
  onPdf2Img,
  onImg2Pdf,
  onAddPage,
  onFitPage,
  onFitWidth,
  onReset,
}: LabActionRegistryArgs): LabActionSection[] => {
  const busyReason = busy ? 'Procesando en curso' : ''

  const pdfSection: LabActionSection = {
    key: 'pdf',
    title: 'PDF',
    visible: true,
    actions: [
      createAction('generate-pdf', 'Generar PDF', {
        testId: 'lab-action-generate-pdf',
        run: onGenerate,
        enabled: !busy && typeof onGenerate === 'function',
        disabledReason: busyReason || (typeof onGenerate === 'function' ? '' : 'Acción no disponible'),
      }),
      createAction('read-pdf-sizes', 'Leer tamaños', {
        testId: 'lab-action-read-pdf-sizes',
        run: onPdf2Size,
        enabled: !busy && hasGeneratedPdf && typeof onPdf2Size === 'function',
        disabledReason:
          busyReason ||
          (!hasGeneratedPdf ? 'Genera un PDF primero' : typeof onPdf2Size === 'function' ? '' : 'Acción no disponible'),
      }),
      createAction('pdf-to-images', 'PDF → imágenes', {
        testId: 'lab-action-pdf-to-images',
        run: onPdf2Img,
        enabled: !busy && hasGeneratedPdf && typeof onPdf2Img === 'function',
        disabledReason:
          busyReason ||
          (!hasGeneratedPdf ? 'Genera un PDF primero' : typeof onPdf2Img === 'function' ? '' : 'Acción no disponible'),
      }),
      createAction('images-to-pdf', 'Imágenes → PDF', {
        testId: 'lab-action-images-to-pdf',
        run: onImg2Pdf,
        enabled: !busy && hasImages && typeof onImg2Pdf === 'function',
        disabledReason:
          busyReason ||
          (!hasImages ? 'Carga imágenes primero' : typeof onImg2Pdf === 'function' ? '' : 'Acción no disponible'),
      }),
    ],
  }

  const canvasSection: LabActionSection = {
    key: 'canvas',
    title: 'Canvas',
    visible: isDesignerMode(mode),
    actions: [
      createAction('add-page', 'Agregar página', {
        testId: 'lab-action-add-page',
        run: onAddPage,
        enabled: !busy && typeof onAddPage === 'function',
        disabledReason: busyReason || (typeof onAddPage === 'function' ? '' : 'Acción no disponible'),
      }),
      createAction('fit-page', 'Ajustar a página', {
        testId: 'lab-action-fit-page',
        run: onFitPage,
        enabled: !busy && typeof onFitPage === 'function',
        disabledReason: busyReason || (typeof onFitPage === 'function' ? '' : 'Acción no disponible'),
      }),
      createAction('fit-width', 'Ajustar al ancho', {
        testId: 'lab-action-fit-width',
        run: onFitWidth,
        enabled: !busy && typeof onFitWidth === 'function',
        disabledReason: busyReason || (typeof onFitWidth === 'function' ? '' : 'Acción no disponible'),
      }),
    ],
  }

  const advancedSection: LabActionSection = {
    key: 'advanced',
    title: 'Avanzado',
    visible: true,
    actions: [
      createAction('reset-template', 'Reiniciar template', {
        testId: 'lab-action-reset-template',
        run: onReset,
        enabled: !busy && typeof onReset === 'function',
        disabledReason: busyReason || (typeof onReset === 'function' ? '' : 'Acción no disponible'),
        destructive: true,
      }),
    ],
  }

  return [pdfSection, canvasSection, advancedSection]
}
