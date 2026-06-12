import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { buildLabExampleDownloadBundle, getLabExampleDownloadFilename } from './examples/labExamples.js'
import { downloadUrl } from '@/sisad-pdfme/browser/downloads'

const revokeUrl = (url) => {
  if (url && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url)
  }
}

export default function LabExampleDownloadButton({
  example,
  className = '',
  busyLabel = 'Preparando plantilla...',
  children = 'Descargar plantilla',
  ariaLabel,
  onError = null,
}) {
  const [busy, setBusy] = useState(false)
  const downloadUrlRef = useRef('')

  useEffect(() => () => {
    revokeUrl(downloadUrlRef.current)
    downloadUrlRef.current = ''
  }, [])

  const handleDownload = useCallback(async () => {
    if (!example || busy) return

    setBusy(true)
    try {
      const bundle = await buildLabExampleDownloadBundle(example)
      const filename = getLabExampleDownloadFilename(example)
      const nextUrl = URL.createObjectURL(
        new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json;charset=utf-8' }),
      )
      revokeUrl(downloadUrlRef.current)
      downloadUrlRef.current = nextUrl
      downloadUrl(nextUrl, filename)
    } catch (error) {
      console.error('No se pudo preparar la descarga de la plantilla', error)
      if (typeof onError === 'function') {
        onError(error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, example, onError])

  return (
    <button
      type="button"
      className={className}
      onClick={handleDownload}
      disabled={!example || busy}
      aria-label={ariaLabel || `Descargar plantilla ${example?.title || ''}`.trim()}
    >
      {busy ? busyLabel : children}
    </button>
  )
}

LabExampleDownloadButton.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  className: PropTypes.string,
  busyLabel: PropTypes.node,
  children: PropTypes.node,
  ariaLabel: PropTypes.string,
  onError: PropTypes.func,
}