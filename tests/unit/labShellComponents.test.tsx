import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import {
  CaseCard,
  CaseGrid,
  CompactControls,
  Hero,
  PageHeader,
  ResultsPanel,
} from '../../src/features/implements/index.js';

describe('lab shell components', () => {
  it('renders hero metrics and case cards for the landing page', () => {
    render(
      <Hero
        kicker="SISAD PDFME Lab"
        title="Rutas de ejemplo"
        description="Cada ruta monta un escenario independiente."
        metrics={[
          { label: 'Ejemplos', value: 5 },
          { label: 'Ruta base', value: '/lab' },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Rutas de ejemplo' })).toBeVisible();
    expect(screen.getByText('Cada ruta monta un escenario independiente.')).toBeVisible();
    expect(screen.getByText('Ejemplos')).toBeVisible();
    expect(screen.getByText('5')).toBeVisible();

    render(
      <MemoryRouter>
        <CaseCard
          example={{
            id: 'basic-designer',
            defaultMode: 'designer',
            path: '/lab/basic-designer',
            title: 'Editor básico',
            description: 'Plantilla mínima para crear y mover campos.',
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Abrir ejemplo Editor básico/ })).toHaveAttribute(
      'href',
      '/lab/basic-designer',
    );
  });

  it('renders a grid with one card per example', () => {
    render(
      <MemoryRouter>
        <CaseGrid
          examples={[
            {
              id: 'one',
              defaultMode: 'designer',
              path: '/lab/one',
              title: 'Uno',
              description: 'Primer caso.',
            },
            {
              id: 'two',
              defaultMode: 'form',
              path: '/lab/two',
              title: 'Dos',
              description: 'Segundo caso.',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /Abrir ejemplo Uno/ })).toHaveAttribute('href', '/lab/one');
    expect(screen.getByRole('link', { name: /Abrir ejemplo Dos/ })).toHaveAttribute('href', '/lab/two');
  });

  it('renders an empty grid without cards when there are no examples', () => {
    render(
      <MemoryRouter>
        <CaseGrid />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('article')).toBeNull();
  });

  it('omits case cards when the example is missing', () => {
    render(
      <MemoryRouter>
        <CaseCard example={null} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('article')).toBeNull();
  });

  it('shows a compact page header with a collapsible collaborator roster', () => {
    render(
      <PageHeader
        example={{
          id: 'multiuser-collaboration',
          path: '/lab/multiuser-collaboration',
          title: 'Colaboración multiusuario',
          description: 'Ownership individual, grupal y compartido.',
          collaboration: { sessionId: 'multiuser-collaboration-session' },
        }}
        pageMetrics={[
          { label: 'Estado', value: 'Listo' },
          { label: 'Modo', value: 'Diseñador' },
        ]}
        collaborationUsers={[
          { id: 'sales-user-1', name: 'Ventas Ejecutivas', role: 'owner', team: 'sales' },
          { id: 'legal-user-1', name: 'Revisor Legal', role: 'reviewer', team: 'legal' },
          { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops' },
        ]}
        activeCollaborator={{ id: 'sales-user-1', name: 'Ventas Ejecutivas' }}
        onActiveCollaboratorChange={vi.fn()}
        isGlobalView={false}
        onToggleGlobalView={vi.fn()}
        status="Listo para probar"
        backLink={<a href="/lab">Volver al índice</a>}
        controls={<button type="button">Abrir controles</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Colaboración multiusuario' })).toBeVisible();
    expect(screen.getByText('Estado')).toBeVisible();
    expect(screen.getByText('Listo')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Abrir controles' })).toBeVisible();

    const collaboratorSummary = screen.getByText(
      (_, element) => element?.tagName?.toLowerCase() === 'summary' && element.textContent?.includes('Participantes'),
    );
    const collaboratorDisclosure = collaboratorSummary?.closest('details');
    expect(collaboratorDisclosure).toBeTruthy();
    if (!collaboratorDisclosure) return;

    expect(collaboratorSummary).toHaveTextContent('Ventas Ejecutivas');
    expect(collaboratorSummary).toHaveTextContent('3');
    fireEvent.click(collaboratorSummary);
    expect(screen.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('sales-user-1');
    expect(screen.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('user');
  });

  it('omits the collaborator roster when there are no collaborating users', () => {
    render(
      <PageHeader
        example={{
          id: 'singleuser-lab',
          path: '/lab/singleuser-lab',
          title: 'Uso individual',
          description: 'Sin roster colaborativo.',
        }}
        pageMetrics={[
          { label: 'Estado', value: 'Listo' },
        ]}
        status="Listo para probar"
      />,
    );

    expect(screen.queryByRole('button', { name: /Participantes/ })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Uso individual' })).toBeVisible();
  });

  it('toggles results visibility based on generated artifacts', () => {
    const { rerender } = render(
      <ResultsPanel
        generatedPdfUrl=""
        pdfSizes={[]}
        images={[]}
        roundtripPdfUrl=""
        hasGeneratedArtifacts={false}
      />,
    );

    const closedDetails = document.querySelector('.sisad-pdfme-lab-results');
    expect(closedDetails).not.toHaveAttribute('open');

    rerender(
      <ResultsPanel
        generatedPdfUrl="blob:generated"
        pdfSizes={[
          { width: 210, height: 297 },
          { width: 148, height: 210 },
        ]}
        images={['blob:image-1']}
        roundtripPdfUrl="blob:roundtrip"
        hasGeneratedArtifacts
      />,
    );

    expect(document.querySelector('.sisad-pdfme-lab-results')).toHaveAttribute('open');
    expect(screen.getByRole('link', { name: 'Abrir PDF generado' })).toHaveAttribute('href', 'blob:generated');
    expect(screen.getByText('Página 2: 148 x 210')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Abrir PDF de ida y vuelta' })).toHaveAttribute('href', 'blob:roundtrip');
  });

  it('keeps the results panel collapsed and informative before generation', () => {
    render(
      <ResultsPanel
        generatedPdfUrl=""
        pdfSizes={[]}
        images={[]}
        roundtripPdfUrl=""
        hasGeneratedArtifacts={false}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Resultados' })).toBeVisible();
    const summary = screen.getByText('Oculto').closest('summary');
    expect(summary).toBeTruthy();
    if (!summary) return;

    expect(screen.getByText('Aún no se ha ejecutado pdf2size.')).not.toBeVisible();
    expect(screen.getByText('No hay PDF generado todavía.')).not.toBeVisible();

    fireEvent.click(summary);
    expect(screen.getByText('Aún no se ha ejecutado pdf2size.')).toBeVisible();
    expect(screen.getByText('No hay PDF generado todavía.')).toBeVisible();
  });

  it('shows designer actions only in designer mode inside the compact controls menu', () => {
    render(
      <CompactControls
        mode="designer"
        onModeChange={vi.fn()}
        onGenerate={vi.fn()}
        onPdf2Size={vi.fn()}
        onPdf2Img={vi.fn()}
        onImg2Pdf={vi.fn()}
        onAddPage={vi.fn()}
        onFitPage={vi.fn()}
        onFitWidth={vi.fn()}
        onAddSchema={vi.fn()}
        onReset={vi.fn()}
        schemaCatalog={[
          { type: 'text', category: 'General', label: 'Texto' },
          { type: 'select', category: 'General', label: 'Select' },
        ]}
        schemaType="text"
        onSchemaTypeChange={vi.fn()}
        busy={false}
        hasGeneratedPdf={false}
        hasImages={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Controles' }));
    const menu = screen.getByRole('menu');
    expect(menu).toBeVisible();
    expect(within(menu).getByRole('button', { name: /Diseñador/ })).toBeVisible();
    expect(within(menu).getByRole('button', { name: /Generar PDF/ })).toBeVisible();
    expect(within(menu).getByRole('button', { name: /Agregar página/ })).toBeVisible();
    expect(within(menu).getByRole('button', { name: /Ajustar al ancho/ })).toBeVisible();
  });

  it('hides designer-only canvas actions when the compact controls menu is not in designer mode', () => {
    render(
      <CompactControls
        mode="form"
        onModeChange={vi.fn()}
        onGenerate={vi.fn()}
        onPdf2Size={vi.fn()}
        onPdf2Img={vi.fn()}
        onImg2Pdf={vi.fn()}
        onAddPage={vi.fn()}
        onFitPage={vi.fn()}
        onFitWidth={vi.fn()}
        onAddSchema={vi.fn()}
        onReset={vi.fn()}
        schemaCatalog={[]}
        schemaType="text"
        onSchemaTypeChange={vi.fn()}
        busy={false}
        hasGeneratedPdf={false}
        hasImages={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Controles' }));
    const menu = screen.getByRole('menu');
    expect(menu).toBeVisible();
    expect(within(menu).getByRole('button', { name: /Generar PDF/ })).toBeVisible();
    expect(within(menu).queryByRole('button', { name: /Agregar página/ })).toBeNull();
    expect(within(menu).queryByRole('button', { name: /Ajustar a página/ })).toBeNull();
  });
});
