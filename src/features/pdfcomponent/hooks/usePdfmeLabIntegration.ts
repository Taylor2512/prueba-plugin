import { useMemo, useRef, useCallback } from 'react'
import type { SisadPdfmeController } from '@/sisad-pdfme/config'
import type { LabHostExample, NormalizedLabHostData } from '../integration/normalizeLabHostData'
import { normalizeLabHostData } from '../integration/normalizeLabHostData'
import { createLabPdfmeConfig } from '../integration/createLabPdfmeConfig'

export type UsePdfmeLabIntegrationArgs = {
  example: LabHostExample
  template?: unknown
  inputs?: unknown[]
  activeRecipientId?: string | null
  isGlobalView?: boolean
  generatedPdfUrl?: string
  generatedPdfBytes?: ArrayBuffer | Uint8Array | null
  pdfSizes?: Array<{ width: number; height: number }>
  images?: string[]
  roundtripPdfUrl?: string
}

export const usePdfmeLabIntegration = ({
  example,
  template,
  inputs,
  activeRecipientId,
  isGlobalView,
  generatedPdfUrl,
  generatedPdfBytes,
  pdfSizes = [],
  images = [],
  roundtripPdfUrl,
}: UsePdfmeLabIntegrationArgs) => {
  const controllerRef = useRef<SisadPdfmeController | null>(null)

  const normalized: NormalizedLabHostData = useMemo(() => {
    const base = normalizeLabHostData(example)
    return {
      ...base,
      template: template || base.template,
      inputs: Array.isArray(inputs) ? inputs : base.inputs,
    }
  }, [example, inputs, template])

  const config = useMemo(
    () => createLabPdfmeConfig({
      example,
      normalized,
      activeRecipientId,
      isGlobalView,
    }),
    [activeRecipientId, example, isGlobalView, normalized],
  )

  const onControllerReady = useCallback((controller: SisadPdfmeController | null) => {
    controllerRef.current = controller
  }, [])

  const artifacts = useMemo(
    () => ({
      generatedPdfUrl: generatedPdfUrl || '',
      generatedPdfBytes: generatedPdfBytes || null,
      pdfSizes,
      images,
      roundtripPdfUrl: roundtripPdfUrl || '',
      hasGeneratedArtifacts: Boolean(generatedPdfUrl || generatedPdfBytes || pdfSizes.length || images.length || roundtripPdfUrl),
    }),
    [generatedPdfBytes, generatedPdfUrl, images, pdfSizes, roundtripPdfUrl],
  )

  const controller = useMemo(
    () => ({
      setPage: (page: number) => controllerRef.current?.setPage?.(page),
      fitToPage: () => controllerRef.current?.fitToPage?.(),
      fitToWidth: () => controllerRef.current?.fitToWidth?.(),
      addSchemaByType: (schemaType: string) => controllerRef.current?.addSchemaByType?.(schemaType),
      save: () => controllerRef.current?.save?.(),
    }),
    [],
  )

  return {
    config,
    controllerRef,
    controller,
    onControllerReady,
    template: normalized.template,
    inputs: normalized.inputs,
    recipients: normalized.recipients,
    documents: normalized.documents,
    activeRecipientId:
      activeRecipientId !== undefined ? activeRecipientId : normalized.activeRecipientId || null,
    artifacts,
  }
}
