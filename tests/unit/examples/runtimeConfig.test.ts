/**
 * Configuración global de los ejemplos.
 *
 * Protege las dos promesas del JSON único: que `base` deje encendida toda la
 * funcionalidad del componente y que un perfil solo cambie lo que declara.
 */
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

import {
  EXAMPLE_CONFIG_PROFILES,
  createRuntimeConfig,
} from '@/examples/index.jsx';

describe('createRuntimeConfig', () => {
  it('expone un perfil por cada tipo de ruta de ejemplo', () => {
    expect(EXAMPLE_CONFIG_PROFILES).toEqual([
      'designer-single-user',
      'designer-multi-user',
      'runtime-form',
      'runtime-viewer',
      'schema-family',
    ]);
  });

  it('deja activada toda la funcionalidad en la configuración base', () => {
    const config = createRuntimeConfig();

    expect(config.canvas).toMatchObject({
      enabled: true,
      selecto: true,
      moveable: true,
      snapLines: true,
      guides: true,
      multiSelect: true,
    });
    expect(config.sidebars?.left?.allowCustomFields).toBe(true);
    expect(config.sidebars?.right?.panels).toEqual(['fields', 'detail', 'comments', 'documents']);
    expect(config.assignment?.enabled).toBe(true);
    expect(config.signatures?.providers).toHaveLength(3);
    expect(config.visibility?.sidebars?.right?.panels).toMatchObject({
      fields: true,
      detail: true,
      comments: true,
      documents: true,
    });
    expect(config.visibility?.inspector?.sections?.validation).toBe(true);
    expect(config.visibility?.modals?.assignment).toBe(true);
  });

  it('aplica el perfil sin perder el resto de la base', () => {
    const config = createRuntimeConfig('runtime-viewer');

    expect(config.runtime).toMatchObject({ mode: 'viewer', readonly: true });
    expect(config.collaboration?.isGlobalView).toBe(true);
    // Fuera del parche, la base sigue intacta.
    expect(config.canvas?.moveable).toBe(true);
    expect(config.signatures?.providers).toHaveLength(3);
  });

  it('nunca declara el recipient activo: ese dato viaja como prop', () => {
    EXAMPLE_CONFIG_PROFILES.forEach((profile) => {
      expect(createRuntimeConfig(profile).recipients?.activeRecipientId).toBeNull();
      expect(createRuntimeConfig(profile).collaboration).not.toHaveProperty('activeRecipientId');
    });
  });

  it('combina objetos en profundidad y reemplaza arrays', () => {
    const config = createRuntimeConfig('designer-multi-user', {
      sidebars: { right: { panels: ['fields'] } },
    });

    expect(config.sidebars?.right?.panels).toEqual(['fields']);
    // El resto del bloque `right` sobrevive al override parcial.
    expect(config.sidebars?.right?.defaultPanel).toBe('comments');
    expect(config.sidebars?.right?.showCollapsedButton).toBe(true);
    expect(config.sidebars?.left?.enabled).toBe(true);
  });

  it('no comparte estado entre llamadas, ni en las secciones que el perfil no toca', () => {
    const first = createRuntimeConfig('designer-single-user');
    (first.sidebars as { right: { defaultPanel: string } }).right.defaultPanel = 'comments';
    // `canvas` no aparece en ningún perfil: es el caso que delataría el alias.
    (first.canvas as { moveable: boolean }).moveable = false;
    (first.signatures as { providers: unknown[] }).providers.pop();

    const second = createRuntimeConfig('designer-single-user');
    expect(second.sidebars?.right?.defaultPanel).toBe('detail');
    expect(second.canvas?.moveable).toBe(true);
    expect(second.signatures?.providers).toHaveLength(3);

    // Y tampoco entre perfiles distintos.
    expect(createRuntimeConfig('runtime-form').canvas?.moveable).toBe(true);
  });
});
