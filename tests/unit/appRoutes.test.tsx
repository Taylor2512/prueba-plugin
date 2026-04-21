import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../../src/features/sisad-pdfme/PdfmeLabPage.jsx', () => ({
  default: ({ exampleId }: { exampleId?: string }) => <div data-testid="lab-page">{exampleId}</div>,
}))

import App from '../../src/App.jsx'

const renderApp = (initialEntries: string[] = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )

describe('app routes', () => {
  it('renders the landing page with the documented routes', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'Rutas de ejemplo para probar casos de uso reales' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Abrir ejemplo/ })[0]).toHaveAttribute('href', '/lab/basic-designer')
  })

  it('mounts the example page for a lab route', () => {
    renderApp(['/lab/generator-runtime'])

    expect(screen.getByTestId('lab-page')).toHaveTextContent('generator-runtime')
  })
})
