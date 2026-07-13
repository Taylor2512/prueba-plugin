import React from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ResultsPanel from '@/features/pdfcomponent/ResultsPanel.jsx'

describe('features/pdfcomponent/ResultsPanel.jsx', () => {
  it('keeps the drawer closed by default without overlaying the workspace', () => {
    render(
      <ResultsPanel
        generatedPdfUrl=""
        pdfSizes={[]}
        images={[]}
        roundtripPdfUrl=""
        hasGeneratedArtifacts={false}
        variant="drawer"
        defaultCollapsed
      />,
    )

    expect(screen.getByRole('button', { name: /Resultados/i })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Resultados')).toHaveAttribute('data-open', 'false')
  })

  it('opens the compact drawer panel on demand', () => {
    render(
      <ResultsPanel
        generatedPdfUrl=""
        pdfSizes={[]}
        images={[]}
        roundtripPdfUrl=""
        hasGeneratedArtifacts={true}
        variant="drawer"
        defaultCollapsed
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Resultados/i }))

    expect(screen.getByRole('dialog', { name: /Panel de resultados/i })).toBeInTheDocument()
    expect(screen.getByText('Artefactos listos')).toBeInTheDocument()
  })
})
